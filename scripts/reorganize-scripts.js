const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const scriptsDir = __dirname;

// Define the new organization structure
const fileOrganization = {
  'add': [
    'add-export-to-report.js',
    'add-interactive-source-to-report.js'
  ],
  'export': [
    'export-coverage.ts'
  ],
  'analysis/analyze': [
    'analyze-mock-coverage.ts',
    'analyze-coverage.ts',
    'analyze-mock-app.ts'
  ],
  'analysis/correlate': [
    'correlate-coverage.ts'
  ],
  'analysis/scan': [
    'scan-mock-app.ts'
  ],
  'analysis/check': [
    'check-plugin.js'
  ],
  'generate': [
    'generate-html-report.ts',
    'generate-simple-report.js',
    'generate-instrumented-report.js',
    'generate-test-ids.ts'
  ],
  'run': [
    'run-instrumented-jest.js',
    'run-instrumented-coverage.ts'
  ]
};

// Import mapping to update
const importUpdates = [
  {
    file: 'generate/generate-html-report.ts',
    oldImport: './export-coverage',
    newImport: '../export/export-coverage'
  }
  // Add more import updates as needed
];

// Create an import tracker to automatically detect and update imports
const fileToNewPath = {};
const importChecks = [];

// Process each file organization
for (const [dir, files] of Object.entries(fileOrganization)) {
  // Create directory if it doesn't exist
  const targetDir = path.join(scriptsDir, dir);
  
  // Populate the file path mapping for import tracking
  for (const file of files) {
    const originalPath = path.join(scriptsDir, file);
    const newPath = path.join(targetDir, file);
    fileToNewPath[file] = { originalPath, newPath, dir };
  }
}

// Check for imports between files in our organization
for (const [file, { originalPath }] of Object.entries(fileToNewPath)) {
  if (!fs.existsSync(originalPath)) {
    console.log(`File does not exist: ${originalPath}`);
    continue;
  }

  try {
    const content = fs.readFileSync(originalPath, 'utf8');
    
    // Look for imports/requires
    const lines = content.split('\n');
    for (const line of lines) {
      // Check for import statements or requires referencing other files
      const importMatch = line.match(/import.*from ['"](\.\/.+?)['"]/) || 
                          line.match(/const .* = require\(['"](\.\/.+?)['"]\)/);
      
      if (importMatch) {
        const importPath = importMatch[1];
        const importFile = path.basename(importPath);
        
        // Check if this imported file is also being moved
        if (Object.keys(fileToNewPath).some(f => importFile.includes(f.replace('.ts', '').replace('.js', '')))) {
          importChecks.push({
            sourceFile: file,
            importFile,
            importPath
          });
        }
      }
    }
  } catch (err) {
    console.error(`Error reading file ${originalPath}:`, err);
  }
}

// Move files and update imports
console.log('Moving files to their new locations...');

for (const [dir, files] of Object.entries(fileOrganization)) {
  for (const file of files) {
    const originalPath = path.join(scriptsDir, file);
    const targetPath = path.join(scriptsDir, dir, file);
    
    if (fs.existsSync(originalPath)) {
      // Create directory if needed
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // Move the file
      fs.copyFileSync(originalPath, targetPath);
      console.log(`Moved ${file} to ${dir}/`);
    } else {
      console.log(`File not found: ${originalPath}`);
    }
  }
}

// Update imports in files
console.log('\nUpdating imports...');

for (const update of importUpdates) {
  const filePath = path.join(scriptsDir, update.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(
      new RegExp(`from ['"]${update.oldImport}['"]`, 'g'), 
      `from '${update.newImport}'`
    );
    content = content.replace(
      new RegExp(`require\\(['"]${update.oldImport}['"]\\)`, 'g'), 
      `require('${update.newImport}')`
    );
    fs.writeFileSync(filePath, content);
    console.log(`Updated imports in ${update.file}`);
  } else {
    console.log(`Cannot update imports, file not found: ${filePath}`);
  }
}

// Create a README for the scripts structure
const readmePath = path.join(scriptsDir, 'README.md');
const readmeContent = `# Scripts Directory Structure

This directory contains various scripts organized by their purpose:

- **add/**: Scripts that add features or functionality to reports
  - \`add-export-to-report.js\`: Adds export functionality to coverage reports
  - \`add-interactive-source-to-report.js\`: Adds interactive source code to reports

- **export/**: Scripts for exporting coverage data
  - \`export-coverage.ts\`: Exports coverage data in various formats

- **analysis/**: Scripts for analysis and inspection
  - **analyze/**: Coverage and application analysis
    - \`analyze-mock-coverage.ts\`: Analyzes coverage for mock components
    - \`analyze-coverage.ts\`: Analyzes generic coverage data
    - \`analyze-mock-app.ts\`: Analyzes mock applications
  - **correlate/**: Correlation between tests and components
    - \`correlate-coverage.ts\`: Correlates test coverage with components
  - **scan/**: Scanning tools
    - \`scan-mock-app.ts\`: Scans mock applications
  - **check/**: Validation tools
    - \`check-plugin.js\`: Checks the instrumentation plugin

- **generate/**: Scripts that generate reports and artifacts
  - \`generate-html-report.ts\`: Generates HTML coverage reports
  - \`generate-simple-report.js\`: Generates simplified reports
  - \`generate-instrumented-report.js\`: Generates reports for instrumented code
  - \`generate-test-ids.ts\`: Generates test IDs

- **run/**: Scripts that execute tests or coverage
  - \`run-instrumented-jest.js\`: Runs Jest with instrumentation
  - \`run-instrumented-coverage.ts\`: Runs instrumented coverage analysis

## Usage

Most scripts can be run using \`ts-node\` for TypeScript files or \`node\` for JavaScript files:

\`\`\`bash
# Running TypeScript scripts
npx ts-node generate/generate-html-report.ts

# Running JavaScript scripts
node add/add-export-to-report.js
\`\`\`
`;

fs.writeFileSync(readmePath, readmeContent);
console.log('Created README.md with directory structure documentation');

console.log('\nReorganization complete!');
console.log('\nIMPORTANT: The original files still exist in the root directory.');
console.log('After verifying everything works correctly, you may want to clean up:');
console.log('rm /Users/tylerhenry/Documents/GitHub/jogger/coverage-venn/scripts/*.{js,ts}');
console.log('(do not run this command until you verify the new structure works properly)'); 