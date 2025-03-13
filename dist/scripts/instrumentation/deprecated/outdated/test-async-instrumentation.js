"use strict";
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
const testDir = path.resolve(__dirname, '../.instrumentation-test/async-test');
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
            path.resolve(__dirname, '../src/instrumentation/babel/async-function-plugin.js')
        ],
        filename: path.basename(sourceFile)
    });
    fs.writeFileSync(instrumentedFile, result.code);
    console.log(`Instrumented code written to: ${instrumentedFile}`);
}
catch (error) {
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
    // Print full coverage data
    console.log('\n--- Full Coverage Data ---');
    execSync(`node -e "const tracker = require('${coverageTrackerFile}'); console.log(JSON.stringify(tracker.coverageData, null, 2))"`, {
        stdio: 'inherit'
    });
    // Print summary after execution
    console.log('\n--- Coverage Summary ---');
    execSync(`node -e "const tracker = require('${coverageTrackerFile}'); console.log(JSON.stringify(tracker.getCoverageReport().summary, null, 2))"`, {
        stdio: 'inherit'
    });
    // Display persisted coverage data from file
    console.log('\n--- Persisted Coverage Data ---');
    execSync(`node -e "const fs = require('fs'); const path = require('path'); const coverageFile = path.resolve('${testDir}', 'async-coverage-data.json'); if (fs.existsSync(coverageFile)) { const data = JSON.parse(fs.readFileSync(coverageFile, 'utf8')); console.log('Data exists in file? ' + (Object.keys(data.asyncFunctions).length > 0)); console.log('Async functions tracked:', Object.keys(data.asyncFunctions).length); console.log('Promises tracked:', Object.keys(data.promises).length); }"`, {
        stdio: 'inherit'
    });
    console.log('\nAsync instrumentation test completed successfully!');
}
catch (error) {
    console.error('Error executing instrumented code:', error);
    process.exit(1);
}
