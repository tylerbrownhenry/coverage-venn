#!/usr/bin/env node
"use strict";
/**
 * Consolidated component scanning script
 *
 * Usage:
 *   node scan.js [options]
 *
 * Options:
 *   --type=app          Scan actual application components (default)
 *   --type=mock         Scan mock application components
 *   --output=<path>     Output path for the scan results
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const args = process.argv.slice(2);
// Parse options
const typeArg = args.find(arg => arg.startsWith('--type='));
const type = typeArg ? typeArg.split('=')[1] : 'app';
const outputArg = args.find(arg => arg.startsWith('--output='));
const outputPath = outputArg ? outputArg.split('=')[1] : null;
// Remove processed flags from args to pass remaining args
const remainingArgs = args.filter(arg => !arg.startsWith('--type=') && !arg.startsWith('--output='));
if (outputPath) {
    remainingArgs.push('--output', outputPath);
}
// Check if scripts exist before attempting to run them
const rootDir = path.resolve(__dirname, '..');
function scriptExists(scriptPath) {
    return fs.existsSync(path.join(rootDir, scriptPath));
}
// Get available scripts for logging
function getAvailableScripts() {
    try {
        const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
        return Object.keys(packageJson.scripts).filter(script => script.includes('scan') || script.includes('analyze'));
    }
    catch (error) {
        return [];
    }
}
// Main function to scan components
async function scanComponents() {
    console.log(`Scanning ${type} components...`);
    try {
        // Use the analyze-mock-app.ts script for all scan types
        // This script has been fixed to work with the new structure
        const scriptPath = 'scripts/analysis/analyze/analyze-mock-app.ts';
        if (scriptExists(scriptPath)) {
            await runCommand('ts-node', [scriptPath, ...remainingArgs]);
            console.log('Component scanning completed successfully!');
        }
        else {
            throw new Error(`Scan script not found at ${scriptPath}`);
        }
    }
    catch (error) {
        console.error('Error scanning components:', error.message);
        // Suggest alternatives
        const availableScripts = getAvailableScripts();
        if (availableScripts.length > 0) {
            console.log('\nAvailable scan and analyze scripts:');
            availableScripts.forEach(script => {
                console.log(`- npm run ${script}`);
            });
        }
        process.exit(1);
    }
}
// Helper function to run a command as a promise
function runCommand(cmd, args) {
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, args, { stdio: 'inherit', shell: true });
        child.on('close', code => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });
    });
}
// Run the component scan
scanComponents();
