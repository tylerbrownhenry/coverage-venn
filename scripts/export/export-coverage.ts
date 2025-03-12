/**
 * Export Coverage Data Module
 * 
 * This module provides functionality to export coverage data in various formats (JSON, CSV, HTML).
 */

import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Adds export controls to the HTML report
 * @param html The HTML content to modify
 * @returns Modified HTML with export controls
 */
export function addExportControls(html: string): string {
  // Add CSS for export controls
  html = html.replace(
    '</style>',
    `
  /* Export Controls Styles */
  .export-controls {
    background-color: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 15px;
    margin: 20px 0;
  }
  
  .export-controls h3 {
    margin-top: 0;
    color: #2c3e50;
  }
  
  .export-format, .export-options {
    margin-bottom: 10px;
  }
  
  .export-format select, .export-button button {
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  
  .export-options label {
    display: block;
    margin: 5px 0;
  }
  
  .export-button button {
    background-color: #3498db;
    color: white;
    border: none;
    cursor: pointer;
    font-weight: bold;
  }
  
  .export-button button:hover {
    background-color: #2980b9;
  }
  
  /* Responsive adjustments for mobile */
  @media (max-width: 768px) {
    .export-controls {
      padding: 10px;
    }
  }
</style>`
  );

  // Add export controls to the controls section
  html = html.replace(
    '<div class="controls">',
    `<div class="controls">
      <div class="filter-group">
        <div class="filter-title">Export Options</div>
        <div class="export-controls">
          <div class="export-format">
            <label for="export-format">Format:</label>
            <select id="export-format">
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="html">HTML</option>
            </select>
          </div>
          <div class="export-options">
            <label>
              <input type="checkbox" id="export-visible-only" checked>
              Export only visible components
            </label>
            <label>
              <input type="checkbox" id="export-include-source" checked>
              Include source code information
            </label>
            <label>
              <input type="checkbox" id="export-include-tests" checked>
              Include test correlations
            </label>
          </div>
          <div class="export-button">
            <button id="export-button">Export Coverage Data</button>
          </div>
        </div>
      </div>`
  );

  // Add toggleDetails function if it doesn't exist
  if (!html.includes('function toggleDetails')) {
    html = html.replace(
      '<script>',
      `<script>
      // Toggle details function
      function toggleDetails(detailId) {
        const detailElement = document.getElementById(detailId);
        if (detailElement) {
          // Hide all other details first
          const allDetails = document.querySelectorAll('.component-details');
          allDetails.forEach(detail => {
            if (detail.id !== detailId && detail.style.display === 'block') {
              detail.style.display = 'none';
            }
          });
          
          // Toggle this detail
          if (detailElement.style.display === 'block') {
            detailElement.style.display = 'none';
          } else {
            detailElement.style.display = 'block';
            // Scroll to the detail
            detailElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          
          // Save expanded state to preferences if function exists
          if (typeof saveUserPreference === 'function') {
            saveUserPreference('expandedComponents', detailId, detailElement.style.display === 'block');
          }
        }
      }`
    );
  }

  // Add export functionality
  html = html.replace(
    '// Wait for DOM to be ready',
    `// Export functionality
      function exportCoverageData() {
        const format = document.getElementById('export-format').value;
        const visibleOnly = document.getElementById('export-visible-only').checked;
        const includeSource = document.getElementById('export-include-source').checked;
        const includeTests = document.getElementById('export-include-tests').checked;
        
        // Get components based on filters
        let components = [];
        const componentRows = document.querySelectorAll('tr.component-row');
        
        componentRows.forEach(row => {
          if (!visibleOnly || row.style.display !== 'none') {
            const componentId = row.getAttribute('data-component-id');
            const componentName = row.querySelector('td:first-child').textContent;
            const componentPath = row.querySelector('td:nth-child(2)').textContent;
            const coverage = parseFloat(row.querySelector('td:nth-child(3)').textContent);
            const testCount = parseInt(row.querySelector('td:nth-child(4)').textContent, 10);
            
            // Get metrics
            const metrics = {
              statements: parseMetricValue(row.querySelector('td:nth-child(5)').textContent),
              branches: parseMetricValue(row.querySelector('td:nth-child(6)').textContent),
              functions: parseMetricValue(row.querySelector('td:nth-child(7)').textContent),
              lines: parseMetricValue(row.querySelector('td:nth-child(8)').textContent)
            };
            
            // Build component data
            const component = {
              name: componentName,
              path: componentPath,
              coverage: coverage,
              testCount: testCount,
              metrics: metrics
            };
            
            // Add source code info if requested
            if (includeSource) {
              const detailsElement = document.getElementById('details-' + componentId);
              if (detailsElement) {
                const sourceInfo = {
                  coveredLines: [],
                  uncoveredLines: []
                };
                
                // Extract line numbers from the details section
                // This is simplified and would need to be adapted to your actual HTML structure
                component.sourceInfo = sourceInfo;
              }
            }
            
            // Add test correlations if requested
            if (includeTests) {
              const tests = [];
              const detailsElement = document.getElementById('details-' + componentId);
              if (detailsElement) {
                const testElements = detailsElement.querySelectorAll('.test-item');
                testElements.forEach(test => {
                  tests.push({
                    name: test.querySelector('.test-name').textContent,
                    confidence: parseFloat(test.querySelector('.test-confidence').textContent)
                  });
                });
              }
              component.tests = tests;
            }
            
            components.push(component);
          }
        });
        
        // Generate the export based on format
        let exportData;
        let fileName;
        let mimeType;
        
        if (format === 'json') {
          exportData = JSON.stringify(components, null, 2);
          fileName = 'coverage-export-' + new Date().toISOString().slice(0, 10) + '.json';
          mimeType = 'application/json';
        } else if (format === 'csv') {
          exportData = convertToCSV(components);
          fileName = 'coverage-export-' + new Date().toISOString().slice(0, 10) + '.csv';
          mimeType = 'text/csv';
        } else if (format === 'html') {
          exportData = generateExportHTML(components);
          fileName = 'coverage-export-' + new Date().toISOString().slice(0, 10) + '.html';
          mimeType = 'text/html';
        }
        
        // Trigger download
        downloadFile(exportData, fileName, mimeType);
        
        // Show notification
        const notification = document.getElementById('notification');
        if (notification) {
          notification.textContent = 'Export completed: ' + fileName;
          notification.style.display = 'block';
          setTimeout(() => {
            notification.style.display = 'none';
          }, 3000);
        }
      }
      
      // Helper function to parse metric values
      function parseMetricValue(value) {
        if (value === 'N/A') return null;
        return parseFloat(value.replace('%', ''));
      }
      
      // Helper function to convert data to CSV
      function convertToCSV(data) {
        // Define CSV headers based on data structure
        const headers = ['Name', 'Path', 'Coverage (%)', 'Test Count', 'Statements (%)', 'Branches (%)', 'Functions (%)', 'Lines (%)'];
        
        // Create CSV content
        let csvContent = headers.join(',') + '\\n';
        
        // Add data rows
        data.forEach(item => {
          const row = [
            '"' + (item.name || '') + '"',
            '"' + (item.path || '') + '"',
            item.coverage,
            item.testCount,
            item.metrics.statements !== null ? item.metrics.statements : 'N/A',
            item.metrics.branches !== null ? item.metrics.branches : 'N/A',
            item.metrics.functions !== null ? item.metrics.functions : 'N/A',
            item.metrics.lines !== null ? item.metrics.lines : 'N/A'
          ];
          csvContent += row.join(',') + '\\n';
        });
        
        return csvContent;
      }
      
      // Helper function to generate HTML export
      function generateExportHTML(data) {
        const timestamp = new Date().toLocaleString();
        
        let html = '<!DOCTYPE html>\\n';
        html += '<html lang="en">\\n';
        html += '<head>\\n';
        html += '  <meta charset="UTF-8">\\n';
        html += '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\\n';
        html += '  <title>Coverage Report Export - ' + timestamp + '</title>\\n';
        html += '  <style>\\n';
        html += '    body { font-family: sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; }\\n';
        html += '    h1 { color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px; }\\n';
        html += '    table { width: 100%; border-collapse: collapse; margin: 20px 0; }\\n';
        html += '    th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }\\n';
        html += '    th { background-color: #f5f5f5; }\\n';
        html += '    tr:hover { background-color: #f9f9f9; }\\n';
        html += '    .high { color: #27ae60; }\\n';
        html += '    .medium { color: #f39c12; }\\n';
        html += '    .low { color: #e74c3c; }\\n';
        html += '    footer { margin-top: 30px; color: #7f8c8d; font-size: 0.9em; }\\n';
        html += '  </style>\\n';
        html += '</head>\\n';
        html += '<body>\\n';
        html += '  <h1>Coverage Report Export</h1>\\n';
        html += '  <p>Generated on ' + timestamp + '</p>\\n';
        html += '  <table>\\n';
        html += '    <thead>\\n';
        html += '      <tr>\\n';
        html += '        <th>Component</th>\\n';
        html += '        <th>Path</th>\\n';
        html += '        <th>Coverage</th>\\n';
        html += '        <th>Tests</th>\\n';
        html += '        <th>Statements</th>\\n';
        html += '        <th>Branches</th>\\n';
        html += '        <th>Functions</th>\\n';
        html += '        <th>Lines</th>\\n';
        html += '      </tr>\\n';
        html += '    </thead>\\n';
        html += '    <tbody>\\n';
        
        // Add rows for each component
        data.forEach(item => {
          const coverageClass = item.coverage >= 80 ? 'high' : item.coverage >= 50 ? 'medium' : 'low';
          
          html += '      <tr>\\n';
          html += '        <td>' + (item.name || '') + '</td>\\n';
          html += '        <td>' + (item.path || '') + '</td>\\n';
          html += '        <td class="' + coverageClass + '">' + (item.coverage ? item.coverage.toFixed(1) + '%' : '0%') + '</td>\\n';
          html += '        <td>' + (item.testCount || 0) + '</td>\\n';
          html += '        <td>' + (item.metrics?.statements ? item.metrics.statements.toFixed(1) + '%' : 'N/A') + '</td>\\n';
          html += '        <td>' + (item.metrics?.branches ? item.metrics.branches.toFixed(1) + '%' : 'N/A') + '</td>\\n';
          html += '        <td>' + (item.metrics?.functions ? item.metrics.functions.toFixed(1) + '%' : 'N/A') + '</td>\\n';
          html += '        <td>' + (item.metrics?.lines ? item.metrics.lines.toFixed(1) + '%' : 'N/A') + '</td>\\n';
          html += '      </tr>\\n';
        });
        
        html += '    </tbody>\\n';
        html += '  </table>\\n';
        html += '  <footer>\\n';
        html += '    <p>This report was exported from the Coverage-Venn tool.</p>\\n';
        html += '  </footer>\\n';
        html += '</body>\\n';
        html += '</html>';
        
        return html;
      }
      
      // Helper function to download file
      function downloadFile(content, fileName, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      }
      
      // Wait for DOM to be ready`
  );

  // Add event listener for export button
  html = html.replace(
    'document.addEventListener(\'DOMContentLoaded\', function() {',
    `document.addEventListener('DOMContentLoaded', function() {
        // Setup export button
        const exportButton = document.getElementById('export-button');
        if (exportButton) {
          exportButton.addEventListener('click', exportCoverageData);
        }`
  );

  // Add notification div
  html = html.replace(
    '</div> <!-- End of controls -->',
    `  <div id="notification" style="display: none; position: fixed; bottom: 20px; right: 20px; background-color: #4CAF50; color: white; padding: 15px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 1000;"></div>
</div> <!-- End of controls -->`
  );

  return html;
}

/**
 * Modifies the main HTML report to include export functionality
 * @param htmlFilePath Path to the HTML report file
 */
export async function addExportToReport(htmlFilePath: string): Promise<void> {
  try {
    const html = await fs.readFile(htmlFilePath, 'utf8');
    const modifiedHtml = addExportControls(html);
    await fs.writeFile(htmlFilePath, modifiedHtml, 'utf8');
    console.log('Export functionality added to the report successfully.');
  } catch (error) {
    console.error('Error adding export functionality to the report:', error);
    throw error;
  }
} 