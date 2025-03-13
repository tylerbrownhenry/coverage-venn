"use strict";
/**
 * Enhanced HTML Report Generator
 *
 * This script generates a full-featured HTML report of component coverage analysis
 * that includes source code viewing, test coverage visualization, test file viewing,
 * and test ID recommendations.
 */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fsPromises = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const fsSync = __importStar(require("fs"));
const util_1 = require("util");
const glob_1 = __importDefault(require("glob"));
// Convert callback-based glob to promise-based
const globPromise = (0, util_1.promisify)(glob_1.default);
// Path constants
const PROJECT_ROOT = process.env.PROJECT_ROOT || process.cwd();
console.log(`Using PROJECT_ROOT: ${PROJECT_ROOT}`);
// For debugging environment variables
if (process.env.PROJECT_ROOT) {
    console.log('PROJECT_ROOT is explicitly set in environment to:', process.env.PROJECT_ROOT);
}
else {
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
async function extractSourceCode(filePath, linesToHighlight) {
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
            }
            catch (error) {
                console.warn(`Could not read project file at ${filePath}. Will try alternative paths.`);
            }
        }
        // Try to read the file directly first
        try {
            const content = await fsPromises.readFile(filePath, 'utf8');
            console.log(`Found source file at: ${filePath}`);
            return content;
        }
        catch (error) {
            // File doesn't exist at the provided path
            console.warn(`Could not read file at ${filePath}. Trying alternative paths...`);
        }
        // If the original path didn't work, try looking for the file in the project root
        if (process.env.PROJECT_ROOT) {
            const fileName = path.basename(filePath);
            // First try direct path mapping from __mocks__ to PROJECT_ROOT
            if (filePath.includes('__mocks__/src/')) {
                const projectPath = filePath.replace(/__mocks__\/src\//, `${process.env.PROJECT_ROOT}/src/`);
                try {
                    const content = await fsPromises.readFile(projectPath, 'utf8');
                    console.log(`Found source file at alternative path: ${projectPath}`);
                    return content;
                }
                catch (error) {
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
            }
            catch (error) {
                console.warn(`Could not find file by name in project root: ${error}`);
            }
        }
        // If all else fails, generate mock source code
        console.warn(`Could not find file. Generating mock source code for: ${filePath}`);
        return generateMockSourceCode(filePath);
    }
    catch (error) {
        console.error(`Error extracting source code for ${filePath}:`, error);
        return null;
    }
}
/**
 * Generate mock source code for preview
 */
function generateMockSourceCode(filePath) {
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
    }
    else if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) {
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
    }
    else {
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
async function findTestFiles(componentPath) {
    const result = [];
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
                        }
                        catch (error) {
                            console.error(`Error reading test file ${file}:`, error);
                        }
                    }
                }
                catch (error) {
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
                        }
                        catch (error) {
                            console.error(`Error reading mock test file ${file}:`, error);
                        }
                    }
                }
                catch (error) {
                    console.error(`Error searching for ${pattern}:`, error);
                }
            }
        }
        // Return whatever we found, even if empty - don't throw an error
        return result;
    }
    catch (error) {
        console.error(`Error finding test files for ${componentName}:`, error);
        // Return empty array instead of throwing
        return [];
    }
}
/**
 * Generate a template test file for a React component
 */
