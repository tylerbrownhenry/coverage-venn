"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const export_coverage_1 = require("../export/export-coverage");
// Determine coverage source from environment variable
const COVERAGE_SOURCE = process.env.COVERAGE_SOURCE || 'standard';
// Path constants
const COVERAGE_DIR = path.resolve(process.cwd(), 'coverage');
const BABEL_COVERAGE_DIR = path.resolve(process.cwd(), 'coverage-babel');
const MOCK_COVERAGE_DIR = path.resolve(process.cwd(), 'coverage-analysis');
// Define paths based on coverage source
const COMPONENT_COVERAGE_PATH = COVERAGE_SOURCE === 'babel'
    ? path.resolve(BABEL_COVERAGE_DIR, 'component-coverage.json')
    : path.resolve(MOCK_COVERAGE_DIR, 'mock-component-coverage.json');
const CORRELATION_PATH = COVERAGE_SOURCE === 'babel'
    ? path.resolve(BABEL_COVERAGE_DIR, 'test-component-correlation.json')
    : path.resolve(COVERAGE_DIR, 'test-component-correlation.json');
const OUTPUT_DIR = COVERAGE_SOURCE === 'babel'
    ? path.resolve(BABEL_COVERAGE_DIR, 'html')
    : path.resolve(process.cwd(), 'coverage-mock');
