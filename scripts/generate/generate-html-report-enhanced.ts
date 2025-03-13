/**
 * Enhanced HTML Report Generator
 * 
 * This script generates a full-featured HTML report of component coverage analysis
 * that includes source code viewing, test coverage visualization, test file viewing,
 * and test ID recommendations.
 */

import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import * as fsSync from 'fs';
import { promisify } from 'util';
import glob from 'glob';

// Convert callback-based glob to promise-based
const globPromise = promisify(glob);

// Types for component with tests
interface CorrelatedTest {
  feature: string;
  scenario: string;
  step: string;
  confidence: number;
  isE2E?: boolean; // Add this to identify E2E tests
}

interface SourceInfo {
  lineCount: number;
  coveredLines: number[];
  uncoveredLines: number[];
}

interface ComponentWithTests {
  path: string;
  name: string;
  coverage: number;
  correlatedTests?: CorrelatedTest[];
  gapAnalysis?: {
    testingPriority: 'high' | 'medium' | 'low';
    missingCoverage: string[];
    recommendedTests: string[];
  };
  sourceCode?: string;
  lineCount?: number;
  coveredLines?: number[];
  uncoveredLines?: number[];
  statements?: number;
  branches?: number;
  functions?: number;
  lines?: number;
  sourceInfo?: SourceInfo;
  recommendedTestIds?: string[];
  tests?: number;
  testFiles?: TestFile[];
  metrics?: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
}

interface TestFile {
  path: string;
  content: string;
  highlightedTests?: {
    name: string;
    lineStart: number;
    lineEnd: number;
  }[];
}

// Path constants
const PROJECT_ROOT = process.env.PROJECT_ROOT || process.cwd();
console.log(`Using PROJECT_ROOT: ${PROJECT_ROOT}`);

// For debugging environment variables
if (process.env.PROJECT_ROOT) {
  console.log('PROJECT_ROOT is explicitly set in environment to:', process.env.PROJECT_ROOT);
} else {
  console.log('PROJECT_ROOT not found in environment, using current working directory instead:', process.cwd());
}

const COVERAGE_DIR = path.resolve(process.cwd(), 'coverage'); 
const COVERAGE_ANALYSIS_DIR = path.resolve(process.cwd(), 'coverage-analysis');
const OUTPUT_DIR = path.resolve(process.cwd(), 'coverage-project');

// Determine the source of coverage data based on environment variable
const COVERAGE_SOURCE = process.env.COVERAGE_SOURCE || 'standard';

// Define input and output paths based on coverage source
const COMPONENT_COVERAGE_PATH = COVERAGE_SOURCE === 'project'
  ? path.resolve(COVERAGE_ANALYSIS_DIR, 'project-component-coverage.json')
  : path.resolve(COVERAGE_DIR, 'component-coverage.json');

const CORRELATION_PATH = COVERAGE_SOURCE === 'project'
  ? path.resolve(COVERAGE_ANALYSIS_DIR, 'project-test-component-correlation.json')
  : path.resolve(COVERAGE_DIR, 'test-component-correlation.json');

const HTML_OUTPUT_PATH = path.resolve(OUTPUT_DIR, 'coverage.html');
const MOCK_APP_DIR = path.resolve(process.cwd(), '__mocks__/src');

/**
 * Extract source code from a file path
 */
async function extractSourceCode(filePath: string, linesToHighlight?: number[]): Promise<string | null> {
  console.log(`Extracting source code for: ${filePath}`);
  
  // First try to check if this is a project file path
  const isProjectPath = process.env.PROJECT_ROOT && filePath.includes(process.env.PROJECT_ROOT);
  
  try {
    // If the file path starts with PROJECT_ROOT, try to read it directly
    if (isProjectPath) {
      try {
        const content = await fsPromises.readFile(filePath, 'utf8');
        console.log(`Found source file at: ${filePath}`);
        return content;
      } catch (error) {
        console.warn(`Could not read project file at ${filePath}. Will try alternative paths.`);
      }
    }
    
    // Try to read the file directly first
    try {
      const content = await fsPromises.readFile(filePath, 'utf8');
      console.log(`Found source file at: ${filePath}`);
      return content;
    } catch (error) {
      // File doesn't exist at the provided path
      console.warn(`Could not read file at ${filePath}. Trying alternative paths...`);
    }
    
    // If the original path didn't work, try looking for the file in the project root
    if (process.env.PROJECT_ROOT) {
      const fileName = path.basename(filePath);
      
      // First try direct path mapping from __mocks__ to PROJECT_ROOT
      if (filePath.includes('__mocks__/src/')) {
        const projectPath = filePath.replace(
          /__mocks__\/src\//,
          `${process.env.PROJECT_ROOT}/src/`
        );
        
        try {
          const content = await fsPromises.readFile(projectPath, 'utf8');
          console.log(`Found source file at alternative path: ${projectPath}`);
          return content;
        } catch (error) {
          console.warn(`Could not read file at mapped path ${projectPath}.`);
        }
      }
      
      // Try to find the file by name in the project root recursively
      try {
        const { execSync } = require('child_process');
        const result = execSync(`find ${process.env.PROJECT_ROOT} -name "${fileName}" | grep -v "node_modules" | head -1`, { encoding: 'utf8' });
        
        if (result && result.trim()) {
          const foundPath = result.trim();
          console.log(`Found file by name at: ${foundPath}`);
          const content = await fsPromises.readFile(foundPath, 'utf8');
          return content;
        }
      } catch (error) {
        console.warn(`Could not find file by name in project root: ${error}`);
      }
    }
    
    // If all else fails, generate mock source code
    console.warn(`Could not find file. Generating mock source code for: ${filePath}`);
    return generateMockSourceCode(filePath);
  } catch (error) {
    console.error(`Error extracting source code for ${filePath}:`, error);
    return null;
  }
}

/**
 * Generate mock source code for preview
 */
