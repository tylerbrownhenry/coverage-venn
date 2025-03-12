/**
 * Test script for async function and promise instrumentation
 * 
 * This script:
 * 1. Creates a test directory
 * 2. Sets up a coverage tracker file
 * 3. Creates a test file with async functions
 * 4. Runs Babel to transform the file with our plugin
 * 5. Executes the instrumented code
 * 6. Logs coverage data
 */

const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const { execSync } = require('child_process');

// Set up test environment
const testDir = path.resolve(__dirname, 'temp');
const sourceFile = path.resolve(testDir, 'async-test.js');
const instrumentedFile = path.resolve(testDir, 'instrumented-async-test.js');
const coverageTrackerFile = path.resolve(testDir, 'coverage-tracker.js');

console.log('Setting up async function instrumentation test...');
console.log(`Test directory: ${testDir}`);

// Ensure the test directory exists
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

// Check if test files already exist
if (!fs.existsSync(sourceFile)) {
  console.error(`Error: Test file not found at ${sourceFile}`);
  console.error('Please create an async test file at this location first.');
  process.exit(1);
}

if (!fs.existsSync(coverageTrackerFile)) {
  console.error(`Error: Coverage tracker not found at ${coverageTrackerFile}`);
  console.error('Please create a coverage tracker file at this location first.');
  process.exit(1);
}

// Transform file with our plugin
try {
  console.log('Instrumenting async functions with Babel plugin...');
  
  const result = babel.transformFileSync(sourceFile, {
    presets: [
      '@babel/preset-env'
    ],
    plugins: [
      path.resolve(__dirname, 'async-function-plugin.js')
    ],
    filename: path.basename(sourceFile)
  });

  fs.writeFileSync(instrumentedFile, result.code);
  console.log(`Instrumented code written to: ${instrumentedFile}`);
} catch (error) {
  console.error('Error during Babel transformation:', error);
  process.exit(1);
}

// Execute the instrumented file
console.log('\nRunning instrumented async code...');
try {
  // Require the coverage tracker first
  execSync(`node -e "require('${coverageTrackerFile}'); require('${instrumentedFile}')"`, { 
    stdio: 'inherit',
    // Set a longer timeout for async operations
    timeout: 5000
  });
} catch (error) {
  console.error('Error executing instrumented code:', error);
  process.exit(1);
}

console.log('\nInstrumentation test completed successfully!'); 