const HTML_OUTPUT_PATH = path.resolve(OUTPUT_DIR, 'coverage.html');
// Add source code root path - adjust this based on your project structure
const SOURCE_CODE_ROOT = process.env.SOURCE_CODE_ROOT || process.cwd();
// Function to extract source code from a file
async function extractSourceCode(filePath) {
    try {
        // Resolve the file path against the source code root
        const resolvedPath = path.isAbsolute(filePath)
            ? filePath
            : path.resolve(SOURCE_CODE_ROOT, filePath);
        // For mock paths, create mock source code
        if (filePath.startsWith('__mocks__')) {
            return generateMockSourceCode(filePath);
        }
        // Check if file exists
        try {
            await fs.access(resolvedPath);
        }
        catch (error) {
            console.warn(`Source file not found: ${resolvedPath}. Generating mock content.`);
            return generateMockSourceCode(filePath);
        }
        // Read file content
        const content = await fs.readFile(resolvedPath, 'utf8');
        return content;
    }
    catch (error) {
        console.warn(`Error reading source code for ${filePath}:`, error);
        return generateMockSourceCode(filePath);
    }
}
// Function to generate mock source code for demo purposes
function generateMockSourceCode(filePath) {
    const fileName = path.basename(filePath);
    const isComponent = fileName.endsWith('.tsx') || filePath.includes('/components/');
    const isUtil = filePath.includes('/utils/') || fileName.includes('util');
    const isTest = filePath.includes('/__tests__/') || fileName.includes('.test.');
    let mockContent = '';
    if (isTest) {
        mockContent = `import { render, screen, fireEvent } from '@testing-library/react';
import { ${fileName.replace(/\.(tsx|ts|test)$/g, '')} } from '../components';

describe('${fileName.replace(/\.(tsx|ts|test)$/g, '')} Tests', () => {
  test('renders correctly', () => {
    render(<${fileName.replace(/\.(tsx|ts|test)$/g, '')} />);
    expect(screen.getByText('${fileName.replace(/\.(tsx|ts|test)$/g, '')}')).toBeInTheDocument();
  });
  
  test('handles click events', () => {
    const mockFn = jest.fn();
    render(<${fileName.replace(/\.(tsx|ts|test)$/g, '')} onClick={mockFn} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockFn).toHaveBeenCalled();
  });
});`;
    }
    else if (isComponent) {
        mockContent = `import React, { useState, useEffect } from 'react';
import { utils } from '../utils/utils';

export interface ${fileName.replace(/\.(tsx|ts)$/g, '')}Props {
  title?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const ${fileName.replace(/\.(tsx|ts)$/g, '')} = ({ 
  title = '${fileName.replace(/\.(tsx|ts)$/g, '')}',
  onClick,
  disabled = false,
  children
}: ${fileName.replace(/\.(tsx|ts)$/g, '')}Props) => {
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleClick = () => {
    if (disabled) return;
    setIsActive(!isActive);
    onClick && onClick();
  };
  
  return (
    <div className={\`component \${isActive ? 'active' : ''} \${disabled ? 'disabled' : ''}\`}>
      <h2>{title}</h2>
      <button onClick={handleClick} disabled={disabled}>
        {children || 'Click me'}
      </button>
      {isActive && <span>Active!</span>}
    </div>
  );
};`;
    }
    else if (isUtil) {
        mockContent = `/**
 * Utility functions for the application
 */

export const utils = {
  /**
   * Format a number as currency
   */
  formatCurrency: (value: number, currency = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(value);
  },
  
  /**
   * Truncate a string to a specific length
   */
  truncate: (str: string, length = 50): string => {
    if (str.length <= length) return str;
    return \`\${str.substring(0, length)}...\`;
  },
  
  /**
   * Validate an email address
   */
  isValidEmail: (email: string): boolean => {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
  },
  
  /**
   * Generate a random ID
   */
  generateId: (): string => {
    return Math.random().toString(36).substring(2, 15);
  },
  
  /**
   * Deep clone an object
   */
  deepClone: <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
  }
};`;
    }
    else {
        mockContent = `/**
 * ${fileName.replace(/\.(tsx|ts)$/g, '')}
 */

export const ${fileName.replace(/\.(tsx|ts)$/g, '')} = {
  version: '1.0.0',
  name: '${fileName.replace(/\.(tsx|ts)$/g, '')}',
  init: () => {
    console.log('${fileName.replace(/\.(tsx|ts)$/g, '')} initialized');
  }
};`;
    }
    return mockContent;
}
// Helper function to get relative path
function getRelativePath(filePath) {
    if (filePath.startsWith('__mocks__')) {
        return filePath;
    }
    // If already relative, just return it
    if (!path.isAbsolute(filePath)) {
        return filePath;
    }
    try {
        // Get relative path from source root
        return path.relative(SOURCE_CODE_ROOT, filePath);
    }
    catch (error) {
        return filePath;
    }
}
// Function to generate HTML content
function generateHTML(components) {
    const timestamp = new Date().toLocaleString();
    // Prepare data for summary metrics
    const totalComponents = components.length;
    const avgCoverage = calculateAverageCoverage(components);
    const coveredComponents = components.filter(c => c.coverage > 0).length;
    const directlyTestedComponents = components.filter(c => c.correlatedTests.length > 0).length;
    // Category breakdown for summary
    const categoryCounts = {
        highCoverage: components.filter(c => c.coverage >= 80).length,
        mediumCoverage: components.filter(c => c.coverage >= 50 && c.coverage < 80).length,
        lowCoverage: components.filter(c => c.coverage < 50).length,
        directlyTested: directlyTestedComponents,
        indirectlyTested: coveredComponents - directlyTestedComponents,
        untested: totalComponents - coveredComponents
    };
    // Start building HTML content
    let html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Component Coverage and Test Correlation Report</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      h1 {
        color: #2c3e50;
        border-bottom: 2px solid #eee;
        padding-bottom: 10px;
      }
      h2 {
        color: #3498db;
        margin-top: 30px;
      }
      .summary {
        background-color: #f8f9fa;
        border-radius: 5px;
        padding: 15px;
        margin-bottom: 20px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .summary-section {
        flex: 1;
        min-width: 250px;
        margin-bottom: 15px;
      }
      .summary-title {
        font-weight: bold;
        margin-bottom: 10px;
        font-size: 1.1em;
      }
      .summary-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .summary-stat {
        background-color: white;
        border-radius: 4px;
        padding: 10px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        flex: 1;
        min-width: 100px;
        text-align: center;
      }
      .summary-stat-value {
        font-size: 1.8em;
        font-weight: bold;
        margin: 5px 0;
      }
      .summary-stat-label {
        font-size: 0.9em;
        color: #666;
      }
      .controls {
        margin: 15px 0 25px;
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 5px;
      }
      .filter-group {
        margin-bottom: 15px;
      }
      .filter-title {
        font-weight: bold;
        margin-bottom: 5px;
      }
      .filter-options {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .filter-checkbox {
        display: flex;
        align-items: center;
        margin-right: 15px;
      }
      .filter-checkbox input {
        margin-right: 5px;
      }
      .search-box {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-bottom: 10px;
      }
      .sort-dropdown {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background-color: white;
      }
      .component {
        border: 1px solid #ddd;
        border-radius: 5px;
        margin-bottom: 20px;
        overflow: hidden;
      }
      .component-header {
        background-color: #f5f5f5;
        padding: 10px 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ddd;
        cursor: pointer;
      }
      .component-header:hover {
        background-color: #e9ecef;
      }
      .component-name {
        font-weight: bold;
        font-size: 1.2em;
      }
      .component-path {
        font-size: 0.8em;
        color: #777;
        margin-left: 10px;
      }
      .component-coverage-badge {
        padding: 3px 8px;
        border-radius: 12px;
        color: white;
        font-weight: bold;
        font-size: 0.8em;
      }
      .component-content {
        padding: 15px;
        display: none;
      }
      .coverage-metrics {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-bottom: 15px;
      }
      .metric {
        background-color: #f8f9fa;
        border-radius: 5px;
        padding: 10px;
        flex: 1;
        min-width: 120px;
        text-align: center;
      }
      .metric-value {
        font-size: 1.5em;
        font-weight: bold;
        margin-top: 5px;
      }
      .metric-high {
        color: #27ae60;
      }
      .metric-medium {
        color: #f39c12;
      }
      .metric-low {
        color: #e74c3c;
      }
      /* New Styles for Enhanced Report */
      .coverage-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      .coverage-table th, .coverage-table td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
      .coverage-table th {
        background-color: #f5f5f5;
        font-weight: bold;
      }
      .coverage-table tr:hover {
        background-color: #f9f9f9;
      }
      .file-link {
        color: #3498db;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
      }
      .file-link:hover {
        text-decoration: underline;
      }
      .file-link svg {
        margin-right: 5px;
        width: 16px;
        height: 16px;
      }
      .coverage-details {
        background-color: #f8f9fa;
        border-radius: 5px;
        padding: 15px;
        margin-top: 15px;
        display: none;
      }
      .details-toggle {
        background-color: #3498db;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 0.9em;
      }
      .details-toggle:hover {
        background-color: #2980b9;
      }
      .source-view {
        background-color: #f8f9fa;
        border-radius: 5px;
        padding: 15px;
        margin-top: 15px;
        overflow-x: auto;
      }
      .source-view pre {
        margin: 0;
        font-family: monospace;
        font-size: 0.9em;
        line-height: 1.5;
      }
      .covered {
        background-color: rgba(46, 204, 113, 0.2);
      }
      .partially-covered {
        background-color: rgba(241, 196, 15, 0.2);
      }
      .not-covered {
        background-color: rgba(231, 76, 60, 0.2);
      }
      .highlight-line {
        background-color: rgba(52, 152, 219, 0.2);
        font-weight: bold;
      }
      .high-confidence {
        color: #27ae60;
        font-weight: bold;
      }
      .medium-confidence {
        color: #f39c12;
        font-weight: bold;
      }
      .low-confidence {
        color: #e74c3c;
        font-weight: bold;
      }
      .branch-coverage-item {
        margin-bottom: 10px;
        padding: 8px;
        border-radius: 4px;
        background-color: #fff;
      }
      .branch-coverage-code {
        font-family: monospace;
        background-color: #f1f1f1;
        padding: 5px;
        border-radius: 3px;
        margin: 5px 0;
        display: inline-block;
      }
      .function-coverage-item {
        padding: 5px;
        border-bottom: 1px solid #eee;
      }
      .tab-container {
        margin-top: 15px;
      }
      .tab-buttons {
        display: flex;
        border-bottom: 1px solid #ddd;
      }
      .tab-button {
        padding: 10px 15px;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 1em;
        border-bottom: 2px solid transparent;
      }
      .tab-button.active {
        border-bottom: 2px solid #3498db;
        font-weight: bold;
      }
      .tab-content {
        padding: 15px 0;
        display: none;
      }
      .tab-content.active {
        display: block;
      }
      /* Source code viewer styles */
      .source-container {
        margin-top: 20px;
        border: 1px solid #ddd;
        border-radius: 4px;
        overflow: hidden;
      }
      
      .source-header {
        background-color: #f5f5f5;
        padding: 10px;
        border-bottom: 1px solid #ddd;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .source-title {
        font-weight: bold;
        font-size: 1.1em;
      }
      
      .source-content {
        max-height: 400px;
        overflow-y: auto;
        padding: 0;
        margin: 0;
        background-color: #f8f9fa;
      }
      
      .source-content pre {
        margin: 0;
        padding: 10px;
        font-family: monospace;
        font-size: 14px;
        line-height: 1.4;
        counter-reset: line;
      }
      
      .source-line {
        white-space: pre;
        display: block;
        position: relative;
        padding-left: 60px;
      }
      
      .source-line:before {
        counter-increment: line;
        content: counter(line);
        position: absolute;
        left: 0;
        top: 0;
        width: 40px;
        padding-right: 10px;
        text-align: right;
        color: #999;
        background-color: #f0f0f0;
        border-right: 1px solid #ddd;
      }
      
      .source-line-covered {
        background-color: rgba(46, 204, 113, 0.2);
      }
      
      .source-line-partially {
        background-color: rgba(241, 196, 15, 0.2);
      }
      
      .source-line-uncovered {
        background-color: rgba(231, 76, 60, 0.2);
      }
      
      .file-path {
        font-family: monospace;
        font-size: 0.9em;
        color: #555;
        margin-left: 10px;
      }
      
      .line-stats {
        margin-top: 5px;
        font-size: 0.9em;
        color: #666;
      }
      
      .copy-path-btn {
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 3px;
        padding: 3px 8px;
        font-size: 0.8em;
        cursor: pointer;
      }
      
      .copy-path-btn:hover {
        background-color: #e9ecef;
      }
      
      .preferences-status {
        font-size: 0.9em;
        color: #666;
        display: flex;
        align-items: center;
      }
      
      .preferences-indicator {
        color: #27ae60;
        font-weight: bold;
        margin-right: 5px;
      }
      
      .reset-button {
        background-color: #f8f9fa;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 0.9em;
        transition: all 0.2s ease;
      }
      
      .reset-button:hover {
        background-color: #e9ecef;
        border-color: #ced4da;
      }
      
      .preferences-saved {
        background-color: rgba(46, 204, 113, 0.1);
        border: 1px solid rgba(46, 204, 113, 0.3);
        color: #27ae60;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 0.8em;
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .preferences-saved.show {
        opacity: 1;
      }
      
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
    </style>
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/benfred/venn.js@master/venn.js"></script>
  </head>
  <body>
    <h1>Component Coverage and Test Correlation Report</h1>
    <p>Generated on ${timestamp}</p>
    
    <div class="summary">
      <div class="summary-section">
        <div class="summary-title">Overview</div>
        <div class="summary-grid">
          <div class="summary-stat">
            <div class="summary-stat-value">${totalComponents}</div>
            <div class="summary-stat-label">Total Components</div>
          </div>
          <div class="summary-stat">
            <div class="summary-stat-value">${avgCoverage.toFixed(1)}%</div>
            <div class="summary-stat-label">Average Coverage</div>
          </div>
          <div class="summary-stat">
            <div class="summary-stat-value">${coveredComponents}</div>
            <div class="summary-stat-label">Covered Components</div>
          </div>
        </div>
      </div>
      
      <div class="summary-section">
        <div class="summary-title">Coverage Breakdown</div>
        <div class="summary-grid">
          <div class="summary-stat">
            <div class="summary-stat-value ${getCoverageClass(80)}">${categoryCounts.highCoverage}</div>
            <div class="summary-stat-label">High Coverage</div>
          </div>
          <div class="summary-stat">
            <div class="summary-stat-value ${getCoverageClass(60)}">${categoryCounts.mediumCoverage}</div>
            <div class="summary-stat-label">Medium Coverage</div>
          </div>
          <div class="summary-stat">
            <div class="summary-stat-value ${getCoverageClass(20)}">${categoryCounts.lowCoverage}</div>
            <div class="summary-stat-label">Low Coverage</div>
          </div>
        </div>
      </div>
      
      <div class="summary-section">
        <div class="summary-title">Test Correlation</div>
        <div class="summary-grid">
          <div class="summary-stat">
            <div class="summary-stat-value">${categoryCounts.directlyTested}</div>
            <div class="summary-stat-label">Directly Tested</div>
          </div>
          <div class="summary-stat">
            <div class="summary-stat-value">${categoryCounts.indirectlyTested}</div>
            <div class="summary-stat-label">Indirectly Tested</div>
          </div>
          <div class="summary-stat">
            <div class="summary-stat-value">${categoryCounts.untested}</div>
            <div class="summary-stat-label">Untested</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="controls">
      <div class="filter-group">
        <div class="filter-title">Search & Filter Components</div>
        <input type="text" id="search-input" class="search-box" placeholder="Search by component name, file path, or test description...">
        
        <div class="filter-options">
          <div>
            <label for="coverage-filter">Coverage:</label>
            <select id="coverage-filter" class="sort-dropdown">
              <option value="all">All Coverage Levels</option>
              <option value="high">High Coverage (>80%)</option>
              <option value="medium">Medium Coverage (50-80%)</option>
              <option value="low">Low Coverage (<50%)</option>
              <option value="none">No Coverage (0%)</option>
            </select>
          </div>
          
          <div style="margin-left: 15px;">
            <label for="test-status-filter">Test Status:</label>
            <select id="test-status-filter" class="sort-dropdown">
              <option value="all">All Components</option>
              <option value="with-tests">With Direct Tests</option>
              <option value="without-tests">Without Direct Tests</option>
            </select>
          </div>
          
          <div style="margin-left: 15px;">
            <label for="component-sort">Sort By:</label>
            <select id="component-sort" class="sort-dropdown">
              <option value="name">Component Name</option>
              <option value="coverage-asc">Coverage (Low to High)</option>
              <option value="coverage-desc" selected>Coverage (High to Low)</option>
              <option value="tests-desc">Most Tested First</option>
              <option value="tests-asc">Least Tested First</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="filter-group" style="margin-top: 15px;">
        <div class="filter-title">View Options</div>
        <div class="filter-options">
          <div class="filter-checkbox">
            <input type="checkbox" id="show-details" checked>
            <label for="show-details">Auto-expand Components</label>
          </div>
          
          <div class="filter-checkbox">
            <input type="checkbox" id="show-source">
            <label for="show-source">Show Source Code</label>
          </div>
          
          <div class="filter-checkbox">
            <input type="checkbox" id="show-test-details">
            <label for="show-test-details">Show Test Details</label>
          </div>
        </div>
      </div>
      
      <div class="filter-group" style="margin-top: 15px; display: flex; justify-content: space-between; align-items: center;">
        <div class="preferences-status" id="preferences-status">
          <span class="preferences-indicator">✓</span> User preferences are saved automatically
        </div>
        <button id="reset-preferences" class="reset-button">Reset to Default Settings</button>
      </div>
      
      <div class="filter-group" style="margin-top: 15px;">
        <div class="filter-title">Export Options</div>
        <div class="export-controls">
          <h3>Export Options</h3>
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
      </div>
    </div>
    
    <h2>Coverage Overview</h2>
    <div class="venn-container" id="venn-diagram"></div>
    <div class="chart-legend">
      <div class="legend-item"><div class="legend-color" style="background-color: #1f77b4;"></div>UI Components</div>
      <div class="legend-item"><div class="legend-color" style="background-color: #2ca02c;"></div>Integration</div>
      <div class="legend-item"><div class="legend-color" style="background-color: #d62728;"></div>Utilities</div>
    </div>
    
    <h2>Component Details</h2>
    <div id="components-container">
  `;
    // Add component sections
    for (const component of components) {
        const coverageClass = getCoverageClass(component.coverage);
        const badgeClass = component.coverage >= 80 ? 'badge-high' :
            component.coverage >= 50 ? 'badge-medium' : 'badge-low';
        // Get relative path for display
        const relativePath = getRelativePath(component.path);
        const hasTests = component.correlatedTests && component.correlatedTests.length > 0;
        html += `
    <div id="component-${component.name.replace(/[^a-zA-Z0-9]/g, "")}" class="component" 
         data-coverage="${component.coverage}" 
         data-tests="${component.correlatedTests?.length || 0}" 
         data-name="${component.name}"
         data-path="${relativePath}">
      <div class="component-header">
        <div>
          <span class="component-name">${component.name}</span>
          <span class="component-path" title="${relativePath}">
            ${relativePath}
            <button class="copy-path-btn" data-path="${relativePath}" title="Copy path to clipboard">
              Copy
            </button>
          </span>
        </div>
        <span class="component-coverage-badge ${badgeClass}">${component.coverage.toFixed(1)}%</span>
      </div>
      
      <div class="component-content">
        <div class="coverage-metrics">
          <div class="metric">
            <div>Statements</div>
            <div class="metric-value ${getCoverageClass(component.statements || 0)}">${component.statements?.toFixed(1) || '0.0'}%</div>
          </div>
          
          <div class="metric">
            <div>Branches</div>
            <div class="metric-value ${getCoverageClass(component.branches || 0)}">${component.branches?.toFixed(1) || '0.0'}%</div>
          </div>
          
          <div class="metric">
            <div>Functions</div>
            <div class="metric-value ${getCoverageClass(component.functions || 0)}">${component.functions?.toFixed(1) || '0.0'}%</div>
          </div>
          
          <div class="metric">
            <div>Lines</div>
            <div class="metric-value ${getCoverageClass(component.lines || 0)}">${component.lines?.toFixed(1) || '0.0'}%</div>
          </div>
        </div>
    `;
        // Source code viewer (hidden by default)
        html += `
        <div class="source-container" style="display: none;">
          <div class="source-header">
            <div class="source-title">Source Code</div>
            <div class="line-stats">${component.lineCount || 'N/A'} lines total, ${component.coveredLines?.length || 0} covered</div>
          </div>
          <div class="source-content">
            <pre>`;
        // Add source code if available
        if (component.sourceCode) {
            const lines = component.sourceCode.split('\n');
            lines.forEach((line, index) => {
                const lineNumber = index + 1;
                const isCovered = component.coveredLines?.includes(lineNumber);
                const lineClass = isCovered ? 'source-line-covered' : 'source-line';
                // Escape HTML to prevent injection
                const escapedLine = line
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                html += `<span class="${lineClass}">${escapedLine}</span>`;
            });
        }
        else {
            html += `<span class="source-line">Source code not available</span>`;
        }
        html += `
            </pre>
          </div>
        </div>
    `;
        html += `
        <div class="correlations">
          <h3>Test Correlations</h3>
    `;
        if (component.correlatedTests && component.correlatedTests.length > 0) {
            html += `
        <div class="tab-container">
          <div class="tab-buttons">
            <button class="tab-button active" onclick="showTab(this, 'table-view-${component.name.replace(/[^a-zA-Z0-9]/g, "")}')">Table View</button>
            <button class="tab-button" onclick="showTab(this, 'detailed-view-${component.name.replace(/[^a-zA-Z0-9]/g, "")}')">Detailed View</button>
          </div>
          
          <div id="table-view-${component.name.replace(/[^a-zA-Z0-9]/g, "")}" class="tab-content active">
            <table class="coverage-table">
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Confidence</th>
                  <th>Component Location</th>
                  <th>Test Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
    `;
            for (const test of component.correlatedTests) {
                const confidenceClass = getConfidenceClass(test.confidence);
                const confidenceLabel = test.confidence >= 0.7 ? 'High' : test.confidence >= 0.4 ? 'Medium' : 'Low';
                // Use placeholders for actual file paths and line numbers, since we may not have this data
                // In a real implementation, we would extract these from the actual files
                const componentFilePath = component.path || 'unknown';
                const componentLineNumber = '10'; // Placeholder, would come from actual data
                const testFilePath = `tests/${test.feature.toLowerCase().replace(/\s/g, '-')}.test.js`; // Placeholder
                const testLineNumber = '25'; // Placeholder, would come from actual data
                html += `
        <tr>
          <td>
            <div>${test.feature}</div>
            <div style="font-size: 0.9em; color: #666;">${test.scenario} - ${test.step}</div>
          </td>
          <td><span class="${confidenceClass}">${confidenceLabel} (${test.confidence.toFixed(2)})</span></td>
          <td>
            <a href="#" class="file-link" onclick="highlightCode('${componentFilePath}', ${componentLineNumber})">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                <path d="M8.646 6.646a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 9 8.646 7.354a.5.5 0 0 1 0-.708zm-1.292 0a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0 0 .708l2 2a.5.5 0 0 0 .708-.708L5.707 9l1.647-1.646a.5.5 0 0 0 0-.708z"/>
              </svg>
              ${componentFilePath.split('/').pop()}:${componentLineNumber}
            </a>
          </td>
          <td>
            <a href="#" class="file-link" onclick="highlightCode('${testFilePath}', ${testLineNumber})">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                <path d="M8.646 6.646a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 9 8.646 7.354a.5.5 0 0 1 0-.708zm-1.292 0a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0 0 .708l2 2a.5.5 0 0 0 .708-.708L5.707 9l1.647-1.646a.5.5 0 0 0 0-.708z"/>
              </svg>
              ${testFilePath.split('/').pop()}:${testLineNumber}
            </a>
          </td>
          <td>
            <button class="details-toggle" onclick="toggleDetails('details-${component.name.replace(/[^a-zA-Z0-9]/g, "")}-${test.feature.replace(/[^a-zA-Z0-9]/g, "")}')">
              View Details
            </button>
          </td>
        </tr>
      `;
            }
            html += `
              </tbody>
            </table>
          </div>
          
          <div id="detailed-view-${component.name.replace(/[^a-zA-Z0-9]/g, "")}" class="tab-content">
    `;
            // Traditional correlation view (previous format)
            for (const test of component.correlatedTests) {
                const confidenceClass = getConfidenceClass(test.confidence);
                const confidenceLabel = test.confidence >= 0.7 ? 'High' : test.confidence >= 0.4 ? 'Medium' : 'Low';
                html += `
        <div class="correlation ${confidenceClass}">
          <div class="correlation-feature">${test.feature}</div>
          <div class="correlation-scenario">${test.scenario}</div>
          <div class="correlation-step">${test.step}</div>
          <div class="confidence">Confidence: ${confidenceLabel} (${test.confidence.toFixed(2)})</div>
        </div>
      `;
            }
            html += `
          </div>
        </div>
    `;
            // Add detailed coverage sections for each test (hidden by default)
            for (const test of component.correlatedTests) {
                const detailId = `details-${component.name.replace(/[^a-zA-Z0-9]/g, "")}-${test.feature.replace(/[^a-zA-Z0-9]/g, "")}`;
                html += `
        <div id="${detailId}" class="coverage-details">
          <h4>Detailed Coverage: ${test.feature} - ${test.scenario}</h4>
          
          <div class="branch-coverage">
            <h5>Branch Coverage</h5>
            <div class="branch-coverage-item">
              <strong>Line 12:</strong> 
              <div class="branch-coverage-code">condition ? componentA : componentB</div>
              <ul>
                <li><strong>True branch:</strong> Covered (15 executions)</li>
                <li><strong>False branch:</strong> Covered (8 executions)</li>
              </ul>
            </div>
            <div class="branch-coverage-item">
              <strong>Line 25:</strong> 
              <div class="branch-coverage-code">isValid && showElement</div>
              <ul>
                <li><strong>True branch:</strong> Covered (10 executions)</li>
                <li><strong>False branch:</strong> Not covered</li>
              </ul>
            </div>
          </div>
          
          <div class="function-coverage">
            <h5>Function Coverage</h5>
            <div class="function-coverage-item">
              <strong>handleClick (Line 25):</strong> Covered (12 executions)
            </div>
            <div class="function-coverage-item">
              <strong>processData (Line 35):</strong> Not covered
            </div>
          </div>
          
          <div class="source-view">
            <h5>Source Context</h5>
            <pre><code>
<span class="covered">10 function ${component.name}() {</span>
<span class="covered">11   const title = 'Component Title';</span>
<span class="partially-covered">12   const showFeature = condition ? componentA : componentB;</span>
<span class="covered">13   </span>
<span class="covered">14   return (</span>
<span class="covered">15     &lt;div&gt;</span>
<span class="covered">16       &lt;h1&gt;{title}&lt;/h1&gt;</span>
<span class="covered">17       {showFeature}</span>
<span class="not-covered">18       {!showFeature && &lt;Placeholder /&gt;}</span>
<span class="covered">19     &lt;/div&gt;</span>
<span class="covered">20   );</span>
<span class="covered">21 }</span>
            </code></pre>
          </div>
        </div>
      `;
            }
        }
        else {
            html += `<p>No test correlations found.</p>`;
            // Add test recommendation for components with low coverage
            if (component.coverage < 70) {
                html += `
        <div class="test-recommendation">
          <strong>Recommendation:</strong> This component should be prioritized for testing. Consider adding:
          <ul>
            <li>Unit tests to verify component rendering</li>
            <li>Functional tests for component interactions</li>
            <li>Edge case tests for different prop combinations</li>
          </ul>
        </div>
      `;
            }
        }
        html += `
        </div>
      </div>
    `;
        // Add gap analysis section if available
        if (component.gapAnalysis) {
            const priorityClass = component.gapAnalysis.testingPriority === 'high' ? 'badge-low' :
                component.gapAnalysis.testingPriority === 'medium' ? 'badge-medium' : 'badge-high';
            html += `
        <div class="gap-analysis">
          <h3>Testing Gap Analysis</h3>
          <div class="testing-priority">
            <span>Testing Priority:</span>
            <span class="component-coverage-badge ${priorityClass}">${component.gapAnalysis.testingPriority.toUpperCase()}</span>
          </div>
      `;
            if (component.gapAnalysis.missingCoverage.length > 0) {
                html += `
          <div class="missing-coverage">
            <h4>Missing Coverage Areas</h4>
            <ul>
        `;
                for (const gap of component.gapAnalysis.missingCoverage) {
                    html += `<li>${gap}</li>`;
                }
                html += `
            </ul>
          </div>
        `;
            }
            if (component.gapAnalysis.recommendedTests.length > 0) {
                html += `
          <div class="test-recommendations">
            <h4>Recommended Tests</h4>
            <ul>
        `;
                for (const recommendation of component.gapAnalysis.recommendedTests) {
                    html += `<li>${recommendation}</li>`;
                }
                html += `
            </ul>
          </div>
        `;
            }
            html += `</div>`;
        }
        html += `
      </div>
    </div>
    `;
    }
    // Add empty state for when filters return no results
    html += `
    <div id="no-results" class="empty-state" style="display: none;">
      No components match the current filters. Try adjusting your search criteria.
    </div>
  `;
    // Add Venn diagram script and interaction scripts
    html += `
    <script>
      // Debug helper
      console.log('Coverage report script loaded');
      
      // Constants for localStorage
      const STORAGE_KEY = 'coverage-report-preferences';
      const DEFAULT_PREFERENCES = {
        coverageFilter: 'all',
        testStatusFilter: 'all',
        sortOrder: 'coverage-desc',
        showDetails: true,
        showSource: false,
        showTestDetails: false,
        expandedComponents: [],
        searchQuery: ''
      };
      
      // Function to save user preferences to localStorage
      function saveUserPreferences() {
        try {
          const preferences = {
            coverageFilter: document.getElementById('coverage-filter').value,
            testStatusFilter: document.getElementById('test-status-filter').value,
            sortOrder: document.getElementById('component-sort').value,
            showDetails: document.getElementById('show-details').checked,
            showSource: document.getElementById('show-source').checked,
            showTestDetails: document.getElementById('show-test-details').checked,
            expandedComponents: getExpandedComponentIds(),
            searchQuery: document.getElementById('search-input').value
          };
          
          localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
          console.log('Preferences saved:', preferences);
          showSaveNotification();
          return true;
        } catch (e) {
          console.error('Error saving preferences:', e);
          return false;
        }
      }
      
      // Function to get IDs of all expanded components
      function getExpandedComponentIds() {
        const expandedComponents = [];
        document.querySelectorAll('.component').forEach(component => {
          const content = component.querySelector('.component-content');
          if (content && content.style.display === 'block') {
            expandedComponents.push(component.id);
          }
        });
        return expandedComponents;
      }
      
      // Function to load user preferences from localStorage
      function loadUserPreferences() {
        try {
          const savedPrefs = localStorage.getItem(STORAGE_KEY);
          if (!savedPrefs) {
            console.log('No saved preferences found, using defaults');
            return false;
          }
          
          const preferences = JSON.parse(savedPrefs);
          console.log('Loading saved preferences:', preferences);
          
          // Apply filter values
          if (preferences.coverageFilter) {
            const coverageFilter = document.getElementById('coverage-filter');
            if (coverageFilter) coverageFilter.value = preferences.coverageFilter;
          }
          
          if (preferences.testStatusFilter) {
            const testStatusFilter = document.getElementById('test-status-filter');
            if (testStatusFilter) testStatusFilter.value = preferences.testStatusFilter;
          }
          
          if (preferences.sortOrder) {
            const componentSort = document.getElementById('component-sort');
            if (componentSort) componentSort.value = preferences.sortOrder;
          }
          
          // Apply checkbox states
          if (preferences.showDetails !== undefined) {
            const showDetails = document.getElementById('show-details');
            if (showDetails) showDetails.checked = preferences.showDetails;
          }
          
          if (preferences.showSource !== undefined) {
            const showSource = document.getElementById('show-source');
            if (showSource) {
              showSource.checked = preferences.showSource;
              
              // Update source code visibility
              const sourceContainers = document.querySelectorAll('.source-container');
              sourceContainers.forEach(container => {
                container.style.display = preferences.showSource ? 'block' : 'none';
              });
            }
          }
          
          if (preferences.showTestDetails !== undefined) {
            const showTestDetails = document.getElementById('show-test-details');
            if (showTestDetails) {
              showTestDetails.checked = preferences.showTestDetails;
              
              // Update test details visibility
              const testDetails = document.querySelectorAll('.test-details');
              testDetails.forEach(detail => {
                detail.style.display = preferences.showTestDetails ? 'block' : 'none';
              });
            }
          }
          
          // Restore search query
          if (preferences.searchQuery) {
            const searchInput = document.getElementById('search-input');
            if (searchInput) searchInput.value = preferences.searchQuery;
          }
          
          // Expand previously expanded components
          if (preferences.expandedComponents && Array.isArray(preferences.expandedComponents)) {
            preferences.expandedComponents.forEach(componentId => {
              const component = document.getElementById(componentId);
              if (component) {
                const content = component.querySelector('.component-content');
                if (content) content.style.display = 'block';
              }
            });
          }
          
          // Apply filters and sorting
          filterComponents();
          sortComponents();
          
          console.log('Preferences loaded successfully');
          return true;
        } catch (e) {
          console.error('Error loading preferences:', e);
          return false;
        }
      }
      
      // Function to reset preferences to defaults
      function resetUserPreferences() {
        try {
          localStorage.removeItem(STORAGE_KEY);
          console.log('Preferences reset to defaults');
          
          // Apply default values to UI
          const coverageFilter = document.getElementById('coverage-filter');
          if (coverageFilter) coverageFilter.value = DEFAULT_PREFERENCES.coverageFilter;
          
          const testStatusFilter = document.getElementById('test-status-filter');
          if (testStatusFilter) testStatusFilter.value = DEFAULT_PREFERENCES.testStatusFilter;
          
          const componentSort = document.getElementById('component-sort');
          if (componentSort) componentSort.value = DEFAULT_PREFERENCES.sortOrder;
          
          const showDetails = document.getElementById('show-details');
          if (showDetails) showDetails.checked = DEFAULT_PREFERENCES.showDetails;
          
          const showSource = document.getElementById('show-source');
          if (showSource) {
            showSource.checked = DEFAULT_PREFERENCES.showSource;
            
            // Update source code visibility
            const sourceContainers = document.querySelectorAll('.source-container');
            sourceContainers.forEach(container => {
              container.style.display = DEFAULT_PREFERENCES.showSource ? 'block' : 'none';
            });
          }
          
          const showTestDetails = document.getElementById('show-test-details');
          if (showTestDetails) {
            showTestDetails.checked = DEFAULT_PREFERENCES.showTestDetails;
            
            // Update test details visibility
            const testDetails = document.querySelectorAll('.test-details');
            testDetails.forEach(detail => {
              detail.style.display = DEFAULT_PREFERENCES.showTestDetails ? 'block' : 'none';
            });
          }
          
          const searchInput = document.getElementById('search-input');
          if (searchInput) searchInput.value = DEFAULT_PREFERENCES.searchQuery;
          
          // Collapse all components
          document.querySelectorAll('.component-content').forEach(content => {
            content.style.display = 'none';
          });
          
          // Apply filters and sorting
          filterComponents();
          sortComponents();
          
          // Show notification
          showResetNotification();
          
          return true;
        } catch (e) {
          console.error('Error resetting preferences:', e);
          return false;
        }
      }
      
      // Function to show save notification
      function showSaveNotification() {
        const notification = document.getElementById('save-notification');
        if (!notification) return;
        
        notification.textContent = 'Preferences saved';
        notification.classList.add('show');
        
        setTimeout(() => {
          notification.classList.remove('show');
        }, 2000);
      }
      
      // Function to show reset notification
      function showResetNotification() {
        const notification = document.getElementById('save-notification');
        if (!notification) return;
        
        notification.textContent = 'Preferences reset to defaults';
        notification.classList.add('show');
        
        setTimeout(() => {
          notification.classList.remove('show');
        }, 2000);
      }
      
      // Function to check if localStorage is available
      function isLocalStorageAvailable() {
        try {
          const test = 'test';
          localStorage.setItem(test, test);
          localStorage.removeItem(test);
          return true;
        } catch (e) {
          return false;
        }
      }
      
      // Modified filter function to save preferences after filtering
      function filterComponents() {
        console.log('Filtering components');
        const searchInput = document.getElementById('search-input');
        const coverageFilter = document.getElementById('coverage-filter');
        const testStatusFilter = document.getElementById('test-status-filter');
        
        if (!searchInput || !coverageFilter || !testStatusFilter) {
          console.error('Filter elements not found');
          return;
        }
        
        const searchText = searchInput.value.toLowerCase();
        const coverageValue = coverageFilter.value;
        const testStatusValue = testStatusFilter.value;
        
        console.log('Filters:', {searchText, coverageValue, testStatusValue});
        
        const components = document.querySelectorAll('.component');
        let visibleCount = 0;
        
        components.forEach(component => {
          const name = component.getAttribute('data-name')?.toLowerCase() || '';
          const path = component.getAttribute('data-path')?.toLowerCase() || '';
          const coverage = parseFloat(component.getAttribute('data-coverage') || '0');
          const testCount = parseInt(component.getAttribute('data-tests') || '0');
          
          // Apply search filter
          const matchesSearch = searchText === '' || 
                               name.includes(searchText) || 
                               path.includes(searchText);
          
          // Apply coverage filter
          let matchesCoverage = true;
          if (coverageValue === 'high') {
            matchesCoverage = coverage >= 80;
          } else if (coverageValue === 'medium') {
            matchesCoverage = coverage >= 50 && coverage < 80;
          } else if (coverageValue === 'low') {
            matchesCoverage = coverage < 50 && coverage > 0;
          } else if (coverageValue === 'none') {
            matchesCoverage = coverage === 0;
          }
          
          // Apply test status filter
          let matchesTestStatus = true;
          if (testStatusValue === 'with-tests') {
            matchesTestStatus = testCount > 0;
          } else if (testStatusValue === 'without-tests') {
            matchesTestStatus = testCount === 0;
          }
          
          const isVisible = matchesSearch && matchesCoverage && matchesTestStatus;
          component.style.display = isVisible ? 'block' : 'none';
          
          if (isVisible) visibleCount++;
        });
        
        // Show/hide empty state message
        const noResults = document.getElementById('no-results');
        if (noResults) {
          noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
        
        // Save preferences after filtering (if localStorage is available)
        if (isLocalStorageAvailable()) {
          saveUserPreferences();
        }
      }
      
      // Modified sort function to save preferences after sorting
      function sortComponents() {
        console.log('Sorting components');
        const sortSelect = document.getElementById('component-sort');
        if (!sortSelect) {
          console.error('Sort select element not found');
          return;
        }
        
        const sortValue = sortSelect.value;
        console.log('Sort value:', sortValue);
        
        const componentsContainer = document.querySelector('.components-container');
        if (!componentsContainer) {
          console.error('Components container not found');
          return;
        }
        
        const components = Array.from(document.querySelectorAll('.component'));
        
        components.sort((a, b) => {
          switch(sortValue) {
            case 'name':
              return (a.getAttribute('data-name') || '').localeCompare(b.getAttribute('data-name') || '');
            case 'coverage-desc':
              return parseFloat(b.getAttribute('data-coverage') || '0') - parseFloat(a.getAttribute('data-coverage') || '0');
            case 'coverage-asc':
              return parseFloat(a.getAttribute('data-coverage') || '0') - parseFloat(b.getAttribute('data-coverage') || '0');
            case 'tests-desc':
              return parseInt(b.getAttribute('data-tests') || '0') - parseInt(a.getAttribute('data-tests') || '0');
            case 'tests-asc':
              return parseInt(a.getAttribute('data-tests') || '0') - parseInt(b.getAttribute('data-tests') || '0');
            default:
              return 0;
          }
        });
        
        // Remove and reappend components in sorted order
        components.forEach(component => {
          componentsContainer.appendChild(component);
        });
        
        // Save preferences after sorting (if localStorage is available)
        if (isLocalStorageAvailable()) {
          saveUserPreferences();
        }
      }
      
      // Modified toggleComponent function to save state of expanded components
      function toggleComponent(componentId) {
        console.log('Toggling component:', componentId);
        const component = document.getElementById(componentId);
        if (!component) {
          console.error('Component not found with ID:', componentId);
          return;
        }
        
        const content = component.querySelector('.component-content');
        if (!content) {
          console.error('Component content not found in:', componentId);
          return;
        }
        
        const isVisible = content.style.display !== 'none';
        content.style.display = isVisible ? 'none' : 'block';
        console.log(isVisible ? 'Hiding' : 'Showing', 'component content for', componentId);
        
        // Save preferences after toggling (if localStorage is available)
        if (isLocalStorageAvailable()) {
          saveUserPreferences();
        }
      }
      
      // Wait for DOM to be ready
      document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded, setting up event handlers');
        
        // Check if localStorage is available
        const storageAvailable = isLocalStorageAvailable();
        console.log('localStorage available:', storageAvailable);
        
        // Hide preferences UI if localStorage is not available
        if (!storageAvailable) {
          const preferencesStatus = document.getElementById('preferences-status');
          const resetButton = document.getElementById('reset-preferences');
          
          if (preferencesStatus) {
            preferencesStatus.innerHTML = '<span style="color: #e74c3c;">✗</span> Preferences cannot be saved (localStorage not available)';
          }
          
          if (resetButton) {
            resetButton.style.display = 'none';
          }
        }
        
        // Load saved preferences (if available)
        if (storageAvailable) {
          loadUserPreferences();
        }
        
        // Setup for reset preferences button
        const resetButton = document.getElementById('reset-preferences');
        if (resetButton) {
          resetButton.addEventListener('click', function() {
            resetUserPreferences();
          });
        }
        
        // Setup for show source code toggle
        const showSourceCheckbox = document.getElementById('show-source');
        if (showSourceCheckbox) {
          console.log('Found source code checkbox, attaching handler');
          showSourceCheckbox.addEventListener('change', function() {
            console.log('Show source checkbox changed:', this.checked);
            const sourceContainers = document.querySelectorAll('.source-container');
            console.log('Found', sourceContainers.length, 'source containers');
            sourceContainers.forEach(container => {
              container.style.display = this.checked ? 'block' : 'none';
            });
            
            // Save preferences after changing source code visibility
            if (storageAvailable) {
              saveUserPreferences();
            }
          });
        } else {
          console.error('Show source checkbox not found!');
        }
        
        // Setup for component headers
        const componentHeaders = document.querySelectorAll('.component-header');
        console.log('Found', componentHeaders.length, 'component headers');
        componentHeaders.forEach(header => {
          header.addEventListener('click', function() {
            const componentId = this.parentElement.id;
            toggleComponent(componentId);
          });
        });
        
        // Setup for copy buttons
        const copyButtons = document.querySelectorAll('.copy-path-btn');
        console.log('Found', copyButtons.length, 'copy buttons');
        copyButtons.forEach(button => {
          button.addEventListener('click', function(e) {
            e.stopPropagation();
            const path = this.getAttribute('data-path');
            if (path) {
              copyToClipboard(path);
            } else {
              console.error('No path attribute found on copy button');
            }
          });
        });
        
        // Setup filter and sort controls
        const searchInput = document.getElementById('search-input');
        const coverageFilter = document.getElementById('coverage-filter');
        const testStatusFilter = document.getElementById('test-status-filter');
        const componentSort = document.getElementById('component-sort');
        
        if (searchInput) {
          searchInput.addEventListener('input', filterComponents);
        }
        
        if (coverageFilter) {
          coverageFilter.addEventListener('change', filterComponents);
        }
        
        if (testStatusFilter) {
          testStatusFilter.addEventListener('change', filterComponents);
        }
        
        if (componentSort) {
          componentSort.addEventListener('change', sortComponents);
        }
        
        // Setup for "Show Test Details" checkbox
        const showTestDetailsCheckbox = document.getElementById('show-test-details');
        if (showTestDetailsCheckbox) {
          showTestDetailsCheckbox.addEventListener('change', function() {
            const testDetails = document.querySelectorAll('.test-details');
            testDetails.forEach(detail => {
              detail.style.display = this.checked ? 'block' : 'none';
            });
            
            // Save preferences after changing test details visibility
            if (storageAvailable) {
              saveUserPreferences();
            }
          });
        }
        
        // Apply initial filtering and sorting
        filterComponents();
        sortComponents();
      });
      
      // Venn diagram data and initialization (if available)
      const sets = ${generateVennData(components)};
      
      // Check if d3 and venn are available before trying to use them
      window.addEventListener('load', function() {
        console.log('Window loaded, checking for d3 and venn libraries');
        
        if (typeof d3 !== 'undefined' && typeof venn !== 'undefined' && document.getElementById('venn-diagram')) {
          console.log('Initializing Venn diagram');
          
          try {
            // Draw Venn diagram
            const chart = venn.VennDiagram()
              .width(900)
              .height(400);
            
            const div = d3.select("#venn-diagram")
              .datum(sets)
              .call(chart);
            
            // Add tooltips
            const tooltip = d3.select("body").append("div")
              .attr("class", "tooltips")
              .style("opacity", 0);
            
            div.selectAll("text")
              .style("fill", "white")
              .style("font-weight", "bold")
              .style("font-size", "14px");
              
            div.selectAll(".venn-circle")
              .style("stroke-opacity", 0)
              .style("stroke-width", 1)
              .style("stroke", "#fff")
              .style("fill-opacity", 0.7);
              
            div.selectAll(".venn-area")
              .on("mouseover", function(d) {
                // Show tooltip
                tooltip.transition()
                  .duration(200)
                  .style("opacity", .9)
                  .style("display", "block");
                  
                // Set tooltip content with actual component counts
                tooltip.html("Test type: " + d.sets.join(" & ") + 
                            "<br>Components: " + d.size)
                  .style("left", (d3.event.pageX + 5) + "px")
                  .style("top", (d3.event.pageY - 28) + "px");
                  
                // Highlight this area
                d3.select(this)
                  .select("path")
                  .style("fill-opacity", 0.9)
                  .style("stroke-opacity", 1);
              })
              .on("mouseout", function() {
                // Hide tooltip
                tooltip.transition()
                  .duration(500)
                  .style("opacity", 0)
                  .style("display", "none");
                  
                // Reset highlight
                d3.select(this)
                  .select("path")
                  .style("fill-opacity", 0.7)
                  .style("stroke-opacity", 0);
              });
          } catch (e) {
            console.error('Error initializing Venn diagram:', e);
            document.getElementById("venn-diagram").innerHTML = 
              '<div style="padding: 20px; text-align: center; background: #f8f9fa; border-radius: 5px;">'+
              '<p>Venn diagram visualization error: ' + e.message + '</p>'+
              '</div>';
          }
        } else {
          console.warn('D3 or Venn libraries not available');
          if (document.getElementById("venn-diagram")) {
            document.getElementById("venn-diagram").innerHTML = 
              '<div style="padding: 20px; text-align: center; background: #f8f9fa; border-radius: 5px;">'+
              '<p>Venn diagram visualization not available. Libraries could not be loaded.</p>'+
              '</div>';
          }
        }
      });
      
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
          
          // Save expanded state to preferences
          saveUserPreference('expandedComponents', detailId, detailElement.style.display === 'block');
        }
      }
      
      // Export functionality
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
              const detailsElement = document.getElementById(`;
    details - $;
    {
        componentId;
    }
    `);
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
              const detailsElement = document.getElementById(`;
    details - $;
    {
        componentId;
    }
    `);
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
          fileName = `;
    coverage - ;
    -$;
    {
        new Date().toISOString().slice(0, 10);
    }
    json `;
          mimeType = 'application/json';
        } else if (format === 'csv') {
          exportData = convertToCSV(components);
          fileName = `;
    coverage - ;
    -$;
    {
        new Date().toISOString().slice(0, 10);
    }
    csv `;
          mimeType = 'text/csv';
        } else if (format === 'html') {
          exportData = generateExportHTML(components);
          fileName = `;
    coverage - ;
    -$;
    {
        new Date().toISOString().slice(0, 10);
    }
    html `;
          mimeType = 'text/html';
        }
        
        // Trigger download
        downloadFile(exportData, fileName, mimeType);
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
            \`"\${item.name}"\`,
            \`"\${item.path}"\`,
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
        const fs = require('fs');
        const path = require('path');
        
        // Read the template file
        const templatePath = path.resolve(__dirname, 'templates', 'coverage-report-template.html');
        let template = fs.readFileSync(templatePath, 'utf8');
        
        // Generate table rows
        const tableRows = data.map(item => {
          const coverageClass = getCoverageClass(item.coverage);
          return ` < tr >
        $;
    {
        item.name || '';
    }
    /td>
        < td > $;
    {
        item.path || '';
    }
    /td>
        < td;
    class {
    }
    "${coverageClass}" > $;
    {
        item.coverage ? item.coverage.toFixed(1) + '%' : '0%';
    }
    /td>
        < td > $;
    {
        item.tests || 0;
    }
    /td>
        < td > $;
    {
        item.metrics?.statements ? item.metrics.statements.toFixed(1) + '%' : 'N/A';
    }
    /td>
        < td > $;
    {
        item.metrics?.branches ? item.metrics.branches.toFixed(1) + '%' : 'N/A';
    }
    /td>
        < td > $;
    {
        item.metrics?.functions ? item.metrics.functions.toFixed(1) + '%' : 'N/A';
    }
    /td>
        < td > $;
    {
        item.metrics?.lines ? item.metrics.lines.toFixed(1) + '%' : 'N/A';
    }
    /td>
        < /tr>`;
}
join('');
// Replace placeholders in the template
template = template.replace(/{{timestamp}}/g, timestamp);
template = template.replace(/{{table_rows}}/g, tableRows);
return template;
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
// Add event listener for export button
document.getElementById('export-button').addEventListener('click', exportCoverageData);
/script>
    < /body>
    < /html>`;
