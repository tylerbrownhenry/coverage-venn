/**
 * Script to rename instrumentation files to a standardized naming convention
 */

const fs = require('fs');
const path = require('path');

// Base directory for instrumentation folders
const BASE_DIR = path.resolve(__dirname);

// Instrumentation types
const TYPES = ['function', 'jsx', 'try-catch', 'switch', 'async', 'flow'];

// File renaming mapping for each type
const RENAME_MAPPING = {
  // Main test files
  'test-([\\w-]+)-instrumentation\\.ts': 'test-$1.ts',
  'test-([\\w-]+)-instrumentation\\.js': 'test-$1.js',
  'test-([\\w-]+)-instrumentation-fixed\\.js': 'test-$1-fixed.js',
  'test-([\\w-]+)-instrumentation-simple\\.js': 'test-$1-simple.js',
  
  // Plugin files
  'coverage-instrumentation-plugin\\.js': '$TYPE-plugin.js',
  '([\\w-]+)-function-plugin\\.js': '$1-plugin.js',
  '([\\w-]+)-support-plugin\\.js': '$1-plugin.js',
  
  // Runner files
  'run-([\\w-]+)-test\\.js': 'run-$1.js'
};

// Process each instrumentation type folder
for (const type of TYPES) {
  console.log(`Processing ${type} folder...`);
  const typeDir = path.join(BASE_DIR, type);
  
  // Skip if directory doesn't exist
  if (!fs.existsSync(typeDir)) {
    console.log(`  Directory for ${type} doesn't exist, skipping`);
    continue;
  }
  
  // Get all files in the directory
  const files = fs.readdirSync(typeDir);
  
  // Process each file that matches our patterns
  for (const file of files) {
    // Skip directories and temp folders
    if (fs.statSync(path.join(typeDir, file)).isDirectory()) {
      continue;
    }
    
    let newFilename = null;
    
    // Check each pattern for a match
    for (const pattern in RENAME_MAPPING) {
      const regex = new RegExp(pattern);
      if (regex.test(file)) {
        // Replace the pattern with the new format
        newFilename = file.replace(regex, RENAME_MAPPING[pattern].replace('$TYPE', type));
        break;
      }
    }
    
    // If we found a match, rename the file
    if (newFilename && newFilename !== file) {
      console.log(`  Renaming ${file} to ${newFilename}`);
      fs.renameSync(
        path.join(typeDir, file),
        path.join(typeDir, newFilename)
      );
    } else {
      console.log(`  Skipping ${file} (no matching pattern or already correct)`);
    }
  }
}

console.log('\nFile renaming complete!'); 