function generateComponentTestTemplate(componentName, componentPath) {
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
function generateUtilityTestTemplate(utilityName, utilityPath) {
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
function generateContextTestTemplate(contextName, contextPath) {
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
function generateRecommendedTestIds(componentPath) {
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
function getRelativePath(filePath) {
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
function generateHTML(components) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enhanced Coverage Report</title>
  <style>
    /* Base styles */
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      background-color: #f8f9fa;
      color: #333;
    }
    
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
      max-height: 600px;
      overflow: auto;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: #f5f5f5;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 14px;
      line-height: 1.4;
      position: relative;
    }
    
    /* Line styles */
    .code-line {
      display: flex;
      width: 100%;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    
    .line-number {
      width: 40px;
      text-align: right;
      padding-right: 10px;
      color: #999;
      border-right: 1px solid #ddd;
      background-color: #f0f0f0;
      user-select: none;
    }
    
    .line-content {
      padding-left: 10px;
      white-space: pre;
      overflow: visible;
      flex-grow: 1;
    }
    
    /* Test file styles */
    .test-file {
      margin-bottom: 20px;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .test-file h4 {
      margin: 0;
      padding: 10px;
      background-color: #f0f0f0;
      border-bottom: 1px solid #ddd;
    }
    
    .test-file .source-path {
      padding: 5px 10px;
      font-size: 12px;
      color: #666;
      background-color: #f8f8f8;
      border-bottom: 1px solid #ddd;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    /* Syntax highlighting colors */
    .keyword {
      color: #0066cc;
      font-weight: bold;
    }
    
    .string {
      color: #008800;
    }
    
    .comment {
      color: #888888;
      font-style: italic;
    }
    
    .function {
      color: #9900cc;
    }
    
    .method {
      color: #0066aa;
    }
    
    .test-method {
      color: #cc6600;
      font-weight: bold;
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
    
    /* Scrolled-to highlight */
    .scrolled-to {
      background-color: rgba(52, 152, 219, 0.3) !important;
      border-left: 3px solid #3498db !important;
      animation: highlight-pulse 2s ease-in-out;
    }
    
    @keyframes highlight-pulse {
      0% { background-color: rgba(52, 152, 219, 0.5); }
      50% { background-color: rgba(52, 152, 219, 0.3); }
      100% { background-color: rgba(52, 152, 219, 0.1); }
    }
    
    /* Test name indicator */
    .test-name-indicator {
      position: absolute;
      right: 10px;
      background-color: #f1c40f;
      color: #333;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 11px;
      font-weight: bold;
      z-index: 10;
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    /* No highlighted tests message */
    .no-highlighted-tests {
      padding: 10px;
      color: #666;
      font-style: italic;
      background-color: #f8f8f8;
      border-bottom: 1px solid #ddd;
      font-size: 12px;
    }
    
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
    
    // Scroll to a specific test
    function scrollToTest(containerId, lineNumber) {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      const lineElement = container.querySelector('[id="line-' + lineNumber + '"]');
      if (!lineElement) return;
      
      // Scroll the element into view
      container.scrollTop = lineElement.offsetTop - container.offsetTop - 50;
      
      // Add a highlight class that will be removed after a few seconds
      lineElement.classList.add('scrolled-to');
      setTimeout(() => {
        lineElement.classList.remove('scrolled-to');
      }, 3000);
    }
    
    // Scroll to a correlated test in the test files
    function scrollToCorrelatedTest(feature, scenario, step) {
      // First, switch to the tests tab
      const componentId = document.querySelector('.detail-section.active').id.split('-')[1];
      switchTab('tests-' + componentId, componentId);
      
      // Look for a matching test in all test files
      const testFiles = document.querySelectorAll('#tests-' + componentId + ' .test-file');
      
      // Try to find a test that matches the feature, scenario, and step
      let found = false;
      testFiles.forEach(file => {
        const testNavItems = file.querySelectorAll('.test-nav-item');
        testNavItems.forEach(item => {
          const testName = item.textContent;
          if (testName.includes(feature) || testName.includes(scenario) || testName.includes(step)) {
            // Simulate a click on this test nav item
            item.click();
            found = true;
            return;
          }
        });
        if (found) return;
      });
      
      // If no exact match found, just switch to the tests tab
      if (!found) {
        console.log('No matching test found for: ' + feature + ' - ' + scenario + ' - ' + step);
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
      // Target both source code and test file code containers
      document.querySelectorAll('.code-container .line-content, .test-file .line-content').forEach(function(block) {
        if (block && block.textContent) {
      // Keywords
          block.innerHTML = block.innerHTML.replace(/\\b(function|const|let|var|return|if|else|for|while|do|switch|case|break|continue|new|try|catch|finally|throw|typeof|instanceof|in|of|class|extends|super|import|export|from|as|async|await|yield|this|true|false|null|undefined)\\b/g, '<span class="keyword">$1</span>');
      
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
          block.innerHTML = block.innerHTML.replace(/\\b(describe|it|test|expect|beforeEach|afterEach|beforeAll|afterAll|mock|jest|render|screen|fireEvent|waitFor)\\b/g, '<span class="test-method">$1</span>');
        }
      });
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
function formatSourceCode(code, coveredLines = [], uncoveredLines = [], highlightedTests = []) {
    const lines = code.split('\n');
    let formattedCode = '';
    // Add a message if no tests are highlighted but we expected some
    if (highlightedTests.length === 0 && (code.includes('test(') || code.includes('it(') || code.includes('describe('))) {
        formattedCode += `<div class="no-highlighted-tests">No specific tests highlighted. This file may contain general tests or utilities.</div>`;
    }
    for (let i = 0; i < lines.length; i++) {
        const lineNumber = i + 1;
        const lineContent = escapeHtml(lines[i]);
        const isCovered = coveredLines.includes(lineNumber);
        const isUncovered = uncoveredLines.includes(lineNumber);
        // If coverage data exists, apply highlighting
        const lineClass = coveredLines.length > 0 || uncoveredLines.length > 0
            ? (isCovered ? 'covered' : (isUncovered ? 'uncovered' : ''))
            : '';
        // Check if this line is the start of a test
        const testHighlight = highlightedTests.find(t => t.lineStart === lineNumber);
        const isTestStart = testHighlight !== undefined;
        // Add highlighted-test class if it's a test line
        const isTestLine = highlightedTests.some(t => lineNumber >= t.lineStart && lineNumber <= t.lineEnd);
        const testClass = isTestLine ? 'highlighted-test' : '';
        // Add test name indicator if it's the start of a test
        const testNameIndicator = isTestStart
            ? `<div class="test-name-indicator">${escapeHtml(testHighlight.name)}</div>`
            : '';
        formattedCode += `<div class="code-line ${lineClass} ${testClass}" id="line-${lineNumber}">
      <div class="line-number">${lineNumber}</div>
      <div class="line-content">${testNameIndicator}${lineContent || ' '}</div>
    </div>`;
    }
    return formattedCode;
}
/**
 * Escape HTML characters to prevent XSS
 */
function escapeHtml(str) {
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
function calculateAverageCoverage(components) {
    if (components.length === 0)
        return 0;
    const sum = components.reduce((total, component) => total + component.coverage, 0);
    return sum / components.length;
}
/**
 * Get CSS class based on coverage percentage
 */
function getCoverageClass(coverage) {
    if (coverage >= 80)
        return 'high';
    if (coverage >= 50)
        return 'medium';
    return 'low';
}
/**
 * Get CSS class based on confidence level
 */
function getConfidenceClass(confidence) {
    if (confidence >= 0.7)
        return 'high';
    if (confidence >= 0.4)
        return 'medium';
    return 'low';
}
/**
 * Generate component detail template
 */
function generateComponentDetailTemplate(component, index) {
    const componentName = component.name || path.basename(component.path);
    // Separate tests into unit tests and E2E tests
    const unitTests = (component.correlatedTests || []).filter(test => !test.isE2E);
    const e2eTests = (component.correlatedTests || []).filter(test => test.isE2E);
    console.log(`Component ${componentName}: ${unitTests.length} unit tests, ${e2eTests.length} E2E tests`);
    const testFilesTemplate = component.testFiles ? component.testFiles.map((file, fileIndex) => {
        // Extract tests for navigation
        const testHighlights = file.highlightedTests || findTestsInContent(file.content, componentName);
        // Create test navigation bar if tests are found
        const testNavBar = testHighlights.length > 0 ? `
      <div class="test-nav">
        ${testHighlights.map(test => `<span class="test-nav-item" onclick="scrollToTest('test-file-${index}-${fileIndex}', ${test.lineStart})">${escapeHtml(test.name)}</span>`).join('')}
      </div>
    ` : '';
        return `
    <div class="test-file">
      <h4>${path.basename(file.path)}</h4>
      <div class="source-path">${file.path}</div>
      ${testNavBar}
      <div class="code-container" id="test-file-${index}-${fileIndex}">
        ${formatSourceCode(file.content, [], [], testHighlights)}
      </div>
    </div>
    `;
    }).join('') : '';
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
          ${component.correlatedTests && component.correlatedTests.length > 0 ? `
          <div class="test-nav">
            ${component.correlatedTests.map(test => `<span class="test-nav-item" onclick="scrollToCorrelatedTest('${test.feature}', '${test.scenario}', '${test.step}')">${escapeHtml(test.feature)} - ${escapeHtml(test.scenario)}</span>`).join('')}
          </div>
          ` : ''}
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
function findTestsInContent(content, componentName) {
    if (!content || !componentName) {
        return [];
    }
    console.log(`Looking for tests related to "${componentName}" in test file content`);
    const lines = content.split('\n');
    const results = [];
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
    const describeBlocks = [];
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
            console.log(`Found test: "${testName}" (${testType}) at line ${i + 1}`);
            // Check if this test is within a matching describe block
            let isWithinMatchingDescribe = false;
            let matchingDescribeName = '';
            for (const block of describeBlocks) {
                if (block.matches && i >= block.startLine && i <= block.endLine) {
                    isWithinMatchingDescribe = true;
                    matchingDescribeName = block.name;
                    break;
                }
            }
            // Check for a direct match using our variants
            let isMatch = isWithinMatchingDescribe;
            let matchReason = isWithinMatchingDescribe ?
                `within matching describe block "${matchingDescribeName}"` : '';
            if (!isMatch) {
                // Check if the test name itself contains the component name
                for (const variant of compNameVariants) {
                    if (testName.toLowerCase().includes(variant)) {
                        isMatch = true;
                        matchReason = `test name "${testName}" contains "${variant}"`;
                        break;
                    }
                }
            }
            // If this test matches our component, add it to results
            if (isMatch) {
                console.log(`Test "${testName}" matches component "${componentName}": ${matchReason}`);
                // Find the end of this test block
                let endLine = i;
                let braceCount = 0;
                let foundOpeningBrace = false;
                // Scan forward to find the closing brace of this test
                for (let j = i; j < lines.length; j++) {
                    const currentLine = lines[j];
                    // Count opening braces
                    const openBraces = (currentLine.match(/\{/g) || []).length;
                    braceCount += openBraces;
                    if (openBraces > 0) {
                        foundOpeningBrace = true;
                    }
                    // Count closing braces
                    const closeBraces = (currentLine.match(/\}/g) || []).length;
                    braceCount -= closeBraces;
                    // If we've found the opening brace and the braces are balanced, we've found the end
                    if (foundOpeningBrace && braceCount === 0) {
                        endLine = j;
                        break;
                    }
                }
                results.push({
                    name: testName,
                    lineStart: i + 1, // 1-indexed line numbers
                    lineEnd: endLine + 1 // 1-indexed line numbers
                });
            }
        }
    }
    return results;
}
