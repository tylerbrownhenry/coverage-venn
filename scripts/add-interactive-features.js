#!/usr/bin/env node

/**
 * Add Interactive Features to Coverage Report
 * 
 * This script enhances the Istanbul HTML coverage report with interactive
 * features like filtering, searching, and visual enhancements.
 */

const fs = require('fs');
const path = require('path');

console.log('Adding interactive features to coverage reports...');

// Paths to HTML files
const coverageDir = path.join(process.cwd(), 'coverage', 'lcov-report');
const indexPath = path.join(coverageDir, 'index.html');
const sorterPath = path.join(coverageDir, 'sorter.js');

// Check if the files exist
if (!fs.existsSync(indexPath)) {
  console.error('Error: Could not find coverage report index.html');
  process.exit(1);
}

// Add interactive features to index.html
try {
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Only add interactive features if they don't already exist
  if (!indexContent.includes('id="filterInput"')) {
    // Add search and filter input HTML
    const headerAddition = `
        <div class="interactive-controls">
            <div class="search-container">
                <input type="text" id="filterInput" placeholder="Filter files..." title="Type to filter files">
                <button id="clearFilter">✕</button>
            </div>
            <div class="threshold-controls">
                <label for="thresholdSlider">Coverage Threshold: <span id="thresholdValue">75</span>%</label>
                <input type="range" min="0" max="100" value="75" class="slider" id="thresholdSlider">
            </div>
            <div class="view-toggle">
                <button id="expandAllBtn">Expand All</button>
                <button id="collapseAllBtn">Collapse All</button>
                <button id="toggleChartView">Toggle Chart View</button>
            </div>
        </div>`;
    
    // Add the header addition after the title
    indexContent = indexContent.replace(
      /<div class='clearfix'>/,
      `${headerAddition}\n<div class='clearfix'>`
    );
    
    // Add CSS for interactive features
    const styleAddition = `
    <style>
      .interactive-controls {
        margin: 15px 0;
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 5px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      
      .search-container {
        position: relative;
        margin-bottom: 10px;
      }
      
      #filterInput {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;
      }
      
      #clearFilter {
        position: absolute;
        right: 8px;
        top: 8px;
        background: none;
        border: none;
        cursor: pointer;
        color: #999;
      }
      
      #clearFilter:hover {
        color: #333;
      }
      
      .threshold-controls {
        margin: 10px 0;
      }
      
      .slider {
        width: 100%;
        height: 5px;
        border-radius: 5px;
        background: #ddd;
        outline: none;
      }
      
      .view-toggle {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
      }
      
      .view-toggle button {
        background-color: #f1f1f1;
        border: 1px solid #ddd;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
      }
      
      .view-toggle button:hover {
        background-color: #e9e9e9;
      }
      
      .low-coverage {
        background-color: #ffdddd !important;
      }
      
      .medium-coverage {
        background-color: #ffffcc !important;
      }
      
      .high-coverage {
        background-color: #ddffdd !important;
      }
      
      .hidden-row {
        display: none;
      }
      
      .chart-container {
        display: none;
        margin: 20px 0;
        height: 300px;
      }
      
      .chart-container.visible {
        display: block;
      }
      
      /* Hover effects */
      tr:hover td {
        background-color: #f5f5f5;
      }
      
      /* Animation for coverage bars */
      .coverage-bar {
        transition: width 0.3s ease-in-out;
      }
    </style>`;
    
    // Add style section to head
    indexContent = indexContent.replace('</head>', `${styleAddition}\n</head>`);
    
    // Add placeholder for chart
    const chartAddition = `<div id="chartContainer" class="chart-container">
      <canvas id="coverageChart"></canvas>
    </div>`;
    
    // Add chart container after the header
    indexContent = indexContent.replace(
      /<\/div>\s*<table class="coverage-summary">/,
      `</div>\n${chartAddition}\n<table class="coverage-summary">`
    );
    
    // Add JavaScript for interactive features
    const scriptAddition = `
    <script>
    // Interactive features
    document.addEventListener('DOMContentLoaded', function() {
      // Filter functionality
      const filterInput = document.getElementById('filterInput');
      const clearFilter = document.getElementById('clearFilter');
      const table = document.querySelector('table.coverage-summary');
      const rows = table ? table.querySelectorAll('tbody tr') : [];
      
      if (filterInput && clearFilter && rows.length > 0) {
        filterInput.addEventListener('keyup', function() {
          const filterValue = this.value.toLowerCase();
          
          rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.indexOf(filterValue) > -1) {
              row.classList.remove('hidden-row');
            } else {
              row.classList.add('hidden-row');
            }
          });
        });
        
        clearFilter.addEventListener('click', function() {
          filterInput.value = '';
          rows.forEach(row => {
            row.classList.remove('hidden-row');
          });
          filterInput.focus();
        });
      }
      
      // Threshold highlighting
      const thresholdSlider = document.getElementById('thresholdSlider');
      const thresholdValue = document.getElementById('thresholdValue');
      
      if (thresholdSlider && thresholdValue && rows.length > 0) {
        const updateThreshold = function() {
          const threshold = parseInt(thresholdSlider.value);
          thresholdValue.textContent = threshold;
          
          rows.forEach(row => {
            const cells = row.querySelectorAll('td.pct');
            cells.forEach(cell => {
              const pct = parseInt(cell.textContent);
              
              // Remove existing classes
              cell.parentNode.classList.remove('low-coverage', 'medium-coverage', 'high-coverage');
              
              // Add appropriate class based on threshold
              if (pct < threshold - 15) {
                cell.parentNode.classList.add('low-coverage');
              } else if (pct < threshold) {
                cell.parentNode.classList.add('medium-coverage');
              } else {
                cell.parentNode.classList.add('high-coverage');
              }
            });
          });
          
          // Update chart if it exists
          if (typeof updateChart === 'function') {
            updateChart();
          }
        };
        
        thresholdSlider.addEventListener('input', updateThreshold);
        
        // Initialize with default value
        updateThreshold();
      }
      
      // Expand/Collapse functionality
      const expandAllBtn = document.getElementById('expandAllBtn');
      const collapseAllBtn = document.getElementById('collapseAllBtn');
      
      if (expandAllBtn && collapseAllBtn) {
        expandAllBtn.addEventListener('click', function() {
          const collapsedRows = document.querySelectorAll('tr.collapsed');
          collapsedRows.forEach(row => {
            // Simulate click on the expander
            const expander = row.querySelector('.sorter');
            if (expander) {
              expander.click();
            }
          });
        });
        
        collapseAllBtn.addEventListener('click', function() {
          const expandedRows = document.querySelectorAll('tr:not(.collapsed)');
          expandedRows.forEach(row => {
            // Simulate click on the expander
            const expander = row.querySelector('.sorter');
            if (expander) {
              expander.click();
            }
          });
        });
      }
      
      // Chart view
      const toggleChartBtn = document.getElementById('toggleChartView');
      const chartContainer = document.getElementById('chartContainer');
      
      if (toggleChartBtn && chartContainer) {
        toggleChartBtn.addEventListener('click', function() {
          chartContainer.classList.toggle('visible');
          
          if (chartContainer.classList.contains('visible')) {
            initializeChart();
          }
        });
        
        // Initialize chart creation
        function initializeChart() {
          if (!window.coverageChartInitialized && rows.length > 0) {
            // This is a placeholder - in a real implementation you would 
            // use a chart library like Chart.js to create a visualization
            const chartCanvas = document.getElementById('coverageChart');
            
            if (chartCanvas) {
              // Create placeholder text for demonstration
              chartContainer.innerHTML = '<div style="text-align: center; padding: 50px; background: #f9f9f9; border: 1px dashed #ccc; border-radius: 5px;"><h3>Coverage Chart Visualization</h3><p>In a real implementation, this would render a chart using a library like Chart.js showing coverage metrics across files.</p></div>';
              
              window.coverageChartInitialized = true;
              window.updateChart = function() {
                // This function would update the chart based on new threshold values
                console.log('Chart would be updated with new threshold: ' + thresholdSlider.value);
              };
            }
          }
        }
      }
      
      // Enhance coverage bars with animation
      const coverageBars = document.querySelectorAll('.coverage-fill');
      coverageBars.forEach(bar => {
        bar.classList.add('coverage-bar');
      });
    });
    </script>`;
    
    // Add script before closing body tag
    indexContent = indexContent.replace('</body>', `${scriptAddition}\n</body>`);
    
    // Write the modified content back to the file
    fs.writeFileSync(indexPath, indexContent);
    
    console.log('✅ Successfully added interactive features to the coverage report');
  } else {
    console.log('Interactive features already exist in the coverage report');
  }
} catch (error) {
  console.error('Error adding interactive features:', error.message);
  process.exit(1);
} 