// Add notification div
// Look for the closing body tag and insert the notification div before it
html = html.replace('</body>', `
    <div id="save-notification" class="preferences-saved">Preferences saved</div>
  </body>
  `);
// Now let's fix the missing functions
// First, add the copyToClipboard, fallbackCopy functions after the resetUserPreferences function
// (Look for "function resetUserPreferences" and then add our functions after it finishes)
// Add this right after the showResetNotification function
html = html.replace(`function showResetNotification() {
           const notification = document.getElementById('save-notification');
           if (!notification) return;
           
           notification.textContent = 'Preferences reset to defaults';
           notification.classList.add('show');
           
           setTimeout(() => {
             notification.classList.remove('show');
           }, 2000);
         }
         
         // Function to check if localStorage is available`, `function showResetNotification() {
           const notification = document.getElementById('save-notification');
           if (!notification) return;
           
           notification.textContent = 'Preferences reset to defaults';
           notification.classList.add('show');
           
           setTimeout(() => {
             notification.classList.remove('show');
           }, 2000);
         }
         
         // Function to copy text to clipboard
         function copyToClipboard(text) {
           console.log('Copying to clipboard:', text);
           
           // Use modern clipboard API with fallback
           if (navigator.clipboard) {
             navigator.clipboard.writeText(text)
               .then(() => {
                 console.log('Text copied successfully');
                 alert('Path copied to clipboard');
               })
               .catch(err => {
                 console.error('Failed to copy: ', err);
                 fallbackCopy(text);
               });
           } else {
             fallbackCopy(text);
           }
         }
         
         // Fallback copy method using textarea
         function fallbackCopy(text) {
           console.log('Using fallback copy method');
           const textArea = document.createElement('textarea');
           textArea.value = text;
           document.body.appendChild(textArea);
           textArea.select();
           
           try {
             const successful = document.execCommand('copy');
             console.log(successful ? 'Fallback copy successful' : 'Fallback copy failed');
             alert(successful ? 'Path copied to clipboard' : 'Copy failed, please copy manually');
           } catch (err) {
             console.error('Fallback copy error:', err);
             alert('Copy failed: ' + err);
           }
           
           document.body.removeChild(textArea);
         }
         
         // Function to toggle detailed coverage information
         function toggleDetails(detailId) {
           console.log('Toggling details for:', detailId);
           const detailElement = document.getElementById(detailId);
           if (!detailElement) {
             console.error('Detail element not found with ID:', detailId);
             return;
           }
           
           const isVisible = detailElement.style.display === 'block';
           
           if (isVisible) {
             detailElement.style.display = 'none';
             console.log('Hiding details for:', detailId);
           } else {
             // Hide all other details first
             document.querySelectorAll('.coverage-details').forEach(el => {
               el.style.display = 'none';
             });
             
             detailElement.style.display = 'block';
             console.log('Showing details for:', detailId);
             
             // Scroll to the details
             detailElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
           }
         }
         
         // Function to switch tabs
         function showTab(button, tabId) {
           console.log('Showing tab:', tabId);
           
           // Get the tab container
           const container = button.closest('.tab-container');
           if (!container) {
             console.error('Tab container not found for button:', button);
             return;
           }
           
           // Remove active class from all buttons
           container.querySelectorAll('.tab-button').forEach(btn => {
             btn.classList.remove('active');
           });
           
           // Add active class to clicked button
           button.classList.add('active');
           
           // Hide all tab contents
           container.querySelectorAll('.tab-content').forEach(tab => {
             tab.classList.remove('active');
           });
           
           // Show the selected tab content
           const tabContent = document.getElementById(tabId);
           if (tabContent) {
             tabContent.classList.add('active');
           } else {
             console.error('Tab content not found with ID:', tabId);
           }
         }
         
         // Function to highlight code in file
         function highlightCode(filePath, lineNumber) {
           console.log('Highlighting code in:', filePath, 'at line:', lineNumber);
           alert('This would open ' + filePath + ' at line ' + lineNumber + ' in a real implementation');
           return false; // Prevent default action
         }
         
         // Function to show more tests
         function showMoreTests(button, componentName) {
           console.log('Showing more tests for:', componentName);
           const parent = button.parentNode;
           if (!parent) {
             console.error('Parent node not found for button');
             return;
           }
           
           const hiddenSection = parent.querySelector('.hidden-correlations');
           if (hiddenSection) {
             hiddenSection.style.display = 'block';
             button.style.display = 'none';
           } else {
             console.error('Hidden correlations section not found');
           }
         }
         
         // Function to check if localStorage is available`);
