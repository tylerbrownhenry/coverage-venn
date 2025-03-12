#!/usr/bin/env node

/**
 * Consolidated coverage operations script
 * 
 * Usage:
 *   node coverage.js [options] [--type=<type>]
 * 
 * Options:
 *   --run              Run tests with coverage
 *   --analyze          Analyze coverage results
 *   --report           Generate coverage report
 *   --all              Run full coverage workflow (default)
 *   --type=instrumented Use instrumented coverage
 *   --type=mock        Use mock coverage data
 */

const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const hasFlag = flag => args.includes(flag);

// Parse options
const shouldRun = hasFlag('--run') || hasFlag('--all') || args.length === 0;
const shouldAnalyze = hasFlag('--analyze') || hasFlag('--all') || args.length === 0;
const shouldReport = hasFlag('--report') || hasFlag('--all') || args.length === 0;

const typeArg = args.find(arg => arg.startsWith('--type='));
const type = typeArg ? typeArg.split('=')[1] : 'standard';

// Remove processed flags from args to pass remaining args
const remainingArgs = args.filter(arg => 
  !['--run', '--analyze', '--report', '--all'].includes(arg) && 
  !arg.startsWith('--type=')
);

// Main function to orchestrate coverage operations
async function processCoverage() {
  console.log(`Processing ${type} coverage...`);
  
  try {
    if (shouldRun) {
      console.log('Running tests with coverage...');
      if (type === 'instrumented') {
        await runCommand('node', ['scripts/run/run-instrumented-jest.js', ...remainingArgs]);
      } else {
        await runCommand('jest', ['--coverage', ...remainingArgs]);
      }
    }
    
    if (shouldAnalyze) {
      console.log('Analyzing coverage results...');
      if (type === 'mock') {
        await runCommand('ts-node', ['scripts/analysis/analyze/analyze-mock-coverage.ts', ...remainingArgs]);
      } else {
        await runCommand('ts-node', ['scripts/analysis/analyze/analyze-coverage.ts', ...remainingArgs]);
      }
      
      console.log('Correlating coverage data...');
      await runCommand('ts-node', ['scripts/analysis/correlate/correlate-coverage.ts', ...remainingArgs]);
    }
    
    if (shouldReport) {
      console.log('Generating coverage report...');
      if (type === 'instrumented') {
        await runCommand('node', ['scripts/generate/generate-instrumented-report.js', ...remainingArgs]);
      } else {
        await runCommand('node', ['scripts/report.js', '--full', ...remainingArgs]);
      }
    }
    
    console.log('Coverage processing completed successfully!');
  } catch (error) {
    console.error('Error processing coverage:', error);
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
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

// Run the coverage operations
processCoverage(); 