function generateMockSourceCode(filePath: string): string {
  const fileName = path.basename(filePath);
  const componentName = fileName.replace(/\.(tsx|jsx|ts|js)$/, '');
  const isUtilFile = filePath.includes('utils') || componentName.toLowerCase().includes('util');
  const fileExtension = path.extname(filePath);
  
  // Generate different mock code based on file type
  if (isUtilFile) {
    // For utility files, generate utility function templates
    return `/**
 * ${componentName} Utility Functions
 * 
 * This is a mock source preview as the actual file could not be found.
 */

${componentName.includes('string') ? `
/**
 * Formats a string according to application rules
 */
export function formatString(input: string | null | undefined): string {
  if (input === null || input === undefined) {
    return '';
  }
  
  if (input.length < 5) {
    return input.toUpperCase();
  }
  
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

/**
 * Converts a string to title case
 */
export function titleCase(input: string): string {
  return input
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Truncates a string and adds ellipsis if longer than maxLength
 */
export function truncateWithEllipsis(input: string, maxLength: number): string {
  if (input.length <= maxLength) {
    return input;
  }
  
  return input.slice(0, maxLength) + '...';
}

/**
 * Validates a string against business rules
 */
export function validateString(input: string): boolean {
  if (!input || input.length < 2) {
    return false;
  }
  
  // Add other validation rules here
  return true;
}` : 
componentName.includes('data') ? `
/**
 * Validates data item against schema
 */
export function validateItem(item: any): boolean {
  if (!item || typeof item !== 'object') {
    return false;
  }
  
  // Check required fields
  return true;
}

/**
 * Transforms data from API format to application format
 */
export function transformItem(item: any): any {
  if (!item) {
    return null;
  }
  
  return {
    ...item,
    formatted: true,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Normalizes data for consistent processing
 */
export function normalizeItem(item: any): any {
  if (!item) {
    return {};
  }
  
  return {
    id: item.id || generateId(),
    name: (item.name || '').trim(),
    value: Number(item.value) || 0
  };
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}` : 
`
/**
 * Generic utility functions
 */
export function formatData(data: any): any {
  if (!data) {
    return null;
  }
  
  return {
    ...data,
    processed: true
  };
}

export function validateInput(input: any): boolean {
  return !!input;
}

export function calculateMetrics(data: any[]): { total: number; average: number } {
  if (!Array.isArray(data) || data.length === 0) {
    return { total: 0, average: 0 };
  }
  
  const total = data.reduce((sum, item) => sum + (Number(item) || 0), 0);
  return {
    total,
    average: total / data.length
  };
}

export default {
  formatData,
  validateInput,
  calculateMetrics
};`}`;
  } else if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) {
    // For React components
    return `import React from 'react';

/**
 * ${componentName} Component
 * 
 * This is a mock source preview as the actual file could not be found.
 */
export const ${componentName} = ({ title, children }) => {
  return (
    <div className="${componentName.toLowerCase()}-container">
      <h2>{title}</h2>
      <div className="${componentName.toLowerCase()}-content">
        {children}
      </div>
    </div>
  );
};

export default ${componentName};`;
  } else {
    // For other JavaScript/TypeScript files
    return `/**
 * ${componentName}
 * 
 * This is a mock source preview as the actual file could not be found.
 */
export const ${componentName} = () => {
  // Implementation details would be here
  return true;
};

export default ${componentName};`;
  }
}

/**
 * Find test files for a component
 */
async function findTestFiles(componentPath: string): Promise<TestFile[]> {
  const result: TestFile[] = [];
  const componentName = path.basename(componentPath).replace(/\.(tsx|ts|js|jsx)$/, '').toLowerCase();
  const PROJECT_ROOT = process.env.PROJECT_ROOT || process.cwd();
  
  console.log(`Finding test files for component: ${componentName} from path: ${componentPath}`);
  
  try {
    // First look in project directory if PROJECT_ROOT is defined
    if (PROJECT_ROOT) {
      console.log(`Using project root for test search: ${PROJECT_ROOT}`);

      // Patterns for test files
      const testFilePatterns = [
        // Standard patterns
        path.join(PROJECT_ROOT, 'src', '**', `${componentName}.test.?(ts|tsx|js|jsx)`),
        path.join(PROJECT_ROOT, 'src', '**', `${componentName}.spec.?(ts|tsx|js|jsx)`),
        path.join(PROJECT_ROOT, 'src', '**', '__tests__', `${componentName}.test.?(ts|tsx|js|jsx)`),
        path.join(PROJECT_ROOT, 'src', '**', '__tests__', `${componentName}.spec.?(ts|tsx|js|jsx)`),
        
        // Common test directories
        path.join(PROJECT_ROOT, '__tests__', '**', `${componentName}.test.?(ts|tsx|js|jsx)`),
        path.join(PROJECT_ROOT, '__tests__', '**', `${componentName}.spec.?(ts|tsx|js|jsx)`),
        path.join(PROJECT_ROOT, 'tests', '**', `${componentName}.test.?(ts|tsx|js|jsx)`),
        path.join(PROJECT_ROOT, 'tests', '**', `${componentName}.spec.?(ts|tsx|js|jsx)`),
        path.join(PROJECT_ROOT, 'test', '**', `${componentName}.test.?(ts|tsx|js|jsx)`),
        path.join(PROJECT_ROOT, 'test', '**', `${componentName}.spec.?(ts|tsx|js|jsx)`),
        
        // Case-insensitive for file name only
        path.join(PROJECT_ROOT, 'src', '**', `*${componentName}*.test.?(ts|tsx|js|jsx)`),
        path.join(PROJECT_ROOT, 'src', '**', `*${componentName}*.spec.?(ts|tsx|js|jsx)`),
        
        // Jest conventaions
        path.join(PROJECT_ROOT, '**', '__tests__', `*${componentName}*`),
        
        // Try node_modules (for demo apps)
        path.join(PROJECT_ROOT, 'node_modules', '**', `${componentName}.test.?(ts|tsx|js|jsx)`),
        
        // E2E tests
        path.join(PROJECT_ROOT, 'e2e', '**', `${componentName}.?(ts|tsx|js|jsx|feature)`)
      ];
      
      // Use glob to find test files
      for (const pattern of testFilePatterns) {
        try {
          const glob = require('glob');
          const files = glob.sync(pattern, { nocase: true });
          
          for (const file of files) {
            console.log(`Found test file: ${file}`);
            
            try {
              const content = fsSync.readFileSync(file, 'utf8');
              result.push({
                path: file,
                content
              });
            } catch (error) {
              console.error(`Error reading test file ${file}:`, error);
            }
          }
        } catch (error) {
          console.error(`Error searching for ${pattern}:`, error);
        }
      }
    }
    
    // If no test files found in project, try mock directory as fallback
    if (result.length === 0) {
      console.log(`No test files found in project. Falling back to mock directory.`);
      
      const MOCKS_DIR = path.resolve(process.cwd(), '__mocks__');
      
      const mockTestPatterns = [
        path.join(MOCKS_DIR, 'src', '**', `${componentName}.test.?(ts|tsx|js|jsx)`),
        path.join(MOCKS_DIR, 'src', '**', `${componentName}.spec.?(ts|tsx|js|jsx)`),
        path.join(MOCKS_DIR, 'src', '**', '__tests__', `${componentName}.test.?(ts|tsx|js|jsx)`),
        path.join(MOCKS_DIR, 'src', '**', '__tests__', `${componentName}.spec.?(ts|tsx|js|jsx)`),
        path.join(MOCKS_DIR, 'src', '__tests__', `${componentName}.test.?(ts|tsx|js|jsx)`),
        path.join(MOCKS_DIR, 'src', '__tests__', `${componentName}.spec.?(ts|tsx|js|jsx)`),
        path.join(MOCKS_DIR, 'src', 'utils', '__tests__', `${componentName}.test.?(ts|tsx|js|jsx)`),
        path.join(MOCKS_DIR, 'src', 'utils', '__tests__', `${componentName}.spec.?(ts|tsx|js|jsx)`)
      ];
      
      // Use glob to find mock test files
      for (const pattern of mockTestPatterns) {
        try {
          const glob = require('glob');
          const files = glob.sync(pattern, { nocase: true });
          
          for (const file of files) {
            console.log(`Found mock test file: ${file}`);
            
            try {
              const content = fsSync.readFileSync(file, 'utf8');
              result.push({
                path: file,
                content
              });
            } catch (error) {
              console.error(`Error reading mock test file ${file}:`, error);
            }
          }
        } catch (error) {
          console.error(`Error searching for ${pattern}:`, error);
        }
      }
    }
    
    // Return whatever we found, even if empty - don't throw an error
    return result;
    
  } catch (error) {
    console.error(`Error finding test files for ${componentName}:`, error);
    // Return empty array instead of throwing
    return [];
  }
}

/**
 * Generate a template test file for a React component
 */
function generateComponentTestTemplate(componentName: string, componentPath: string): string {
  return `
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ${componentName} from '${getRelativePath(componentPath)}';

describe('${componentName} Component', () => {
  it('should render correctly', () => {
    render(<${componentName} />);
    // Add assertions here
  });

  it('should handle user interactions', () => {
    render(<${componentName} />);
    // Example: fireEvent.click(screen.getByRole('button'));
    // Add assertions here
  });

  it('should update state correctly', () => {
    render(<${componentName} />);
    // Test state updates
    // Add assertions here
  });
});
`;
}

/**
 * Generate a template test file for a utility
 */
function generateUtilityTestTemplate(utilityName: string, utilityPath: string): string {
  return `
import { ${utilityName} } from '${getRelativePath(utilityPath)}';

describe('${utilityName}', () => {
  it('should work with valid inputs', () => {
    // Arrange
    const input = 'example input';
    
    // Act
    const result = ${utilityName}(input);
    
    // Assert
    expect(result).toBeDefined();
    // Add more specific assertions here
  });

  it('should handle edge cases', () => {
    // Test with edge cases
    // Add assertions here
  });

  it('should throw errors for invalid inputs', () => {
    // Test error handling
    // Add assertions here
  });
});
`;
}

/**
 * Generate a template test file for a React context
 */
function generateContextTestTemplate(contextName: string, contextPath: string): string {
  return `
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ${contextName}, ${contextName}Provider, use${contextName} } from '${getRelativePath(contextPath)}';

// Mock consumer component
const Consumer = () => {
  const context = use${contextName}();
  return (
    <div>
      <span data-testid="context-value">{JSON.stringify(context)}</span>
      <button onClick={() => context.someAction && context.someAction()}>
        Trigger Action
      </button>
    </div>
  );
};

describe('${contextName}', () => {
  it('should provide the context to consumers', () => {
    render(
      <${contextName}Provider>
        <Consumer />
      </${contextName}Provider>
    );
    
    const contextValue = screen.getByTestId('context-value');
    expect(contextValue).toBeInTheDocument();
    // Add more specific assertions based on the expected context structure
  });

  it('should update context values correctly', () => {
    render(
      <${contextName}Provider>
        <Consumer />
      </${contextName}Provider>
    );
    
    // Test context update
    // For example: fireEvent.click(screen.getByRole('button'));
    // Add assertions for updated context
  });
});
`;
}

/**
 * Generate recommended test IDs for a component
 */
function generateRecommendedTestIds(componentPath: string): string[] {
  const componentName = path.basename(componentPath).replace(/\.(tsx|jsx|ts|js)$/, '');
  
  // Convert component name to snake case for test IDs
  const snakeCase = componentName
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
  
  return [
    `root_${snakeCase}`,
    `${snakeCase}_container`,
    `${snakeCase}_title`,
    `${snakeCase}_content`,
    `${snakeCase}_button`,
  ];
}

/**
 * Get a user-friendly relative path for display
 */
function getRelativePath(filePath: string): string {
  // For mock app
  if (filePath.includes('__mocks__')) {
    return filePath.replace(/^.*\/__mocks__\//, '__mocks__/');
  }
  
  // For testApp files
  if (filePath.includes('/testApp/')) {
    return filePath.replace(/^.*\/testApp\//, 'testApp/');
  }
  
  // For project files
  const projectRelativePath = path.relative(PROJECT_ROOT, filePath);
  if (!projectRelativePath.startsWith('..')) {
    return projectRelativePath;
  }
  
  // Fallback to filename
  return path.basename(filePath);
}

/**
 * Generate the complete HTML report content
 */
function generateHTML(components: ComponentWithTests[]): string {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enhanced Coverage Report</title>
  <style>
    /* Base styles */
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; color: #333; background-color: #f9f9f9; }
    h1 { color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 0; }
    h2 { color: #3498db; margin-top: 30px; }
    h3 { color: #2c3e50; margin-bottom: 10px; }
    h4 { margin-top: 20px; margin-bottom: 10px; color: #34495e; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f2f2f2; font-weight: 600; }
    tr:hover { background-color: #f5f5f5; }
    .high { color: #27ae60; font-weight: bold; }
    .medium { color: #f39c12; font-weight: bold; }
    .low { color: #e74c3c; font-weight: bold; }
    footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #7f8c8d; font-size: 0.9em; }
    button { cursor: pointer; padding: 6px 12px; background-color: #3498db; color: white; border: none; border-radius: 4px; transition: background-color 0.3s; }
    button:hover { background-color: #2980b9; }
    pre { margin: 0; }
    code { font-family: 'Menlo', 'Monaco', 'Courier New', monospace; }
    
    /* Component details */
    .component-details { display: none; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-top: 20px; }
    .component-details.active { display: block; }
    .component-path { color: #7f8c8d; font-family: monospace; margin-bottom: 10px; word-break: break-all; }
    .component-coverage { font-size: 1.2em; margin-bottom: 20px; }
    
    /* Tabs */
    .tab-container { margin-top: 20px; }
    .tabs { display: flex; border-bottom: 1px solid #ddd; margin-bottom: 15px; flex-wrap: wrap; }
    .tab { background: none; border: none; padding: 10px 15px; font-size: 0.95em; color: #7f8c8d; position: relative; transition: all 0.3s ease; }
    .tab:hover { color: #3498db; }
    .tab.active { color: #3498db; font-weight: 600; }
    .tab.active::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 3px; background-color: #3498db; }
    
    /* Tab content */
    .detail-section { display: none; }
    .detail-section.active { display: block; animation: fadeIn 0.3s ease-in-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    
    /* Source code container */
    .code-container {
      border: 1px solid #e0e0e0;
      border-radius: 5px;
      overflow: auto;
      background-color: #fafafa;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
      max-height: 600px;
      margin: 15px 0;
    }
    
    .source-path {
      font-family: monospace;
      font-size: 0.9em;
      color: #7f8c8d;
      margin-bottom: 5px;
    }
    
    /* Code lines */
    .code-line {
      display: flex;
      border-bottom: 1px solid rgba(0,0,0,0.03);
      font-size: 13px;
      line-height: 1.5;
      white-space: pre;
    }
    
    .code-line:hover {
      background-color: rgba(0,0,0,0.02);
    }
    
    .code-line.covered {
      background-color: rgba(46, 204, 113, 0.1);
    }
    
    .code-line.covered .line-number::after {
      content: '✓';
      color: #2ecc71;
      margin-left: 3px;
    }
    
    .code-line.uncovered {
      background-color: rgba(231, 76, 60, 0.1);
    }
    
    .code-line.uncovered .line-number::after {
      content: '✗';
      color: #e74c3c;
      margin-left: 3px;
    }
    
    .scrolled-to {
      background-color: rgba(241, 196, 15, 0.3) !important;
      transition: background-color 0.5s ease-in-out;
    }
    
    .line-number {
      min-width: 50px;
      text-align: right;
      padding: 0 10px;
      color: #999;
      border-right: 1px solid #eee;
      user-select: none;
    }
    
    .line-content {
      padding: 0 10px;
      overflow-x: auto;
    }
    
    /* Test files */
    .test-file {
      margin-bottom: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 5px;
      overflow: hidden;
    }
    
    .test-file h4 {
      margin: 0;
      padding: 10px 15px;
      background-color: #f2f2f2;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .test-file-content {
      max-height: 400px;
      overflow-y: auto;
      padding: 10px 15px;
      background-color: #fafafa;
    }
    
    /* Test navigation */
    .test-nav {
      display: flex;
      flex-wrap: wrap;
      padding: 10px;
      background-color: #f5f5f5;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .test-nav-item {
      cursor: pointer;
      padding: 5px 10px;
      margin: 3px;
      background-color: #e0e0e0;
      border-radius: 3px;
      font-size: 12px;
      transition: all 0.2s ease;
    }
    
    .test-nav-item:hover {
      background-color: #3498db;
      color: white;
    }
    
    /* Test highlights */
    .highlighted-test {
      background-color: rgba(255, 235, 59, 0.2);
      border-left: 3px solid #f1c40f;
    }
    
    /* Syntax highlighting */
    .keyword { color: #0033b3; font-weight: 600; }
    .string { color: #067d17; }
    .comment { color: #8e908c; font-style: italic; }
    .method { color: #6f42c1; }
    .function { color: #e36209; }
    
    /* Recommendations */
    .recommendations {
      background-color: #f8f9fa;
      border-left: 4px solid #3498db;
      padding: 15px;
      margin: 20px 0;
      border-radius: 0 5px 5px 0;
    }
    
    .recommendations ul {
      margin-top: 10px;
      padding-left: 20px;
    }
    
    .recommendations li {
      margin-bottom: 5px;
    }
    
    /* Copy button */
    .copy-button {
      padding: 4px 8px;
      font-size: 12px;
      background-color: #f2f2f2;
      color: #333;
      border: 1px solid #ddd;
      border-radius: 3px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .copy-button:hover {
      background-color: #e0e0e0;
    }
    
    @media (max-width: 768px) {
      .tabs { flex-direction: column; }
      .tab { border-bottom: 1px solid #eee; }
      table { display: block; overflow-x: auto; }
    }
  </style>
  <script>
    // Show component details
    function showComponentDetails(index) {
      // Hide all other component details
      document.querySelectorAll('.component-details').forEach(function(el) {
        el.classList.remove('active');
      });
      
      // Show selected component details
      const componentEl = document.getElementById('component-' + index);
      if (componentEl) {
        componentEl.classList.add('active');
        
        // Hide summary and table
        const summaryEl = document.getElementById('summary');
        if (summaryEl) summaryEl.style.display = 'none';
        
        const tableEl = document.querySelector('table');
        if (tableEl) tableEl.style.display = 'none';
      } else {
        console.error('Component element with id component-' + index + ' not found');
      }
    }
    
    // Hide component details
    function hideComponentDetails(index) {
      const componentEl = document.getElementById('component-' + index);
      if (componentEl) {
        componentEl.classList.remove('active');
        
        // Show summary and table
        const summaryEl = document.getElementById('summary');
        if (summaryEl) summaryEl.style.display = 'block';
        
        const tableEl = document.querySelector('table');
        if (tableEl) tableEl.style.display = 'table';
      }
    }
    
    // Switch tabs in component details
    function switchTab(tabId, index) {
      // Deactivate all tabs in this component
      document.querySelectorAll('#component-' + index + ' .tab').forEach(function(el) {
        el.classList.remove('active');
      });
      
      // Deactivate all detail sections in this component
      document.querySelectorAll('#component-' + index + ' .detail-section').forEach(function(el) {
        el.classList.remove('active');
      });
      
      // Activate the selected tab
      const tabButton = document.querySelector('#component-' + index + ' .tab[onclick*="\\'' + tabId + '\\'"]');
      if (tabButton) {
        tabButton.classList.add('active');
      }
      
      // Activate the selected section
      const section = document.getElementById(tabId);
      if (section) {
        section.classList.add('active');
      }
    }
    
    // Copy text to clipboard
    function copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(function() { 
          alert('Copied to clipboard: ' + text); 
        })
        .catch(function(err) { 
          console.error('Error copying text: ', err); 
        });
    }
    
    // Syntax highlight code
    function applySyntaxHighlighting() {
      document.querySelectorAll('.code-container pre code').forEach(function(block) {
        if (block && block.textContent) {
          // Keywords
          block.innerHTML = block.innerHTML.replace(/\b(function|const|let|var|return|if|else|for|while|do|switch|case|break|continue|new|try|catch|finally|throw|typeof|instanceof|in|of|class|extends|super|import|export|from|as|async|await|yield|this|true|false|null|undefined)\b/g, '<span class="keyword">$1</span>');
          
          // Strings
          block.innerHTML = block.innerHTML.replace(/(['"])(.*?)(['"])/g, '<span class="string">$1$2$3</span>');
          
          // Comments
          block.innerHTML = block.innerHTML.replace(/\\/\\/(.*?)$/gm, '<span class="comment">//$1</span>');
          
          // Multi-line comments
          block.innerHTML = block.innerHTML.replace(/\\/\\*([\\s\\S]*?)\\*\\//g, '<span class="comment">/*$1*/</span>');
          
          // Functions and methods
          block.innerHTML = block.innerHTML.replace(/\\b(function)\\s+([a-zA-Z0-9_]+)/g, '<span class="keyword">$1</span> <span class="function">$2</span>');
          block.innerHTML = block.innerHTML.replace(/\\.([a-zA-Z0-9_]+)\\(/g, '.<span class="method">$1</span>(');
          
          // Testing library methods
          block.innerHTML = block.innerHTML.replace(/\b(describe|it|test|expect|beforeEach|afterEach|beforeAll|afterAll|mock|jest|render|screen|fireEvent|waitFor)\b/g, '<span class="method">$1</span>');
        }
      });
    }
    
    // Scroll to a specific test
    function scrollToTest(containerId, lineNumber) {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      const lineElement = container.querySelector('[id="line-' + lineNumber + '"]');
      if (!lineElement) return;
      
      // Scroll the element into view
      container.scrollTop = lineElement.offsetTop - container.offsetTop - 50;
      
      // Add a temporary highlight
      lineElement.classList.add('scrolled-to');
      setTimeout(function() {
        lineElement.classList.remove('scrolled-to');
      }, 2000);
    }
    
    // Call syntax highlighting when the page loads
    window.addEventListener('DOMContentLoaded', function() {
      applySyntaxHighlighting();
    });
  </script>
</head>
<body>
  <h1>Enhanced Coverage Report</h1>
  <p>Generated on ${new Date().toLocaleString()}</p>
  
  <div id="summary">
    <h2>Coverage Summary</h2>
    <p>Average component coverage: ${calculateAverageCoverage(components).toFixed(2)}%</p>
    <p>Total components analyzed: ${components.length}</p>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Component</th>
        <th>Path</th>
        <th>Coverage</th>
        <th>Tests</th>
        <th>Statements</th>
        <th>Branches</th>
        <th>Functions</th>
        <th>Lines</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      ${components.map((item, index) => {
        const coverageClass = getCoverageClass(item.coverage);
        const testCount = item.tests || item.testFiles?.length || item.correlatedTests?.length || 0;
        return `<tr>
          <td>${item.name || path.basename(item.path).replace(/\.(tsx|jsx|ts|js)$/, '')}</td>
          <td title="${item.path}">
            <a href="file://${item.path}" target="_blank" class="file-path">
              ${getRelativePath(item.path)}
            </a>
          </td>
          <td class="${coverageClass}">${(item.coverage * 100).toFixed(1)}%</td>
          <td>${testCount}</td>
          <td>${item.statements || item.metrics?.statements || 'N/A'}</td>
          <td>${item.branches || item.metrics?.branches || 'N/A'}</td>
          <td>${item.functions || item.metrics?.functions || 'N/A'}</td>
          <td>${item.lines || item.metrics?.lines || 'N/A'}</td>
          <td><button onclick="showComponentDetails(${index})">Details</button></td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>
  
  ${components.map((component, index) => generateComponentDetailTemplate(component, index)).join('')}
  
  <footer>
    <p>Generated by Coverage Venn Tool</p>
  </footer>
</body>
</html>`;

  return html;
}

/**
 * Format source code with syntax highlighting and line coverage indicators
 */
function formatSourceCode(code: string, coveredLines: number[] = [], uncoveredLines: number[] = []): string {
  const lines = code.split('\n');
  let formattedCode = '';
  
  for (let i = 0; i < lines.length; i++) {
    const lineNumber = i + 1;
    const lineContent = escapeHtml(lines[i]);
    const isCovered = coveredLines.includes(lineNumber);
    const isUncovered = uncoveredLines.includes(lineNumber);
    
    // If coverage data exists, apply highlighting
    const lineClass = coveredLines.length > 0 || uncoveredLines.length > 0 
      ? (isCovered ? 'covered' : (isUncovered ? 'uncovered' : ''))
      : '';
    
    formattedCode += `<div class="code-line ${lineClass}" id="line-${lineNumber}">
      <div class="line-number">${lineNumber}</div>
      <div class="line-content">${lineContent || ' '}</div>
    </div>`;
  }
  
  return formattedCode;
}

/**
 * Escape HTML characters to prevent XSS
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Calculate average coverage percentage across components
 */
function calculateAverageCoverage(components: ComponentWithTests[]): number {
  if (components.length === 0) return 0;
  
  const sum = components.reduce((total, component) => total + component.coverage, 0);
  return sum / components.length;
}

/**
 * Get CSS class based on coverage percentage
 */
function getCoverageClass(coverage: number): string {
  if (coverage >= 80) return 'high';
  if (coverage >= 50) return 'medium';
  return 'low';
}

/**
 * Get CSS class based on confidence level
 */
function getConfidenceClass(confidence: number): string {
  if (confidence >= 0.7) return 'high';
  if (confidence >= 0.4) return 'medium';
  return 'low';
}

/**
 * Generate component detail template
 */
function generateComponentDetailTemplate(component: ComponentWithTests, index: number): string {
  const componentName = component.name || path.basename(component.path);
  
  // Separate tests into unit tests and E2E tests
  const unitTests = (component.correlatedTests || []).filter(test => !test.isE2E);
  const e2eTests = (component.correlatedTests || []).filter(test => test.isE2E);
  
  console.log(`Component ${componentName}: ${unitTests.length} unit tests, ${e2eTests.length} E2E tests`);
  
  const testFilesTemplate = component.testFiles ? component.testFiles.map(file => `
    <div class="test-file">
      <h4>${path.basename(file.path)}</h4>
      <pre><code class="language-typescript">${escapeHtml(file.content)}</code></pre>
    </div>
  `).join('') : '';
  
  const unitTestsTemplate = unitTests.length > 0 ? `
    <div class="correlatedUnitTests">
      <h4>Correlated Unit Tests</h4>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Scenario</th>
            <th>Step</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          ${unitTests.map(test => `
            <tr>
              <td>${escapeHtml(test.feature)}</td>
              <td>${escapeHtml(test.scenario)}</td>
              <td>${escapeHtml(test.step)}</td>
              <td>${(test.confidence * 100).toFixed(1)}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : '';
  
  const e2eTestsTemplate = e2eTests.length > 0 ? `
    <div class="correlatedE2ETests">
      <h4>Correlated E2E Tests</h4>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Scenario</th>
            <th>Step</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          ${e2eTests.map(test => `
            <tr>
              <td>${escapeHtml(test.feature)}</td>
              <td>${escapeHtml(test.scenario)}</td>
              <td>${escapeHtml(test.step)}</td>
              <td>${(test.confidence * 100).toFixed(1)}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : '';
  
  const recommendationsTemplate = component.recommendedTestIds && component.recommendedTestIds.length > 0 ? `
    <div class="recommendations">
      <h4>Recommendations</h4>
      <p>Based on analysis of this component, the following tests are recommended:</p>
      <ul>
        ${component.recommendedTestIds.map(id => `<li>Create a test for element with testID: <code>${escapeHtml(id)}</code></li>`).join('')}
      </ul>
    </div>
  ` : '';
  
  return `
    <div class="component-details" id="component-${index}">
      <h3>${componentName}</h3>
      <div class="component-path">${component.path}</div>
      <div class="component-coverage">Coverage: ${(component.coverage * 100).toFixed(1)}%</div>
      
      <div class="tab-container">
        <div class="tabs">
          <button class="tab active" onclick="switchTab('source-${index}', ${index})">Source</button>
          <button class="tab" onclick="switchTab('tests-${index}', ${index})">Test Files</button>
          <button class="tab" onclick="switchTab('correlated-${index}', ${index})">Correlated Tests</button>
          <button class="tab" onclick="hideComponentDetails(${index})">&larr; Back to Summary</button>
        </div>
        
        <div id="source-${index}" class="detail-section active">
          <h3>Source Code</h3>
          <div class="source-path">${component.path}</div>
          <div class="code-container">
            ${component.sourceCode ? formatSourceCode(component.sourceCode, component.coveredLines, component.uncoveredLines) : '<p>Source code not available</p>'}
          </div>
        </div>
        
        <div id="tests-${index}" class="detail-section">
          <h3>Test Files (${component.testFiles?.length || 0})</h3>
          <div class="test-files-section">
            ${testFilesTemplate || '<p>No test files found.</p>'}
          </div>
        </div>
        
        <div id="correlated-${index}" class="detail-section">
          <h3>Related Tests (${(component.correlatedTests?.length || 0)})</h3>
          ${unitTestsTemplate}
          ${e2eTestsTemplate}
          ${recommendationsTemplate}
          ${(!unitTestsTemplate && !e2eTestsTemplate) ? '<p>No related tests found.</p>' : ''}
        </div>
      </div>
    </div>
  `;
}

// Add the findTestsInContent function definition
function findTestsInContent(content: string, componentName: string): { name: string; lineStart: number; lineEnd: number }[] {
  if (!content || !componentName) {
    return [];
  }
  
  console.log(`Looking for tests related to "${componentName}" in test file content`);
  
  const lines = content.split('\n');
  const results: { name: string; lineStart: number; lineEnd: number }[] = [];
  
  // Prepare normalized component name variants for better matching
  const compNameLower = componentName.toLowerCase();
  // Handle camelCase and PascalCase conversions
  const compNameVariants = [
    compNameLower,
    componentName,
    // Convert PascalCase to kebab-case
    compNameLower.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
    // Convert camelCase to snake_case
    compNameLower.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
  ];
  
  // Track describe blocks to handle nested tests
  const describeBlocks: { 
    name: string;
    startLine: number;
    endLine: number | null;
    matches: boolean;
  }[] = [];
  
  // First pass: identify describe blocks and their matching status
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();
    
    // Look for describe blocks
    const describeMatch = line.match(/\s*(describe)\s*\(\s*['"](.+?)['"]/);
    if (describeMatch) {
      const blockName = describeMatch[2];
      const blockNameLower = blockName.toLowerCase();
      
      // Check if this describe block matches our component
      let blockMatches = false;
      
      // Check if block name contains component name
      for (const variant of compNameVariants) {
        if (blockNameLower.includes(variant)) {
          blockMatches = true;
          console.log(`Describe block "${blockName}" matches component "${componentName}" (contains "${variant}")`);
          break;
        }
      }
      
      // Add this describe block to our tracking list
      describeBlocks.push({
        name: blockName,
        startLine: i,
        endLine: null, // Will be set later when we find the closing brace
        matches: blockMatches
      });
    }
    
    // Check for closing braces to determine describe block endings
    if (line.trim() === '}' && describeBlocks.length > 0) {
      // Find the innermost describe block without an end line
      for (let j = describeBlocks.length - 1; j >= 0; j--) {
        if (describeBlocks[j].endLine === null) {
          describeBlocks[j].endLine = i;
          break;
        }
      }
    }
  }
  
  // Set any remaining blocks to end at the end of the file
  for (let block of describeBlocks) {
    if (block.endLine === null) {
      block.endLine = lines.length - 1;
    }
  }
  
  // Second pass: find test blocks and check if they're within matching describe blocks
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();
    
    // Skip if this is a describe line (already processed)
    if (line.match(/\s*(describe)\s*\(\s*['"](.+?)['"]/)) {
      continue;
    }
    
    // Look for test or it blocks
    const testMatch = line.match(/\s*(test|it)\s*\(\s*['"](.+?)['"]/);
    if (testMatch) {
      const testType = testMatch[1]; // 'test' or 'it'
      const testName = testMatch[2];
      
      console.log(`Found test: "${testName}" (${testType}) at line ${i+1}`);
      
      // Check if this test is within a matching describe block
      let isWithinMatchingDescribe = false;
      let matchingDescribeName = '';
      
      for (const block of describeBlocks) {
        if (block.matches && i >= block.startLine && i <= block.endLine!) {
          isWithinMatchingDescribe = true;
          matchingDescribeName = block.name;
          break;
        }
      }
      
      // Check for a direct match using our variants
      let isMatch = isWithinMatchingDescribe;
      let matchReason = isWithinMatchingDescribe ? 
        `within matching describe block "${matchingDescribeName}"` : '';
      
      // If we found a match, process the test block
      if (isMatch) {
        console.log(`✓ Match found for "${componentName}": "${testName}" (${matchReason})`);
        
        // Improved method to find the end of this test block
        let blockDepth = 1;
        let endLine = i;
        let foundEndingBrace = false;
        
        for (let j = i + 1; j < lines.length; j++) {
          // Count opening and closing braces
          const openBraces = (lines[j].match(/\{/g) || []).length;
          const closeBraces = (lines[j].match(/\}/g) || []).length;
          
          blockDepth += openBraces;
          blockDepth -= closeBraces;
          
          if (blockDepth <= 0) {
            endLine = j;
            foundEndingBrace = true;
            break;
          }
        }
        
        // If we couldn't find the ending brace, use a fallback approach
        // This helps with the last test in a file
        if (!foundEndingBrace) {
          console.log(`Could not find ending brace for test "${testName}". Looking for next test or end of file.`);
          // Look for the next test as a boundary or use the end of file
          let nextTestIndex = -1;
          for (let j = i + 1; j < lines.length; j++) {
            if (lines[j].match(/\s*(test|it|describe)\s*\(\s*['"](.+?)['"]/)) {
              nextTestIndex = j - 1;
              break;
            }
          }
          
          // If we didn't find another test, use the end of the file
          if (nextTestIndex === -1) {
            nextTestIndex = lines.length - 1;
            console.log(`No more tests found. Using end of file (line ${nextTestIndex + 1}) as test boundary.`);
          } else {
            console.log(`Found next test at line ${nextTestIndex + 1}. Using previous line as test boundary.`);
          }
          
          endLine = nextTestIndex;
        }
        
        // Store results with ONE-INDEXED line numbers (not zero-indexed)
        results.push({
          name: testName,
          lineStart: i + 1, // Convert to 1-indexed line number
          lineEnd: endLine + 1 // Convert to 1-indexed line number
        });
      } else {
        console.log(`✗ No match for "${componentName}" in test: "${testName}"`);
      }
    }
  }
  
  console.log(`Found ${results.length} related tests for component "${componentName}"`);
  return results;
}

// Add the extractTestIdsFromSource function if it's not already defined
function extractTestIdsFromSource(sourceCode: string): string[] {
  const testIds: string[] = [];
  
  if (!sourceCode) {
    return testIds;
  }
  
  // Match data-testid attributes in JSX
  const testIdMatches = sourceCode.match(/data-testid=["']([^"']+)["']/g) || [];
  
  // Match testID props in React Native
  const testIDMatches = sourceCode.match(/testID=["']([^"']+)["']/g) || [];
  
  // Extract the actual IDs
  if (testIdMatches.length > 0) {
    testIdMatches.forEach(match => {
      const id = match.match(/data-testid=["']([^"']+)["']/)?.[1];
      if (id) testIds.push(id);
    });
  }
  
  if (testIDMatches.length > 0) {
    testIdMatches.forEach(match => {
      const id = match.match(/testID=["']([^"']+)["']/)?.[1];
      if (id) testIds.push(id);
    });
  }
  
  return testIds;
}

/**
 * Main function to generate the enhanced HTML report
 */
async function main(): Promise<void> {
  try {
    console.log('Starting Enhanced HTML Report Generator...');
    const PROJECT_ROOT = process.env.PROJECT_ROOT || process.cwd();
    console.log(`Using PROJECT_ROOT: ${PROJECT_ROOT}`);
    
    if (process.env.PROJECT_ROOT) {
      console.log(`PROJECT_ROOT is explicitly set in environment to: ${process.env.PROJECT_ROOT}`);
    } else {
      console.log(`PROJECT_ROOT is not set in environment, using current directory: ${process.cwd()}`);
    }
    
    // Load component coverage data
    const componentCoveragePath = COVERAGE_SOURCE === 'babel'
      ? path.resolve(COVERAGE_DIR, 'component-coverage.json')
      : COVERAGE_SOURCE === 'project'
        ? path.resolve(COVERAGE_ANALYSIS_DIR, 'project-component-coverage.json')
        : path.resolve(COVERAGE_ANALYSIS_DIR, 'mock-component-coverage.json');
    
    console.log(`Loading component coverage data from: ${componentCoveragePath}`);
    const components: ComponentWithTests[] = JSON.parse(
      await fsPromises.readFile(componentCoveragePath, 'utf8')
    );
    
    // Load test-component correlation data
    const correlationPath = COVERAGE_SOURCE === 'babel'
      ? path.resolve(COVERAGE_DIR, 'test-component-correlation.json')
      : COVERAGE_SOURCE === 'project'
        ? path.resolve(COVERAGE_ANALYSIS_DIR, 'project-test-component-correlation.json')
        : path.resolve(COVERAGE_DIR, 'test-component-correlation.json');
    
    console.log(`Loading test-component correlation data from: ${correlationPath}`);
    const correlatedComponents: ComponentWithTests[] = JSON.parse(
      await fsPromises.readFile(correlationPath, 'utf8')
    );
    
    // Create a map for quick lookup of components in the correlation data
    const correlationMap = new Map<string, ComponentWithTests>();
    for (const component of correlatedComponents) {
      correlationMap.set(component.path, component);
    }
    
    // Enhanced components with more information
    const enhancedComponents: ComponentWithTests[] = [];
    
    // Count E2E tests
    let totalE2ETests = 0;
    for (const component of correlatedComponents) {
      if (component.correlatedTests) {
        const e2eTests = component.correlatedTests.filter(test => test.isE2E);
        totalE2ETests += e2eTests.length;
      }
    }
    console.log(`Found ${totalE2ETests} E2E tests in correlation data`);
    if (totalE2ETests > 0) {
      const testExample = correlatedComponents.find(c => c.correlatedTests?.some(t => t.isE2E))?.correlatedTests?.find(t => t.isE2E);
      console.log(`E2E test example: ${JSON.stringify(testExample)}`);
    }
    
    // Process each component from coverage data
    for (const component of components) {
      console.log(`Processing component: ${path.basename(component.path, path.extname(component.path))}`);
      
      // Add any correlated tests to the component
      const correlatedComponent = correlationMap.get(component.path);
      if (correlatedComponent && correlatedComponent.correlatedTests) {
        component.correlatedTests = correlatedComponent.correlatedTests;
        
        // Count e2e tests
        const e2eTests = component.correlatedTests.filter(test => test.isE2E);
        if (e2eTests.length > 0) {
          console.log(`Component ${component.name} has ${e2eTests.length} E2E tests`);
        }
        
        // Add gap analysis if available
        if (correlatedComponent.gapAnalysis) {
          component.gapAnalysis = correlatedComponent.gapAnalysis;
        }
      }
      
      // Find test files for the component
      try {
        const testFiles = await findTestFiles(component.path);
        component.testFiles = testFiles;
      } catch (error) {
        console.warn(`Error finding test files for component ${component.name}:`, error);
        // Continue with empty test files instead of aborting
        component.testFiles = [];
      }
      
      // Extract source code
      try {
        const sourceCode = await extractSourceCode(component.path);
        if (sourceCode) {
          component.sourceCode = sourceCode;
        }
      } catch (error) {
        console.warn(`Error extracting source code for ${component.name}:`, error);
        // Continue with empty source code
        component.sourceCode = generateMockSourceCode(component.path);
      }
      
      // For each test file, try to extract the highlight worthy tests
      if (component.testFiles && component.testFiles.length > 0) {
        for (const testFile of component.testFiles) {
          testFile.highlightedTests = findTestsInContent(testFile.content, component.name);
        }
      }
      
      // Generate recommended test IDs
      component.recommendedTestIds = generateRecommendedTestIds(component.path);
      
      // Count the total number of tests for this component
      component.tests = component.testFiles?.reduce((count, file) => {
        return count + (file.highlightedTests?.length || 0);
      }, 0) || 0;
      
      enhancedComponents.push(component);
    }
    
    // Sort components by coverage (ascending)
    enhancedComponents.sort((a, b) => a.coverage - b.coverage);
    
    // Count the number of E2E tests in the enhanced components
    const enhancedE2ETests = enhancedComponents.reduce((count, component) => {
      const e2eTests = component.correlatedTests?.filter(test => test.isE2E) || [];
      return count + e2eTests.length;
    }, 0);
    console.log(`Enhanced components have ${enhancedE2ETests} E2E tests`);
    
    // Generate HTML
    console.log('Generating HTML report...');
    const html = generateHTML(enhancedComponents);
    
    // Create output directory if it doesn't exist
    const outputDir = COVERAGE_SOURCE === 'babel'
      ? path.resolve(process.cwd(), 'coverage')
      : COVERAGE_SOURCE === 'project'
        ? path.resolve(process.cwd(), 'coverage-project')
        : path.resolve(process.cwd(), 'coverage-html');
    
    await fsPromises.mkdir(outputDir, { recursive: true });
    
    // Write HTML to output file
    const outputPath = path.resolve(outputDir, 'coverage.html');
    await fsPromises.writeFile(outputPath, html);
    
    console.log(`Writing HTML report to: ${outputPath}`);
    console.log('Enhanced HTML report generated successfully!');
  } catch (error) {
    console.error('Error generating enhanced HTML report:', error);
    throw error;
  }
}

main(); 
