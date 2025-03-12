#!/usr/bin/env node

/**
 * Coverage Report Generator
 * 
 * This script generates various types of coverage reports based on command-line arguments.
 * 
 * Usage:
 *   node scripts/report.js [options]
 * 
 * Options:
 *   --basic       Generate a basic HTML report
 *   --export      Generate report with export functionality
 *   --interactive Generate report with interactive features
 *   --full        Generate a full report with all features
 * 
 * Examples:
 *   npm run report:basic       # Basic HTML report
 *   npm run report:export      # Report with export functionality
 *   npm run report:interactive # Report with interactive features
 *   npm run report:full        # Full report with all features
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const isBasic = args.includes('--basic');
const isExport = args.includes('--export');
const isInteractive = args.includes('--interactive');
const isFull = args.includes('--full');

// Default to basic if no options specified
const reportType = isFull ? 'full' : 
                  isInteractive ? 'interactive' : 
                  isExport ? 'export' : 
                  'basic';

console.log(`Generating ${reportType} coverage report...`);

// Check if coverage data exists
const coverageDir = path.join(process.cwd(), 'coverage');
const coverageFile = path.join(coverageDir, 'coverage-final.json');

if (!fs.existsSync(coverageFile)) {
  console.error('No coverage data found. Please run coverage collection first:');
  console.error('  npm run coverage -- --type=mock');
  process.exit(1);
}

// Generate the appropriate report based on options
try {
  // Base functionality - generate HTML report from lcov data
  execSync('npx istanbul report --include=coverage/coverage-final.json lcov', { stdio: 'inherit' });
  
  // Additional processing based on report type
  if (isExport || isInteractive || isFull) {
    console.log('Adding export functionality...');
    // Add export buttons to HTML report using custom script
    const exportScript = path.join(__dirname, 'add-export-functionality.js');
    if (fs.existsSync(exportScript)) {
      execSync(`node ${exportScript}`, { stdio: 'inherit' });
    } else {
      console.warn('Warning: Export script not found. Skipping export functionality.');
    }
  }
  
  if (isInteractive || isFull) {
    console.log('Adding interactive features...');
    // Add interactive features to HTML report
    const interactiveScript = path.join(__dirname, 'add-interactive-features.js');
    if (fs.existsSync(interactiveScript)) {
      execSync(`node ${interactiveScript}`, { stdio: 'inherit' });
    } else {
      console.warn('Warning: Interactive script not found. Skipping interactive features.');
    }
  }
  
  if (isFull) {
    console.log('Adding additional full report features...');
    // Add any additional features specific to full report
    const fullReportScript = path.join(__dirname, 'add-full-report-features.js');
    if (fs.existsSync(fullReportScript)) {
      execSync(`node ${fullReportScript}`, { stdio: 'inherit' });
    } else {
      console.warn('Warning: Full report script not found. Skipping additional features.');
    }
  }
  
  // Notify of success and provide instructions to view the report
  console.log('\nReport generation completed successfully!');
  console.log(`Report type: ${reportType}`);
  console.log('\nTo view the report in Chrome:');
  console.log('  macOS:  open -a "Google Chrome" coverage/lcov-report/index.html');
  console.log('  Windows: start chrome coverage/lcov-report/index.html');
  console.log('  Linux:  google-chrome coverage/lcov-report/index.html');
  
} catch (error) {
  console.error('Error generating report:', error.message);
  process.exit(1);
} 