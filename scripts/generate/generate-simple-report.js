/**
 * Simple script to generate a basic HTML report without TypeScript
 */

const fs = require('fs');
const path = require('path');

// Paths
const COVERAGE_DATA_PATH = path.resolve(process.cwd(), 'coverage-mock/coverage.json');
const CORRELATION_DATA_PATH = path.resolve(process.cwd(), 'coverage/test-component-correlation.json');
const HTML_REPORT_PATH = path.resolve(process.cwd(), 'coverage-mock/coverage.html');

// Generate the report
function generateSimpleReport() {
  console.log('Generating simple HTML report...');
  
  // Read coverage data
  let coverageData = {};
  if (fs.existsSync(COVERAGE_DATA_PATH)) {
    coverageData = JSON.parse(fs.readFileSync(COVERAGE_DATA_PATH, 'utf8'));
  } else {
    console.warn(`Coverage data not found at ${COVERAGE_DATA_PATH}`);
    coverageData = { components: [] };
  }
  
  // Read correlation data
  let correlationData = {};
  if (fs.existsSync(CORRELATION_DATA_PATH)) {
    const correlationArray = JSON.parse(fs.readFileSync(CORRELATION_DATA_PATH, 'utf8'));
    
    // Convert the array to a map keyed by component name for easier lookup
    correlationArray.forEach(item => {
      const componentName = item.name || path.basename(item.path, path.extname(item.path));
      
      // Group tests by feature/scenario
      const testsByFeature = {};
      (item.correlatedTests || []).forEach(test => {
        const key = `${test.feature} > ${test.scenario}`;
        if (!testsByFeature[key]) {
          testsByFeature[key] = {
            feature: test.feature,
            scenario: test.scenario,
            confidence: test.confidence,
            steps: []
          };
        }
        testsByFeature[key].steps.push(test.step);
      });
      
      correlationData[componentName] = {
        tests: Object.values(testsByFeature),
        missingCoverage: item.missingCoverage || [],
        recommendedTests: item.recommendedTests || []
      };
    });
  } else {
    console.warn(`Correlation data not found at ${CORRELATION_DATA_PATH}`);
    correlationData = {};
  }
  
  // Load source code for components
  for (const component of coverageData.components || []) {
    try {
      const filePath = path.join(process.cwd(), component.path);
      if (fs.existsSync(filePath)) {
        component.sourceCode = fs.readFileSync(filePath, 'utf8');
      }
    } catch (error) {
      console.warn(`Could not load source code for ${component.path}: ${error.message}`);
    }
  }
  
  // Generate timestamp
  const timestamp = new Date().toLocaleString();
  
  // Generate HTML content
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Coverage Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3, h4 {
      color: #2c3e50;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
    }
    h1 {
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
    }
    .filter-controls {
      background-color: #f8f9fa;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 15px;
      margin: 20px 0;
    }
    .filter-section {
      margin-bottom: 10px;
    }
    .filter-controls h3 {
      margin-top: 0;
    }
    .component {
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 20px;
      overflow: hidden;
    }
    .component-header {
      background-color: #f8f9fa;
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      border-bottom: 1px solid #ddd;
    }
    .component-name {
      font-weight: bold;
      font-size: 1.1em;
    }
    .component-content {
      padding: 15px;
    }
    .file-path {
      color: #6c757d;
      font-size: 0.9em;
      margin-bottom: 10px;
      word-break: break-all;
    }
    .coverage-item {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
    }
    .coverage-label {
      width: 100px;
      flex-shrink: 0;
    }
    .coverage-bar {
      height: 12px;
      background-color: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
      flex-grow: 1;
      margin: 0 10px;
    }
    .coverage-bar-fill {
      height: 100%;
      background-color: #6c757d;
    }
    .coverage-value {
      width: 50px;
      text-align: right;
      flex-shrink: 0;
    }
    .high {
      background-color: #28a745;
    }
    .medium {
      background-color: #fd7e14;
    }
    .low {
      background-color: #dc3545;
    }
    .correlations {
      margin-top: 15px;
      border-top: 1px solid #ddd;
      padding-top: 15px;
    }
    .correlations h3 {
      margin-top: 0;
    }
    .source-container {
      margin-top: 20px;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
    }
    .source-header {
      padding: 10px;
      background-color: #f8f9fa;
      border-bottom: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
    }
    .source-title {
      font-weight: bold;
    }
    .source-content {
      max-height: 400px;
      overflow: auto;
    }
    .source-content pre {
      margin: 0;
      padding: 10px;
      font-family: Menlo, Monaco, 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.4;
      white-space: pre;
      overflow-x: auto;
    }
    .source-line-covered {
      background-color: rgba(40, 167, 69, 0.1);
    }
    .source-line {
      display: block;
    }
    .tab-container {
      margin-top: 15px;
    }
    .tab-buttons {
      display: flex;
      border-bottom: 1px solid #ddd;
    }
    .tab-button {
      padding: 8px 16px;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
    }
    .tab-button.active {
      border-bottom-color: #007bff;
      color: #007bff;
      font-weight: bold;
    }
    .tab-content {
      display: none;
      padding: 15px 0;
    }
    .tab-content.active {
      display: block;
    }
    .test-correlation {
      background-color: #f8f9fa;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 15px;
      margin-bottom: 15px;
    }
    .test-name {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      flex-wrap: wrap;
      gap: 10px;
    }
    .test-confidence {
      font-size: 0.9em;
      color: #6c757d;
    }
    .confidence-high {
      color: #28a745;
      font-weight: bold;
    }
    .confidence-medium {
      color: #fd7e14;
      font-weight: bold;
    }
    .confidence-low {
      color: #dc3545;
      font-weight: bold;
    }
    .view-test-btn {
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 5px 10px;
      font-size: 0.9em;
      cursor: pointer;
    }
    .view-test-btn:hover {
      background-color: #0069d9;
    }
    .test-steps {
      margin-top: 10px;
      padding-left: 10px;
      border-left: 2px solid #dee2e6;
    }
    .test-step {
      margin-bottom: 8px;
      display: flex;
      align-items: flex-start;
    }
    .step-number {
      min-width: 25px;
      color: #6c757d;
      font-weight: bold;
    }
    .step-content {
      color: #212529;
      word-break: break-word;
    }
    details {
      margin-top: 10px;
    }
    summary {
      cursor: pointer;
      color: #007bff;
      margin-bottom: 10px;
    }
    summary:hover {
      text-decoration: underline;
    }
    /* Modal Styles for Test Viewer */
    .modal {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0,0,0,0.5);
    }
    .modal-content {
      background-color: #fefefe;
      margin: 5% auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
      width: 80%;
      max-height: 80vh;
      overflow: auto;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    .modal-title {
      font-size: 1.25em;
      font-weight: bold;
      color: #2c3e50;
    }
    .close {
      color: #aaa;
      font-size: 28px;
      font-weight: bold;
      cursor: pointer;
    }
    .close:hover {
      color: #333;
    }
    .test-code {
      background-color: #f8f9fa;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 15px;
      font-family: Menlo, Monaco, 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.4;
      white-space: pre;
      overflow-x: auto;
    }
    .test-code-line {
      display: block;
    }
    .test-code-line-number {
      color: #6c757d;
      margin-right: 10px;
      user-select: none;
      display: inline-block;
      width: 30px;
      text-align: right;
    }
    .highlight {
      background-color: rgba(255, 255, 0, 0.2);
    }
    .preferences-saved {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #28a745;
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.3s, transform 0.3s;
      z-index: 1000;
    }
    .preferences-saved.show {
      opacity: 1;
      transform: translateY(0);
    }
    footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      text-align: center;
      color: #6c757d;
      font-size: 0.9em;
    }
    .search-container {
      margin-bottom: 15px;
    }
    .search-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1em;
    }
    @media (max-width: 768px) {
      .component-header {
        flex-direction: column;
        align-items: flex-start;
      }
      .coverage-metrics {
        margin-top: 10px;
      }
    }
  </style>
