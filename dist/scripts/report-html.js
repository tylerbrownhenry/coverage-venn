#!/usr/bin/env node
"use strict";
/**
 * HTML Report Generator Script
 *
 * This script generates HTML coverage reports using templates
 * without running into TypeScript template literal issues.
 */
const fs = require('fs');
const path = require('path');
// Create directory if it doesn't exist
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}
// Get coverage class based on value
function getCoverageClass(coverage) {
    if (coverage === undefined)
        return 'low';
    if (coverage >= 80)
        return 'high';
    if (coverage >= 50)
        return 'medium';
    return 'low';
}
// Generate table rows HTML
function generateTableRows(data) {
    return data.map(item => {
        const coverageClass = getCoverageClass(item.coverage);
        return `<tr>
      <td>${item.name || ''}</td>
      <td>${item.path || ''}</td>
      <td class="${coverageClass}">${item.coverage ? item.coverage.toFixed(1) + '%' : '0%'}</td>
      <td>${item.tests || 0}</td>
      <td>${item.metrics?.statements ? item.metrics.statements.toFixed(1) + '%' : 'N/A'}</td>
      <td>${item.metrics?.branches ? item.metrics.branches.toFixed(1) + '%' : 'N/A'}</td>
      <td>${item.metrics?.functions ? item.metrics.functions.toFixed(1) + '%' : 'N/A'}</td>
      <td>${item.metrics?.lines ? item.metrics.lines.toFixed(1) + '%' : 'N/A'}</td>
    </tr>`;
    }).join('');
}
// Generate HTML report
function generateReport(data, outputPath) {
    // Create timestamp
    const timestamp = new Date().toLocaleString();
    // Get template path
    const templatePath = path.resolve(__dirname, 'generate/templates/coverage-report-template.html');
    // Read template
    let template = fs.readFileSync(templatePath, 'utf8');
    // Generate table rows
    const tableRows = generateTableRows(data);
    // Replace placeholders
    template = template.replace(/{{timestamp}}/g, timestamp);
    template = template.replace(/{{table_rows}}/g, tableRows);
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    ensureDirectoryExists(outputDir);
    // Write to output file
    fs.writeFileSync(outputPath, template);
    console.log(`HTML report generated at: ${outputPath}`);
}
// Main function
function main() {
    try {
        // Get command line arguments
        const args = process.argv.slice(2);
        const inputDataPath = args[0];
        const outputPath = args[1] || 'coverage-report.html';
        if (!inputDataPath) {
            console.error('Please provide an input data JSON file path');
            process.exit(1);
        }
        // Read data
        const data = JSON.parse(fs.readFileSync(inputDataPath, 'utf8'));
        // Generate report
        generateReport(data, outputPath);
    }
    catch (error) {
        console.error('Error generating report:', error);
        process.exit(1);
    }
}
// Run main function
main();
