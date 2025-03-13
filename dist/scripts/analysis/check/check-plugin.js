"use strict";
/**
 * Script to check if the coverage-instrumentation-plugin has issues
 */
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
// Create a simple test file
const testCode = `
// Test code
function add(a, b) {
  return a + b;
}

function greet(name) {
  return "Hello, " + name;
}

// Test calls
console.log(add(1, 2));
console.log(greet("World"));
`;
// Save the test file
const testFilePath = path.join(__dirname, 'test-code.js');
fs.writeFileSync(testFilePath, testCode);
// Plugin paths to check
const pluginPaths = [
    // Original location
    path.resolve(__dirname, '../src/instrumentation/babel/coverage-instrumentation-plugin.js'),
    // New location 1
    path.resolve(__dirname, 'instrumentation/jsx/coverage-instrumentation-plugin.js'),
    // New location 2
    path.resolve(__dirname, 'instrumentation/function/coverage-instrumentation-plugin.js')
];
// Test each plugin
for (const pluginPath of pluginPaths) {
    try {
        console.log(`\nTesting plugin at: ${pluginPath}`);
        if (!fs.existsSync(pluginPath)) {
            console.log(`  Plugin file not found, skipping...`);
            continue;
        }
        const result = babel.transformSync(testCode, {
            plugins: [pluginPath],
            filename: 'test-code.js'
        });
        if (result && result.code) {
            console.log(`  Transformation successful`);
            console.log(`  Output code length: ${result.code.length} characters`);
        }
        else {
            console.log(`  Transformation failed - no code returned`);
        }
    }
    catch (error) {
        console.log(`  Error: ${error.message}`);
        if (error.stack) {
            console.log(`  Stack trace: ${error.stack.split('\n')[0]}`);
        }
    }
}
// Clean up
fs.unlinkSync(testFilePath);
console.log('\nTest completed.');