// Add CSS for the export controls
html = html.replace(`.reset-button:hover {
      background-color: #e9ecef;
      border-color: #ced4da;
    }`, `.reset-button:hover {
      background-color: #e9ecef;
      border-color: #ced4da;
    }
    
    .export-controls {
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      align-items: center;
    }
    
    .export-format {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .export-options {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
    }
    
    .export-button {
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 15px;
      cursor: pointer;
      font-size: 0.9em;
      transition: background-color 0.2s ease;
      margin-left: auto;
    }
    
    .export-button:hover {
      background-color: #2980b9;
    }
    
    @media (max-width: 768px) {
      .export-controls {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .export-button {
        margin-left: 0;
        margin-top: 10px;
        width: 100%;
      }
    }`);
// Add the toggleDetails function and export functionality to the script
html = html.replace(`// Function to check if localStorage is available`, `// Function to toggle detailed coverage information
      function toggleDetails(detailId) {
        console.log('Toggling details for:', detailId);
        const detailElement = document.getElementById(detailId);
        if (!detailElement) {
          console.error('Detail element not found with ID:', detailId);
          return;
        }
        
        const isVisible = detailElement.style.display === 'block';
        
        if (isVisible) {
          detailElement.style.display = 'none';
          console.log('Hiding details for:', detailId);
        } else {
          // Hide all other details first
          document.querySelectorAll('.coverage-details').forEach(el => {
            el.style.display = 'none';
          });
          
          detailElement.style.display = 'block';
          console.log('Showing details for:', detailId);
          
          // Scroll to the details
          detailElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
      
      // Export functionality
      function exportCoverageData() {
        const format = document.getElementById('export-format').value;
        const filteredOnly = document.getElementById('export-filtered-only').checked;
        const includeSource = document.getElementById('export-include-source').checked;
        const includeTests = document.getElementById('export-include-tests').checked;
        
        console.log('Exporting coverage data:', { format, filteredOnly, includeSource, includeTests });
        
        // Get all components or just filtered ones
        let components = Array.from(document.querySelectorAll('.component'));
        if (filteredOnly) {
          components = components.filter(comp => comp.style.display !== 'none');
        }
        
        if (components.length === 0) {
          alert('No components to export. Please adjust your filters.');
          return;
        }
        
        // Extract data from components
        const exportData = components.map(comp => {
          const data = {
            name: comp.getAttribute('data-name'),
            path: comp.getAttribute('data-path'),
            coverage: parseFloat(comp.getAttribute('data-coverage') || '0'),
            tests: parseInt(comp.getAttribute('data-tests') || '0')
          };
          
          // Add metrics if available
          const metrics = {};
          const metricsElements = comp.querySelectorAll('.metric');
          metricsElements.forEach(metric => {
            const label = metric.querySelector('div:first-child').textContent.trim().toLowerCase();
            const valueElement = metric.querySelector('.metric-value');
            if (valueElement) {
              const value = parseFloat(valueElement.textContent.replace('%', ''));
              metrics[label] = value;
            }
          });
          
          if (Object.keys(metrics).length > 0) {
            data.metrics = metrics;
          }
          
          // Add test correlations if requested
          if (includeTests) {
            const correlations = [];
            const correlationElements = comp.querySelectorAll('.correlation');
            correlationElements.forEach(corr => {
              const feature = corr.querySelector('.correlation-feature')?.textContent;
              const scenario = corr.querySelector('.correlation-scenario')?.textContent;
              const step = corr.querySelector('.correlation-step')?.textContent;
              const confidenceText = corr.querySelector('.confidence')?.textContent;
              const confidence = confidenceText ? 
                parseFloat(confidenceText.match(/\\d+\\.\\d+/) ? confidenceText.match(/\\d+\\.\\d+/)[0] : '0') : 0;
              
              if (feature) {
                correlations.push({ feature, scenario, step, confidence });
              }
            });
            
            if (correlations.length > 0) {
              data.correlations = correlations;
            }
          }
          
          // Add source code if requested (JSON only)
          if (includeSource && format === 'json') {
            const sourceContainer = comp.querySelector('.source-container');
            if (sourceContainer) {
              const sourceContent = sourceContainer.querySelector('pre')?.textContent;
              if (sourceContent) {
                data.sourceCode = sourceContent;
              }
            }
          }
          
          return data;
        });
        
        // Generate the export based on format
        if (format === 'json') {
          downloadAsFile('coverage-data.json', JSON.stringify(exportData, null, 2));
        } else if (format === 'csv') {
          const csv = convertToCSV(exportData);
          downloadAsFile('coverage-data.csv', csv);
        } else if (format === 'html') {
          // Create a simplified HTML version of the current view
          const html = generateExportHTML(exportData);
          downloadAsFile('coverage-report.html', html);
        }
      }
      
      // Helper function to download data as a file
      function downloadAsFile(filename, content) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
      
      // Helper function to convert data to CSV
      function convertToCSV(data) {
        if (data.length === 0) return '';
        
        // Get all possible headers from all objects
        const headers = new Set();
        data.forEach(item => {
          Object.keys(item).forEach(key => {
            if (key !== 'correlations' && key !== 'sourceCode' && key !== 'metrics') {
              headers.add(key);
            }
          });
          
          // Add metrics headers if present
          if (item.metrics) {
            Object.keys(item.metrics).forEach(key => {
              headers.add('metric_' + key);
            });
          }
        });
        
        // Convert headers to array and create CSV header row
        const headerRow = Array.from(headers).join(',');
        
        // Create rows
        const rows = data.map(item => {
          return Array.from(headers).map(header => {
            if (header.startsWith('metric_') && item.metrics) {
              const metricKey = header.replace('metric_', '');
              return item.metrics[metricKey] !== undefined ? item.metrics[metricKey] : '';
            } else {
              return item[header] !== undefined ? item[header] : '';
            }
          }).join(',');
        });
        
        // Combine header and rows
        return headerRow + '\\n' + rows.join('\\n');
      }
      
      // Helper function to generate a simplified HTML export
      function generateExportHTML(data) {
        const timestamp = new Date().toLocaleString();
        
        // Using a template string with proper TypeScript escaping
        const html = ` < !DOCTYPE, html >
    lang, "en" >
    charset, "UTF-8" >
    name, "viewport", content = "width=device-width, initial-scale=1.0" >
    Coverage, Report, Export - $, { timestamp } < (/title>), body, { font } - family, sans - serif);
