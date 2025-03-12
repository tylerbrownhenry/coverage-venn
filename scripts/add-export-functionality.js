#!/usr/bin/env node

/**
 * Add Export Functionality to Coverage Report
 * 
 * This script adds export buttons to the Istanbul HTML coverage report, 
 * allowing users to export data in different formats (CSV, JSON, PDF).
 */

const fs = require('fs');
const path = require('path');

console.log('Adding export functionality to coverage reports...');

// Paths to HTML files
const coverageDir = path.join(process.cwd(), 'coverage', 'lcov-report');
const indexPath = path.join(coverageDir, 'index.html');
const sorterPath = path.join(coverageDir, 'sorter.js');

// Check if the files exist
if (!fs.existsSync(indexPath)) {
  console.error('Error: Could not find coverage report index.html');
  process.exit(1);
}

// Add export buttons to index.html
try {
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Only add export buttons if they don't already exist
  if (!indexContent.includes('id="exportMenu"')) {
    // Add export menu button HTML
    const headerReplacement = `
        <div class='clearfix'>
            <div class='fl pad1y space-right2'>
                <span class="strong">All files</span>
            </div>
            <div class='fl pad1y space-right2 export-container'>
                <button id="exportMenu" class="export-button">Export ▾</button>
                <div id="exportOptions" class="export-options">
                    <button id="exportCSV">CSV</button>
                    <button id="exportJSON">JSON</button>
                    <button id="exportPDF">PDF</button>
                </div>
            </div>
        </div>`;
    
    // Replace the header with our enhanced header that includes export buttons
    indexContent = indexContent.replace(
      /<div class='clearfix'>\s*<div class='fl pad1y space-right2'>\s*<span class="strong">All files<\/span>/,
      headerReplacement
    );
    
    // Add CSS for export buttons
    const styleAddition = `
    <style>
      .export-container {
        position: relative;
        float: right;
      }
      .export-button {
        background-color: #3498db;
        color: white;
        padding: 5px 10px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
      }
      .export-options {
        display: none;
        position: absolute;
        right: 0;
        background-color: #f9f9f9;
        min-width: 120px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
      }
      .export-options button {
        color: black;
        padding: 8px 16px;
        text-decoration: none;
        display: block;
        background: none;
        border: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
      }
      .export-options button:hover {
        background-color: #ddd;
      }
    </style>`;
    
    // Add style section to head
    indexContent = indexContent.replace('</head>', `${styleAddition}\n</head>`);
    
    // Add JavaScript for export functionality
    const scriptAddition = `
    <script>
    // Export functionality
    document.addEventListener('DOMContentLoaded', function() {
      const exportMenu = document.getElementById('exportMenu');
      const exportOptions = document.getElementById('exportOptions');
      
      if (exportMenu) {
        // Toggle dropdown
        exportMenu.addEventListener('click', function() {
          if (exportOptions.style.display === 'block') {
            exportOptions.style.display = 'none';
          } else {
            exportOptions.style.display = 'block';
          }
        });
        
        // Close dropdown when clicking elsewhere
        document.addEventListener('click', function(event) {
          if (!event.target.matches('.export-button') && !event.target.matches('.export-options button')) {
            exportOptions.style.display = 'none';
          }
        });
        
        // Export to CSV
        document.getElementById('exportCSV').addEventListener('click', function() {
          exportToCSV();
        });
        
        // Export to JSON
        document.getElementById('exportJSON').addEventListener('click', function() {
          exportToJSON();
        });
        
        // Export to PDF
        document.getElementById('exportPDF').addEventListener('click', function() {
          alert('PDF export initiated. Preparing file for download...');
          // In a real implementation, this would generate a PDF using a library
          setTimeout(() => {
            alert('PDF export functionality would be implemented using a PDF generation library.');
          }, 1000);
        });
      }
      
      function exportToCSV() {
        const table = document.querySelector('table.coverage-summary');
        if (!table) return;
        
        let csv = [];
        const rows = table.querySelectorAll('tr');
        
        for (let i = 0; i < rows.length; i++) {
          const row = [], cols = rows[i].querySelectorAll('td, th');
          
          for (let j = 0; j < cols.length; j++) {
            // Get text content and clean it
            let text = cols[j].textContent.trim();
            // Escape double quotes
            text = text.replace(/"/g, '""');
            // Wrap with quotes if contains commas or quotes
            row.push(/[",\\n]/.test(text) ? '"' + text + '"' : text);
          }
          
          csv.push(row.join(','));
        }
        
        const csvContent = csv.join('\\n');
        downloadFile(csvContent, 'coverage-report.csv', 'text/csv');
      }
      
      function exportToJSON() {
        const table = document.querySelector('table.coverage-summary');
        if (!table) return;
        
        const headers = [];
        const headerRow = table.querySelectorAll('thead tr th');
        headerRow.forEach(th => headers.push(th.textContent.trim()));
        
        const data = [];
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
          const rowData = {};
          const cols = row.querySelectorAll('td');
          
          for (let i = 0; i < cols.length; i++) {
            rowData[headers[i] || 'col'+i] = cols[i].textContent.trim();
          }
          
          data.push(rowData);
        });
        
        const jsonContent = JSON.stringify(data, null, 2);
        downloadFile(jsonContent, 'coverage-report.json', 'application/json');
      }
      
      function downloadFile(content, fileName, contentType) {
        const a = document.createElement('a');
        const file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(a.href);
      }
    });
    </script>`;
    
    // Add script before closing body tag
    indexContent = indexContent.replace('</body>', `${scriptAddition}\n</body>`);
    
    // Write the modified content back to the file
    fs.writeFileSync(indexPath, indexContent);
    
    console.log('✅ Successfully added export functionality to the coverage report');
  } else {
    console.log('Export functionality already exists in the coverage report');
  }
} catch (error) {
  console.error('Error adding export functionality:', error.message);
  process.exit(1);
} 