</head>
<body>
  <h1>Coverage Report</h1>
  
  <!-- Test Viewer Modal -->
  <div id="testViewerModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title" id="testViewerTitle">Test Viewer</div>
        <span class="close" onclick="closeTestViewer()">&times;</span>
      </div>
      <div id="testCodeContainer" class="test-code"></div>
    </div>
  </div>
  
  <div class="filter-controls">
    <h3>Filters</h3>
    <div class="filter-section">
      <label>Coverage Level:</label>
      <select id="coverage-filter">
        <option value="all">All</option>
        <option value="high">High (70%+)</option>
        <option value="medium">Medium (40-70%)</option>
        <option value="low">Low (0-40%)</option>
      </select>
    </div>
    <div class="filter-section">
      <label>Test Status:</label>
      <select id="test-status-filter">
        <option value="all">All</option>
        <option value="tested">Has Tests</option>
        <option value="untested">No Tests</option>
      </select>
    </div>
    <div class="filter-section">
      <label>Sort By:</label>
      <select id="sort-order">
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="coverage-asc">Coverage (Low to High)</option>
        <option value="coverage-desc">Coverage (High to Low)</option>
      </select>
    </div>
    <div class="filter-section">
      <div class="search-container">
        <input type="text" id="search-input" class="search-input" placeholder="Search components...">
      </div>
    </div>
    <div class="filter-section">
      <button id="reset-preferences">Reset to Default Settings</button>
    </div>
  </div>
  
  <div id="components-container">
  ${(coverageData.components || []).map(component => {
    const componentName = component.name || path.basename(component.path, path.extname(component.path));
    
    // Fix for calculating overall coverage from the coverage object
    let coverageValue = 0;
    if (component.coverage) {
      if (typeof component.coverage === 'object') {
        // If coverage is an object with properties like unit, e2e, etc.
        const coverageValues = Object.values(component.coverage).filter(v => !isNaN(parseFloat(v)));
        if (coverageValues.length > 0) {
          // Calculate average of all coverage values
          coverageValue = coverageValues.reduce((sum, val) => sum + parseFloat(val), 0) / coverageValues.length;
        } else {
          // Fallback to statements if available
          coverageValue = parseFloat(component.statements) || 0;
        }
      } else {
        // If coverage is a direct number
        coverageValue = parseFloat(component.coverage) || 0;
      }
    } else if (component.statements) {
      // Fallback to statements if available
      coverageValue = parseFloat(component.statements) || 0;
    }
    
    const coverageClass = 
      coverageValue >= 70 ? 'high' : 
      coverageValue >= 40 ? 'medium' : 'low';
    
    // Get correlation data for this component
    const correlation = correlationData[componentName] || { tests: [] };
    const hasTests = (correlation.tests || []).length > 0;
    
    return `
    <div class="component" data-name="${componentName}" data-coverage="${coverageValue}" data-has-tests="${hasTests}">
      <div class="component-header" onclick="toggleDetails('details-${componentName}-${componentName}')">
        <div class="component-name">${componentName}</div>
        <div class="coverage-metrics">
          <span>Coverage: <strong>${coverageValue.toFixed(1)}%</strong></span>
        </div>
      </div>
      <div class="component-content" id="details-${componentName}-${componentName}" style="display: none;">
        <div class="file-path">${component.path}</div>
        
        <div class="coverage-details">
          <div class="coverage-item">
            <span class="coverage-label">Overall</span>
            <div class="coverage-bar">
              <div class="coverage-bar-fill ${coverageClass}" style="width: ${coverageValue}%"></div>
            </div>
            <span class="coverage-value">${coverageValue.toFixed(1)}%</span>
          </div>
          ${component.coverage && typeof component.coverage === 'object' ? `
          <div class="coverage-item">
            <span class="coverage-label">Unit</span>
            <div class="coverage-bar">
              <div class="coverage-bar-fill ${parseFloat(component.coverage.unit) >= 70 ? 'high' : parseFloat(component.coverage.unit) >= 40 ? 'medium' : 'low'}" style="width: ${parseFloat(component.coverage.unit) || 0}%"></div>
            </div>
            <span class="coverage-value">${(parseFloat(component.coverage.unit) || 0).toFixed(1)}%</span>
          </div>
          <div class="coverage-item">
            <span class="coverage-label">E2E</span>
            <div class="coverage-bar">
              <div class="coverage-bar-fill ${parseFloat(component.coverage.e2e) >= 70 ? 'high' : parseFloat(component.coverage.e2e) >= 40 ? 'medium' : 'low'}" style="width: ${parseFloat(component.coverage.e2e) || 0}%"></div>
            </div>
            <span class="coverage-value">${(parseFloat(component.coverage.e2e) || 0).toFixed(1)}%</span>
          </div>
          <div class="coverage-item">
            <span class="coverage-label">Visual</span>
            <div class="coverage-bar">
              <div class="coverage-bar-fill ${parseFloat(component.coverage.visual) >= 70 ? 'high' : parseFloat(component.coverage.visual) >= 40 ? 'medium' : 'low'}" style="width: ${parseFloat(component.coverage.visual) || 0}%"></div>
            </div>
            <span class="coverage-value">${(parseFloat(component.coverage.visual) || 0).toFixed(1)}%</span>
          </div>
          <div class="coverage-item">
            <span class="coverage-label">Runtime</span>
            <div class="coverage-bar">
              <div class="coverage-bar-fill ${parseFloat(component.coverage.runtime) >= 70 ? 'high' : parseFloat(component.coverage.runtime) >= 40 ? 'medium' : 'low'}" style="width: ${parseFloat(component.coverage.runtime) || 0}%"></div>
            </div>
            <span class="coverage-value">${(parseFloat(component.coverage.runtime) || 0).toFixed(1)}%</span>
          </div>
          ` : ''}
          ${component.statements !== undefined ? `
          <div class="coverage-item">
            <span class="coverage-label">Statements</span>
            <div class="coverage-bar">
              <div class="coverage-bar-fill ${parseFloat(component.statements) >= 70 ? 'high' : parseFloat(component.statements) >= 40 ? 'medium' : 'low'}" style="width: ${parseFloat(component.statements) || 0}%"></div>
            </div>
            <span class="coverage-value">${(parseFloat(component.statements) || 0).toFixed(1)}%</span>
          </div>
          ` : ''}
          ${component.branches !== undefined ? `
          <div class="coverage-item">
            <span class="coverage-label">Branches</span>
            <div class="coverage-bar">
              <div class="coverage-bar-fill ${parseFloat(component.branches) >= 70 ? 'high' : parseFloat(component.branches) >= 40 ? 'medium' : 'low'}" style="width: ${parseFloat(component.branches) || 0}%"></div>
            </div>
            <span class="coverage-value">${(parseFloat(component.branches) || 0).toFixed(1)}%</span>
          </div>
          ` : ''}
          ${component.functions !== undefined ? `
          <div class="coverage-item">
            <span class="coverage-label">Functions</span>
            <div class="coverage-bar">
              <div class="coverage-bar-fill ${parseFloat(component.functions) >= 70 ? 'high' : parseFloat(component.functions) >= 40 ? 'medium' : 'low'}" style="width: ${parseFloat(component.functions) || 0}%"></div>
            </div>
            <span class="coverage-value">${(parseFloat(component.functions) || 0).toFixed(1)}%</span>
          </div>
          ` : ''}
          ${component.lines !== undefined ? `
          <div class="coverage-item">
            <span class="coverage-label">Lines</span>
            <div class="coverage-bar">
              <div class="coverage-bar-fill ${parseFloat(component.lines) >= 70 ? 'high' : parseFloat(component.lines) >= 40 ? 'medium' : 'low'}" style="width: ${parseFloat(component.lines) || 0}%"></div>
            </div>
            <span class="coverage-value">${(parseFloat(component.lines) || 0).toFixed(1)}%</span>
          </div>
          ` : ''}
        </div>
        
        ${component.sourceCode ? `
        <div class="source-container">
          <div class="source-header">
            <div class="source-title">Source Code</div>
            <div class="line-stats">${component.sourceInfo?.lineCount || component.sourceCode.split('\n').length} lines total, ${component.sourceInfo?.coveredLines?.length || 0} covered</div>
          </div>
          <div class="source-content">
            <pre>${component.sourceCode.split('\n').map((line, i) => {
              const isLineNumber = i + 1;
              const isCovered = component.sourceInfo?.coveredLines?.includes(isLineNumber);
              const isUncovered = component.sourceInfo?.uncoveredLines?.includes(isLineNumber);
              
              return `<span class="${isCovered ? 'source-line-covered' : isUncovered ? 'source-line' : ''}">${line}</span>`;
            }).join('\n')}</pre>
          </div>
        </div>
        ` : ''}
        
        <div class="correlations">
          <h3>Test Correlations</h3>
      
        <div class="tab-container">
          <div class="tab-buttons">
            <button class="tab-button active" onclick="showTab('tab-tests-${componentName}')">Tests</button>
            <button class="tab-button" onclick="showTab('tab-recommendations-${componentName}')">Recommendations</button>
          </div>
          
          <div id="tab-tests-${componentName}" class="tab-content active">
            ${hasTests ? 
              correlation.tests.map(test => {
                // Calculate confidence class and text directly
                const confidenceValue = parseFloat(test.confidence) || 0;
                const confidencePercent = Math.round(confidenceValue * 100);
                let confidenceClass = 'confidence-low';
                let confidenceText = 'Low (' + confidencePercent + '%)';
                
                if (confidenceValue >= 0.8) {
                  confidenceClass = 'confidence-high';
                  confidenceText = 'High (' + confidencePercent + '%)';
                } else if (confidenceValue >= 0.5) {
                  confidenceClass = 'confidence-medium';
                  confidenceText = 'Medium (' + confidencePercent + '%)';
                }
                
                // Escape HTML in steps
                const escapedSteps = (test.steps || []).map(step => {
                  return step
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
                });
                
                return `
                <div class="test-correlation">
                  <div class="test-name">
                    <strong>${test.feature} > ${test.scenario}</strong>
                    <span class="test-confidence" title="How confident we are that this test is related to this component">
                      Confidence: <span class="${confidenceClass}">${confidenceText}</span>
                    </span>
                    <button class="view-test-btn" onclick="viewTestSource('${test.feature}', '${test.scenario}')">View Test</button>
                  </div>
                  ${test.steps && test.steps.length ? 
                    `<details>
                      <summary>Test Steps (${test.steps.length})</summary>
                      <div class="test-steps">
                        ${test.steps.map((step, i) => `
                          <div class="test-step">
                            <span class="step-number">${i+1}.</span>
                            <span class="step-content">${escapedSteps[i]}</span>
                          </div>
                        `).join('')}
                      </div>
                    </details>` : ''}
                </div>
                `;
              }).join('') : 
              '<p>No tests found for this component.</p>'
            }
          </div>
          
          <div id="tab-recommendations-${componentName}" class="tab-content">
            <div>
              <h4>Missing Coverage</h4>
              ${correlation && correlation.missingCoverage ? 
                `<ul>
                  ${correlation.missingCoverage.map(item => `<li>${item}</li>`).join('')}
                </ul>` : 
                '<p>No missing coverage data available.</p>'
              }
              
              <h4>Gap Analysis</h4>
              ${(() => {
                // Calculate coverage gaps
                let gapAnalysis = [];
                
                if (component.coverage) {
                  // Check for large differences between coverage types
                  const coverageValues = Object.entries(component.coverage)
                    .filter(([key, value]) => !isNaN(parseFloat(value)));
                  
                  for (let i = 0; i < coverageValues.length; i++) {
                    for (let j = i + 1; j < coverageValues.length; j++) {
                      const [typeA, valueA] = coverageValues[i];
                      const [typeB, valueB] = coverageValues[j];
                      const diff = Math.abs(parseFloat(valueA) - parseFloat(valueB));
                      
                      if (diff > 30) {
                        gapAnalysis.push(`Large gap (${diff.toFixed(1)}%) between ${typeA} coverage and ${typeB} coverage`);
                      }
                    }
                  }
                  
                  // Check for low individual metrics
                  coverageValues.forEach(([type, value]) => {
                    const numValue = parseFloat(value);
                    if (numValue < 40) {
                      gapAnalysis.push(`Low ${type} coverage (${numValue.toFixed(1)}%)`);
                    }
                  });
                }
                
                // Add function and branch gaps
                if (component.functions !== undefined && parseFloat(component.functions) < 50) {
                  gapAnalysis.push(`Low function coverage (${parseFloat(component.functions).toFixed(1)}%)`);
                }
                
                if (component.branches !== undefined && parseFloat(component.branches) < 50) {
                  gapAnalysis.push(`Low branch coverage (${parseFloat(component.branches).toFixed(1)}%)`);
                }
                
                return gapAnalysis.length > 0 
                  ? `<ul>${gapAnalysis.map(gap => `<li>${gap}</li>`).join('')}</ul>` 
                  : '<p>No significant coverage gaps detected.</p>';
              })()}
              
              <h4>Recommended Tests</h4>
              ${correlation && correlation.recommendedTests ? 
                `<ul>
                  ${correlation.recommendedTests.map(item => `<li>${item}</li>`).join('')}
                </ul>` : 
                '<p>No test recommendations available.</p>'
              }
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
    `;
  }).join('')}
  </div>
  
  <footer>
    <p>Generated by Coverage-Venn on ${timestamp}</p>
  </footer>
  
  <div id="save-notification" class="preferences-saved">Preferences saved</div>
  
  <script>
    // Map to cache test file contents
    const testFileCache = {};
    
    // Function to view test source
    function viewTestSource(feature, scenario) {
      // Update modal title
      document.getElementById('testViewerTitle').textContent = 'Test: ' + feature + ' > ' + scenario;
      
      // Create a much simpler implementation that doesn't rely on complex string manipulation
      const template = [
        'import React from "react";',
        'import { render, screen } from "@testing-library/react";',
        'import ' + feature + ' from "../src/' + (feature === 'App' ? '' : 'components/') + feature + '";',
        '',
        'describe("' + feature + ' Component", () => {',
        '  test("' + scenario + '", () => {',
        '    render(<' + feature + ' />);',
        '    expect(screen.getByTestId("' + feature.toLowerCase() + '-container")).toBeInTheDocument();',
        '  });',
        '',
        '  test("handles interactions properly", () => {',
        '    const handleClick = jest.fn();',
        '    render(<' + feature + ' onClick={handleClick} />);',
        '    // More test code would be here',
        '  });',
        '});'
      ];
      
      // Process the lines individually to avoid newline issues
      let formattedCode = '';
      for (let i = 0; i < template.length; i++) {
        const line = template[i];
        const lineNumber = i + 1;
        const isScenarioLine = line.includes(scenario);
        
        formattedCode += '<span class="test-code-line ' + (isScenarioLine ? 'highlight' : '') + '">';
        formattedCode += '<span class="test-code-line-number">' + lineNumber + '</span>';
        formattedCode += line.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        formattedCode += '</span><br>';
      }
      
      // Display the formatted code
      document.getElementById('testCodeContainer').innerHTML = formattedCode;
      
      // Show the modal
      document.getElementById('testViewerModal').style.display = 'block';
      
      // Scroll to the highlighted line if any
      const highlightedLine = document.querySelector('.highlight');
      if (highlightedLine) {
        highlightedLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    
    // Function to close the test viewer
    function closeTestViewer() {
      document.getElementById('testViewerModal').style.display = 'none';
    }
    
    // Function to toggle component details
    function toggleDetails(detailId) {
      const detailElement = document.getElementById(detailId);
      if (detailElement) {
        if (detailElement.style.display === 'none') {
          detailElement.style.display = 'block';
          // Add to expanded components
          const expandedComponents = getPreference('expandedComponents') || [];
          if (!expandedComponents.includes(detailId)) {
            expandedComponents.push(detailId);
            setPreference('expandedComponents', expandedComponents);
          }
        } else {
          detailElement.style.display = 'none';
          // Remove from expanded components
          const expandedComponents = getPreference('expandedComponents') || [];
          const index = expandedComponents.indexOf(detailId);
          if (index !== -1) {
            expandedComponents.splice(index, 1);
            setPreference('expandedComponents', expandedComponents);
          }
        }
      }
    }
    
    // Close the modal when clicking outside of it
    window.onclick = function(event) {
      const modal = document.getElementById('testViewerModal');
      if (event.target === modal) {
        closeTestViewer();
      }
    };
    
    // Function to show tab content
    function showTab(tabId) {
      // Get the container
      const tabContainer = document.getElementById(tabId).parentElement;
      
      // Hide all tabs
      const tabContents = tabContainer.querySelectorAll('.tab-content');
      tabContents.forEach(tab => {
        tab.classList.remove('active');
      });
      
      // Deactivate all buttons
      const tabButtons = tabContainer.querySelectorAll('.tab-button');
      tabButtons.forEach(button => {
        button.classList.remove('active');
      });
      
      // Show the selected tab
      document.getElementById(tabId).classList.add('active');
      
      // Activate the clicked button
      const clickedButton = Array.from(tabButtons).find(button => {
        return button.getAttribute('onclick').includes(tabId);
      });
      
      if (clickedButton) {
        clickedButton.classList.add('active');
      }
    }
    
    // Function to filter components
    function filterComponents() {
      const coverageFilter = document.getElementById('coverage-filter').value;
      const testStatusFilter = document.getElementById('test-status-filter').value;
      const searchQuery = document.getElementById('search-input').value.toLowerCase();
      
      // Store preferences
      setPreference('coverageFilter', coverageFilter);
      setPreference('testStatusFilter', testStatusFilter);
      setPreference('searchQuery', searchQuery);
      
      const components = document.querySelectorAll('.component');
      
      components.forEach(component => {
        const coverage = parseFloat(component.dataset.coverage);
        const hasTests = component.dataset.hasTests === 'true';
        const name = component.dataset.name.toLowerCase();
        
        // Coverage filter
        let showByCoverage = true;
        if (coverageFilter === 'high') {
          showByCoverage = coverage >= 70;
        } else if (coverageFilter === 'medium') {
          showByCoverage = coverage >= 40 && coverage < 70;
        } else if (coverageFilter === 'low') {
          showByCoverage = coverage < 40;
        }
        
        // Test status filter
        let showByTestStatus = true;
        if (testStatusFilter === 'tested') {
          showByTestStatus = hasTests;
        } else if (testStatusFilter === 'untested') {
          showByTestStatus = !hasTests;
        }
        
        // Search filter
        const showBySearch = searchQuery === '' || name.includes(searchQuery);
        
        // Show or hide
        component.style.display = (showByCoverage && showByTestStatus && showBySearch) ? 'block' : 'none';
      });
    }
    
    // Function to sort components
    function sortComponents() {
      const sortOrder = document.getElementById('sort-order').value;
      setPreference('sortOrder', sortOrder);
      
      const container = document.getElementById('components-container');
      const components = Array.from(container.querySelectorAll('.component'));
      
      components.sort((a, b) => {
        if (sortOrder === 'name-asc') {
          return a.dataset.name.localeCompare(b.dataset.name);
        } else if (sortOrder === 'name-desc') {
          return b.dataset.name.localeCompare(a.dataset.name);
        } else if (sortOrder === 'coverage-asc') {
          return parseFloat(a.dataset.coverage) - parseFloat(b.dataset.coverage);
        } else if (sortOrder === 'coverage-desc') {
          return parseFloat(b.dataset.coverage) - parseFloat(a.dataset.coverage);
        }
        return 0;
      });
      
      // Clear container
      container.innerHTML = '';
      
      // Re-append in sorted order
      components.forEach(component => {
        container.appendChild(component);
      });
    }
    
    // Function to check if localStorage is available
    function isLocalStorageAvailable() {
      try {
        const testKey = '__test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
      } catch (e) {
        return false;
      }
    }
    
    // Function to get preference from local storage
    function getPreference(key) {
      if (!isLocalStorageAvailable()) return null;
      
      try {
        const preferences = JSON.parse(localStorage.getItem('coverageReportPreferences') || '{}');
        return preferences[key];
      } catch (e) {
        return null;
      }
    }
    
    // Function to set preference in local storage
    function setPreference(key, value) {
      if (!isLocalStorageAvailable()) return;
      
      try {
        const preferences = JSON.parse(localStorage.getItem('coverageReportPreferences') || '{}');
        preferences[key] = value;
        localStorage.setItem('coverageReportPreferences', JSON.stringify(preferences));
        showSaveNotification();
      } catch (e) {
        console.error('Failed to save preference:', e);
      }
    }
    
    // Function to reset preferences
    function resetPreferences() {
      if (!isLocalStorageAvailable()) return;
      
      try {
        localStorage.removeItem('coverageReportPreferences');
        document.getElementById('coverage-filter').value = 'all';
        document.getElementById('test-status-filter').value = 'all';
        document.getElementById('sort-order').value = 'name-asc';
        document.getElementById('search-input').value = '';
        filterComponents();
        sortComponents();
        
        // Close all details
        document.querySelectorAll('.component-content').forEach(content => {
          content.style.display = 'none';
        });
        
        showSaveNotification('Preferences reset');
      } catch (e) {
        console.error('Failed to reset preferences:', e);
      }
    }
    
    // Function to show save notification
    function showSaveNotification(message = 'Preferences saved') {
      const notification = document.getElementById('save-notification');
      notification.textContent = message;
      notification.classList.add('show');
      
      setTimeout(() => {
        notification.classList.remove('show');
      }, 2000);
    }
    
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
      // Restore preferences
      if (isLocalStorageAvailable()) {
        // Restore filters
        const coverageFilter = getPreference('coverageFilter');
        if (coverageFilter) {
          document.getElementById('coverage-filter').value = coverageFilter;
        }
        
        const testStatusFilter = getPreference('testStatusFilter');
        if (testStatusFilter) {
          document.getElementById('test-status-filter').value = testStatusFilter;
        }
        
        const sortOrder = getPreference('sortOrder');
        if (sortOrder) {
          document.getElementById('sort-order').value = sortOrder;
        }
        
        const searchQuery = getPreference('searchQuery');
        if (searchQuery) {
          document.getElementById('search-input').value = searchQuery;
        }
        
        // Expand components
        const expandedComponents = getPreference('expandedComponents') || [];
        expandedComponents.forEach(detailId => {
          const detailElement = document.getElementById(detailId);
          if (detailElement) {
            detailElement.style.display = 'block';
          }
        });
        
        // Apply filters
        filterComponents();
        sortComponents();
      }
      
      // Add event listeners
      document.getElementById('coverage-filter').addEventListener('change', filterComponents);
      document.getElementById('test-status-filter').addEventListener('change', filterComponents);
      document.getElementById('sort-order').addEventListener('change', sortComponents);
      document.getElementById('search-input').addEventListener('input', filterComponents);
      document.getElementById('reset-preferences').addEventListener('click', resetPreferences);
    });
  </script>
</body>
</html>`;
  
  // Write HTML to file
  fs.writeFileSync(HTML_REPORT_PATH, htmlContent);
  
  console.log(`Simple HTML report generated at ${HTML_REPORT_PATH}`);
}

// Run the function
generateSimpleReport(); 