line - height;
1.6;
max - width;
1200;
px;
margin: 0;
auto;
padding: 20;
px;
h1;
{
    color: #;
    2;
    c3e50;
    border - bottom;
    2;
    px;
    solid;
    #eee;
    padding - bottom;
    10;
    px;
}
table;
{
    width: 100 % ;
    border - collapse;
    collapse;
    margin: 20;
    px;
    0;
}
th, td;
{
    padding: 8;
    px;
    text - align;
    left;
    border - bottom;
    1;
    px;
    solid;
    #ddd;
}
th;
{
    background - color;
    #f5f5f5;
}
tr: hover;
{
    background - color;
    #f9f9f9;
}
high;
{
    color: #;
    27;
    ae60;
}
medium;
{
    color: #f39c12;
}
low;
{
    color: #e74c3c;
}
footer;
{
    margin - top;
    30;
    px;
    color: #;
    7;
    f8c8d;
    font - size;
    0.9e;
    m;
}
/style>
    < /head>
    < body >
    Coverage;
Report;
Export < /h1>
    < p > Generated;
on;
$;
{
    timestamp;
}
/p>
    < table >
    Component < /th>
    < th > Path < /th>
    < th > Coverage < /th>
    < th > Tests < /th>
    < th > Statements < /th>
    < th > Branches < /th>
    < th > Functions < /th>
    < th > Lines < /th>
    < /tr>
    < (/thead>);
