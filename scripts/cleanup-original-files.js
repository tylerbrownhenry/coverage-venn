/**
 * Cleanup script to remove original files after reorganization
 * 
 * IMPORTANT: Only run this after verifying that the reorganized structure works!
 */

const fs = require('fs');
const path = require('path');

const scriptsDir = __dirname;

// List of files that were moved
const movedFiles = [
  'add-export-to-report.js',
  'add-interactive-source-to-report.js',
  'export-coverage.ts',
  'analyze-mock-coverage.ts',
  'analyze-coverage.ts',
  'analyze-mock-app.ts',
  'correlate-coverage.ts',
  'scan-mock-app.ts',
  'check-plugin.js',
  'generate-html-report.ts',
  'generate-simple-report.js',
  'generate-instrumented-report.js',
  'generate-test-ids.ts',
  'run-instrumented-jest.js',
  'run-instrumented-coverage.ts'
];

console.log('This script will remove the original files from the root directory.');
console.log('Make sure you have verified that the reorganized structure works before running this!');
console.log('');

// Check if any files don't exist in their new locations
const missingFiles = [];
for (const file of movedFiles) {
  // Determine the new location based on the file prefix
  let newLocation;
  
  if (file.startsWith('add-')) {
    newLocation = path.join(scriptsDir, 'add', file);
  } else if (file.startsWith('export-')) {
    newLocation = path.join(scriptsDir, 'export', file);
  } else if (file.startsWith('analyze-')) {
    newLocation = path.join(scriptsDir, 'analysis/analyze', file);
  } else if (file.startsWith('correlate-')) {
    newLocation = path.join(scriptsDir, 'analysis/correlate', file);
  } else if (file.startsWith('scan-')) {
    newLocation = path.join(scriptsDir, 'analysis/scan', file);
  } else if (file.startsWith('check-')) {
    newLocation = path.join(scriptsDir, 'analysis/check', file);
  } else if (file.startsWith('generate-')) {
    newLocation = path.join(scriptsDir, 'generate', file);
  } else if (file.startsWith('run-')) {
    newLocation = path.join(scriptsDir, 'run', file);
  }
  
  if (!fs.existsSync(newLocation)) {
    missingFiles.push({ file, newLocation });
  }
}

if (missingFiles.length > 0) {
  console.log('WARNING: The following files are missing in their new locations:');
  for (const { file, newLocation } of missingFiles) {
    console.log(`  - ${file} (should be at ${newLocation})`);
  }
  console.log('Please fix these issues before running this script again.');
  process.exit(1);
}

// Remove the original files
console.log('Removing original files...');
let removedCount = 0;

for (const file of movedFiles) {
  const originalPath = path.join(scriptsDir, file);
  
  if (fs.existsSync(originalPath)) {
    fs.unlinkSync(originalPath);
    console.log(`Removed ${file}`);
    removedCount++;
  } else {
    console.log(`File already removed: ${file}`);
  }
}

console.log(`\nCleanup complete! Removed ${removedCount} original files.`);
console.log('The scripts directory has been successfully reorganized.'); 