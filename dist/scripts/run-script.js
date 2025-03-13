#!/usr/bin/env node
"use strict";
/**
 * Helper script to run scripts in their new locations
 *
 * Usage:
 * node run-script.js analyze/analyze-mock-coverage
 * node run-script.js generate/generate-html-report
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const scriptsDir = __dirname;
// Get the script name from command line arguments
const scriptArg = process.argv[2];
if (!scriptArg) {
    console.error('Please provide a script name to run.');
    console.error('Usage: node run-script.js <script-name>');
    console.error('Example: node run-script.js analyze/analyze-mock-coverage');
    process.exit(1);
}
// Create a mapping of old script names to new locations
const scriptMapping = {
    // Add -> add/
    'add-export-to-report': 'add/add-export-to-report.js',
    'add-interactive-source-to-report': 'add/add-interactive-source-to-report.js',
    // Export -> export/
    'export-coverage': 'export/export-coverage.ts',
    // Analyze -> analysis/analyze/
    'analyze-mock-coverage': 'analysis/analyze/analyze-mock-coverage.ts',
    'analyze-coverage': 'analysis/analyze/analyze-coverage.ts',
    'analyze-mock-app': 'analysis/analyze/analyze-mock-app.ts',
    // Correlate -> analysis/correlate/
    'correlate-coverage': 'analysis/correlate/correlate-coverage.ts',
    // Scan -> analysis/scan/
    'scan-mock-app': 'analysis/scan/scan-mock-app.ts',
    // Check -> analysis/check/
    'check-plugin': 'analysis/check/check-plugin.js',
    // Generate -> generate/
    'generate-html-report': 'generate/generate-html-report.ts',
    'generate-simple-report': 'generate/generate-simple-report.js',
    'generate-instrumented-report': 'generate/generate-instrumented-report.js',
    'generate-test-ids': 'generate/generate-test-ids.ts',
    // Run -> run/
    'run-instrumented-jest': 'run/run-instrumented-jest.js',
    'run-instrumented-coverage': 'run/run-instrumented-coverage.ts'
};
// Resolve the script path
let scriptPath;
// Check if the user provided the direct path to the script in the new structure
if (scriptArg.includes('/')) {
    scriptPath = path.join(scriptsDir, scriptArg);
    // Add extension if not provided
    if (!path.extname(scriptPath)) {
        // Try .ts first
        if (fs.existsSync(`${scriptPath}.ts`)) {
            scriptPath = `${scriptPath}.ts`;
        }
        // Then try .js
        else if (fs.existsSync(`${scriptPath}.js`)) {
            scriptPath = `${scriptPath}.js`;
        }
    }
}
// Otherwise, look up in the mapping
else {
    const mappedPath = scriptMapping[scriptArg];
    if (!mappedPath) {
        console.error(`Error: Unknown script "${scriptArg}".`);
        console.error('Available scripts:');
        Object.keys(scriptMapping).forEach(key => console.error(`  - ${key}`));
        process.exit(1);
    }
    scriptPath = path.join(scriptsDir, mappedPath);
}
// Check if the script exists
if (!fs.existsSync(scriptPath)) {
    console.error(`Error: Script not found at ${scriptPath}`);
    process.exit(1);
}
console.log(`Running script: ${scriptPath}`);
// Determine how to run the script based on its extension
const ext = path.extname(scriptPath);
let command;
if (ext === '.ts') {
    command = `cd ${path.dirname(scriptsDir)} && npx ts-node ${scriptPath}`;
}
else {
    command = `cd ${path.dirname(scriptsDir)} && node ${scriptPath}`;
}
// Pass along any additional arguments
const additionalArgs = process.argv.slice(3).join(' ');
if (additionalArgs) {
    command += ` ${additionalArgs}`;
}
// Run the script
try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
}
catch (error) {
    // The error output will be shown through stdio: 'inherit'
    process.exit(error.status || 1);
}