$;
{
    data.map(item => {
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
/tbody>
    < /table>
    < footer >
    Generated;
by;
Coverage;
Report;
Tool < /p>
    < /footer>
    < /body>
    < /html>`;
return html;
;
// Add event listener for the export button
html = html.replace(`// Wait for DOM to be ready
      document.addEventListener('DOMContentLoaded', function() {`, `// Wait for DOM to be ready
      document.addEventListener('DOMContentLoaded', function() {
        // Setup export button
        const exportButton = document.getElementById('export-button');
        if (exportButton) {
          exportButton.addEventListener('click', exportCoverageData);
        }`);
return html;
// Helper function to calculate average coverage
function calculateAverageCoverage(components) {
    if (components.length === 0)
        return 0;
    const totalCoverage = components.reduce((sum, component) => sum + component.coverage, 0);
    return totalCoverage / components.length;
}
// Helper function to get CSS class based on coverage value
function getCoverageClass(coverage) {
    if (coverage >= 80)
        return 'metric-high';
    if (coverage >= 50)
        return 'metric-medium';
    return 'metric-low';
}
// Helper function to get CSS class based on confidence value
function getConfidenceClass(confidence) {
    if (confidence >= 0.7)
        return 'correlation-high';
    if (confidence >= 0.4)
        return 'correlation-medium';
    return 'correlation-low';
}
// Generate data for Venn diagram
function generateVennData(components) {
    // Create sets to track which components are in each test category
    const unitTestComponents = new Set();
    const integrationTestComponents = new Set();
    const utilityTestComponents = new Set();
    console.log('Analyzing test categories for Venn diagram...');
    // Track which components are in which test categories
    for (const component of components) {
        let hasUnitTest = false;
        let hasIntegrationTest = false;
        let hasUtilityTest = false;
        // Skip components with no tests
        if (!component.correlatedTests || component.correlatedTests.length === 0) {
            continue;
        }
        // Extract unique features and scenarios
        const features = new Set(component.correlatedTests.map(t => t.feature.toLowerCase()));
        const scenarios = new Set(component.correlatedTests.map(t => t.scenario.toLowerCase()));
        // Check for component types based on path, name and content
        const isUIComponent = component.path.includes('/components/') ||
            component.name.endsWith('Button') ||
            component.name.endsWith('View') ||
            component.name.endsWith('Component');
        const isUtility = component.path.includes('/utils/') ||
            component.name === 'Utils' ||
            component.name.includes('Helper') ||
            component.name.includes('Util');
        const isApp = component.name === 'App' ||
            component.path.endsWith('App.tsx') ||
            component.path.includes('/pages/');
        // Categorize based on the test data and component type
        for (const test of component.correlatedTests) {
            const fullText = `${test.feature} ${test.scenario} ${test.step}`.toLowerCase();
            // UI Component Test
            if (isUIComponent ||
                fullText.includes('render') ||
                fullText.includes('component') ||
                fullText.includes('button') ||
                fullText.includes('element') ||
                fullText.includes('dom')) {
                hasUnitTest = true;
            }
            // Integration/App Test
            if (isApp ||
                fullText.includes('app') ||
                fullText.includes('root_app') ||
                fullText.includes('integration') ||
                component.correlatedTests.length > 5) {
                hasIntegrationTest = true;
            }
            // Utility Test
            if (isUtility ||
                fullText.includes('utils') ||
                fullText.includes('helper') ||
                fullText.includes('function') ||
                test.feature.toLowerCase() === 'utils') {
                hasUtilityTest = true;
            }
        }
        // Add component to appropriate sets
        if (hasUnitTest)
            unitTestComponents.add(component.path);
        if (hasIntegrationTest)
            integrationTestComponents.add(component.path);
        if (hasUtilityTest)
            utilityTestComponents.add(component.path);
        console.log(`Component ${component.name}: UI=${hasUnitTest}, Integration=${hasIntegrationTest}, Utility=${hasUtilityTest}`);
    }
    // Calculate set sizes and intersections based on actual components
    const unitSize = unitTestComponents.size;
    const integrationSize = integrationTestComponents.size;
    const utilitySize = utilityTestComponents.size;
    console.log(`Test categories: UI=${unitSize}, Integration=${integrationSize}, Utility=${utilitySize}`);
    // Calculate intersections using Set operations
    const unitAndIntegration = [...unitTestComponents].filter(path => integrationTestComponents.has(path)).length;
    const unitAndUtility = [...unitTestComponents].filter(path => utilityTestComponents.has(path)).length;
    const integrationAndUtility = [...integrationTestComponents].filter(path => utilityTestComponents.has(path)).length;
    // Triple intersection
    const allThree = [...unitTestComponents].filter(path => integrationTestComponents.has(path) && utilityTestComponents.has(path)).length;
    console.log(`Intersections: UI∩Integration=${unitAndIntegration}, UI∩Utility=${unitAndUtility}, Integration∩Utility=${integrationAndUtility}, All=${allThree}`);
    // Create sets array for venn.js
    const sets = [
        { sets: ['UI Components'], size: unitSize },
        { sets: ['Integration'], size: integrationSize },
        { sets: ['Utilities'], size: utilitySize },
        { sets: ['UI Components', 'Integration'], size: unitAndIntegration },
        { sets: ['UI Components', 'Utilities'], size: unitAndUtility },
        { sets: ['Integration', 'Utilities'], size: integrationAndUtility },
        { sets: ['UI Components', 'Integration', 'Utilities'], size: allThree }
    ];
    // If we have no real data (all sets empty), create sample data for demonstration
    if (unitSize === 0 && integrationSize === 0 && utilitySize === 0) {
        console.log('No test category data found. Using sample data for Venn diagram.');
        return JSON.stringify([
            { sets: ['UI Components'], size: 2 },
            { sets: ['Integration'], size: 2 },
            { sets: ['Utilities'], size: 1 },
            { sets: ['UI Components', 'Integration'], size: 1 },
            { sets: ['UI Components', 'Utilities'], size: 0 },
            { sets: ['Integration', 'Utilities'], size: 1 },
            { sets: ['UI Components', 'Integration', 'Utilities'], size: 0 }
        ]);
    }
    // Return real data
    return JSON.stringify(sets);
}
// Main execution
async function main() {
    try {
        console.log('Generating HTML report...');
        // Step 1: Read correlation data
        let correlationData = [];
        try {
            const correlationContent = await fs.readFile(CORRELATION_PATH, 'utf8');
            correlationData = JSON.parse(correlationContent);
            console.log(`Loaded correlation data for ${correlationData.length} components.`);
        }
        catch (error) {
            console.warn('No correlation data found. Run correlate:coverage script first.');
        }
        // Step 2: Read coverage data
        let coverageData = [];
        try {
            const coverageContent = await fs.readFile(COMPONENT_COVERAGE_PATH, 'utf8');
            coverageData = JSON.parse(coverageContent);
            console.log(`Loaded coverage data for ${coverageData.length} components.`);
        }
        catch (error) {
            console.warn('No coverage data found. Run analyze:mock-coverage script first.');
        }
        // Step 2.5: Read mock coverage data if we're using the mock source
        let mockCoverageData = null;
        if (COVERAGE_SOURCE !== 'babel') {
            try {
                const mockCoverageContent = await fs.readFile(path.resolve(process.cwd(), 'coverage-mock/coverage.json'), 'utf8');
                mockCoverageData = JSON.parse(mockCoverageContent);
                console.log(`Loaded mock coverage data with ${mockCoverageData.components.length} components.`);
            }
            catch (error) {
                console.warn('No mock coverage data found.');
            }
        }
        // Step 3: Merge data if needed
        let mergedData = correlationData;
        if (coverageData.length > 0 && correlationData.length > 0) {
            // Add detailed coverage metrics to correlation data
            mergedData = correlationData.map(component => {
                const coverage = coverageData.find(c => c.path === component.path);
                if (coverage) {
                    return {
                        ...component,
                        statements: coverage.statements,
                        branches: coverage.branches,
                        functions: coverage.functions,
                        lines: coverage.lines
                    };
                }
                return component;
            });
        }
        // Step 3.5: Enhance with mock coverage data if available
        if (mockCoverageData && mockCoverageData.components.length > 0) {
            // Use mock coverage data to enhance our component data
            mergedData = mergedData.map(component => {
                // Find matching component in mock data
                const mockComponent = mockCoverageData.components.find((c) => c.path === component.path || path.basename(c.path) === path.basename(component.path));
                if (mockComponent) {
                    return {
                        ...component,
                        statements: mockComponent.statements || component.statements,
                        branches: mockComponent.branches || component.branches,
                        functions: mockComponent.functions || component.functions,
                        lines: mockComponent.lines || component.lines,
                        sourceInfo: mockComponent.sourceInfo,
                        // If we have different coverage values, use the mock ones
                        coverage: mockComponent.coverage ?
                            (mockComponent.coverage.unit || mockComponent.coverage.e2e || mockComponent.coverage.runtime || 0) :
                            component.coverage
                    };
                }
                return component;
            });
        }
        // Step 3.6: Add source code data
        console.log('Adding source code data to components...');
        for (const component of mergedData) {
            try {
                // Extract source code
                const sourceCode = await extractSourceCode(component.path);
                if (sourceCode) {
                    component.sourceCode = sourceCode;
                    component.lineCount = sourceCode.split('\n').length;
                    // Use sourceInfo if available, otherwise generate mock data
                    if (component.sourceInfo) {
                        component.coveredLines = component.sourceInfo.coveredLines;
                    }
                    else {
                        // Mock covered lines for demo - in a real implementation, 
                        // these would come from actual coverage data
                        const totalLines = component.lineCount;
                        const coveredLineCount = Math.floor(totalLines * (component.coverage / 100));
                        // Create simple simulated covered lines (every other line for demo purposes)
                        component.coveredLines = Array.from({ length: coveredLineCount }, (_, i) => i * 2 + 1).filter(line => line <= totalLines);
                    }
                }
            }
            catch (error) {
                console.warn(`Error adding source code for ${component.path}:`, error);
            }
        }
        // Step 4: Generate HTML content
        const htmlContent = generateHTML(mergedData);
        // Step 5: Write HTML file
        await fs.mkdir(OUTPUT_DIR, { recursive: true });
        await fs.writeFile(HTML_OUTPUT_PATH, htmlContent);
        // Add export functionality to the report
        await (0, export_coverage_1.addExportToReport)(HTML_OUTPUT_PATH);
        console.log(`HTML report generated at ${HTML_OUTPUT_PATH}`);
    }
    catch (error) {
        console.error('Error generating HTML report:', error);
        process.exit(1);
    }
}
main();
