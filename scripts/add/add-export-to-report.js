/**
 * Post-processing script to add export functionality to the coverage report
 */

const fs = require('fs');
const path = require('path');

// Path to the HTML report
const HTML_REPORT_PATH = path.resolve(process.cwd(), 'coverage-mock', 'coverage.html');

// Function to add export functionality to the HTML report
function addExportToReport(htmlFilePath) {
  try {
    console.log(`Adding export functionality to ${htmlFilePath}...`);
    
    // Read the HTML file
    let html = fs.readFileSync(htmlFilePath, 'utf8');
    
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
  
  #notification {
    display: none;
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #4CAF50;
    color: white;
    padding: 15px;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 1000;
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
      `  <div id="notification"></div>
</div> <!-- End of controls -->`
    );

    // Write the modified HTML back to the file
    fs.writeFileSync(htmlFilePath, html, 'utf8');
    
    console.log('Export functionality added to the report successfully.');
  } catch (error) {
    console.error('Error adding export functionality to the report:', error);
    process.exit(1);
  }
}

// Execute the function
addExportToReport(HTML_REPORT_PATH); 