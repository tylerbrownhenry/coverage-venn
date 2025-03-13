"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHtmlReport = generateHtmlReport;
function generateHtmlReport(report) {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Initial Coverage Report</title>
  <style>
    :root {
      --primary-color: #4CAF50;
      --warning-color: #FFA500;
      --danger-color: #FF4444;
    }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      margin: 0;
      padding: 20px;
    }
    .summary { 
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .coverage-table { 
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .coverage-table td, .coverage-table th { 
      padding: 12px;
      border: 1px solid #ddd;
    }
    .coverage-bar { 
      height: 20px;
      background: #eee;
      position: relative;
      border-radius: 10px;
      overflow: hidden;
    }
    .coverage-value { 
      height: 100%;
      transition: width 0.3s ease;
    }
    .coverage-high { background: var(--primary-color); }
    .coverage-medium { background: var(--warning-color); }
    .coverage-low { background: var(--danger-color); }
    .meta-info {
      color: #666;
      font-size: 0.9em;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  ${generateSummarySection(report)}
  ${generateCoverageTable(report)}
  ${generateMetadataSection(report)}
  
  <script>
    // Add interactive features
    document.querySelectorAll('.coverage-row').forEach(row => {
      row.addEventListener('click', () => {
        row.querySelector('.details').classList.toggle('expanded');
      });
    });
  </script>
</body>
</html>
  `;
}
function generateSummarySection(report) {
    return `
    <div class="summary">
      <h1>Coverage Summary</h1>
      <p>Total Components: ${report.summary.total}</p>
      <p>Covered Components: ${report.summary.covered}</p>
      <p>Coverage: ${report.summary.percentage.toFixed(2)}%</p>
    </div>
  `;
}
function generateCoverageTable(report) {
    return `
    <table class="coverage-table">
      <thead>
        <tr>
          <th>Component</th>
          <th>Unit</th>
          <th>E2E</th>
          <th>Visual</th>
          <th>Runtime</th>
        </tr>
      </thead>
      <tbody>
        ${report.components.map(comp => `
          <tr class="coverage-row">
            <td>${comp.path}</td>
            <td>${renderCoverageBar(comp.coverage.unit)}</td>
            <td>${renderCoverageBar(comp.coverage.e2e)}</td>
            <td>${renderCoverageBar(comp.coverage.visual)}</td>
            <td>${renderCoverageBar(comp.coverage.runtime)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}
function generateMetadataSection(report) {
    return `
    <div class="meta-info">
      <p>Report generated on: ${new Date().toLocaleString()}</p>
    </div>
  `;
}
function renderCoverageBar(value) {
    return `
    <div class="coverage-bar">
      <div class="coverage-value ${getCoverageClass(value)}" style="width: ${value}%"></div>
    </div>
    ${value.toFixed(1)}%
  `;
}
function getCoverageClass(value) {
    if (value >= 80)
        return 'coverage-high';
    if (value >= 50)
        return 'coverage-medium';
    return 'coverage-low';
}
