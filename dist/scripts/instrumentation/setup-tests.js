#!/usr/bin/env node
"use strict";
/**
 * Setup test and mock folders with boilerplate tests for all instrumentation folders
 */
const fs = require('fs');
const path = require('path');
// Base directory for instrumentation folders
const BASE_DIR = path.resolve(__dirname);
// Get all subdirectories (except temp folders and tests/mocks folders)
const subdirs = fs.readdirSync(BASE_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() &&
    !dirent.name.startsWith('temp') &&
    !dirent.name.startsWith('__') &&
    !dirent.name.includes('node_modules'))
    .map(dirent => dirent.name);
console.log(`Found instrumentation folders: ${subdirs.join(', ')}`);
// Template for plugin test file
const PLUGIN_TEST_TEMPLATE = `
const babel = require('@babel/core');
const plugin = require('../{{fileName}}');

// Mock the babel dependencies
jest.mock('@babel/core', () => ({
  types: {
    stringLiteral: jest.fn(value => ({ type: 'StringLiteral', value })),
    numericLiteral: jest.fn(value => ({ type: 'NumericLiteral', value })),
    identifier: jest.fn(name => ({ type: 'Identifier', name })),
    memberExpression: jest.fn((object, property) => ({ type: 'MemberExpression', object, property })),
    callExpression: jest.fn((callee, args) => ({ type: 'CallExpression', callee, arguments: args })),
    expressionStatement: jest.fn(expression => ({ type: 'ExpressionStatement', expression })),
    blockStatement: jest.fn(body => ({ type: 'BlockStatement', body }))
  }
}));

jest.mock('@babel/helper-plugin-utils', () => ({
  declare: jest.fn(builder => builder)
}));

describe('{{pluginName}}', () => {
  let mockPath;
  let mockApi;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock babel API
    mockApi = {
      assertVersion: jest.fn()
    };
    
    // Mock path object with common properties
    mockPath = {
      node: {
        // Add appropriate mock node properties for the type of path
      },
      get: jest.fn().mockImplementation(prop => {
        if (prop === 'node') return mockPath.node;
        return null;
      }),
      traverse: jest.fn(),
      replaceWith: jest.fn(),
      stop: jest.fn()
    };
  });
  
  test('plugin should define a name and visitor', () => {
    const instance = plugin(mockApi);
    expect(mockApi.assertVersion).toHaveBeenCalled();
    expect(instance).toHaveProperty('name');
    expect(instance).toHaveProperty('visitor');
  });
  
  // Add specific tests for your instrumentation type...
  
});
`;
// Template for test file
const TEST_FILE_TEST_TEMPLATE = `
jest.mock('fs');
jest.mock('path');
jest.mock('child_process');
jest.mock('@babel/core');

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const babel = require('@babel/core');

// Require the file under test
const testModule = require('../{{fileName}}');

describe('{{testName}}', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock filesystem
    fs.existsSync.mockReturnValue(true);
    fs.mkdirSync.mockImplementation(() => {});
    fs.writeFileSync.mockImplementation(() => {});
    fs.readFileSync.mockImplementation(() => '');
    
    // Mock path
    path.resolve.mockImplementation((...args) => args.join('/'));
    path.join.mockImplementation((...args) => args.join('/'));
    
    // Mock babel
    babel.transformFileSync.mockReturnValue({ code: 'transformed code' });
    
    // Mock execSync
    execSync.mockImplementation(() => {});
  });
  
  test('should set up the test environment', () => {
    // Add appropriate tests for the test file
  });
  
  // Add more specific tests...
});
`;
// Template for mock file
const MOCK_FILE_TEMPLATE = `
// Mock for COVERAGE_TRACKER
const COVERAGE_TRACKER = {
  functions: {},
  branches: {},
  switches: {},
  
  trackFunctionStart: jest.fn(),
  trackFunctionEnd: jest.fn(),
  trackFunctionError: jest.fn(),
  trackBranch: jest.fn(),
  trackSwitch: jest.fn(),
  trackTryCatch: jest.fn(),
  
  // Add specific tracking functions for this instrumentation type
  
  printReport: jest.fn()
};

module.exports = COVERAGE_TRACKER;
`;
// Process each subdirectory
for (const dir of subdirs) {
    const fullDir = path.join(BASE_DIR, dir);
    // Create __tests__ directory
    const testsDir = path.join(fullDir, '__tests__');
    if (!fs.existsSync(testsDir)) {
        console.log(`Creating __tests__ directory in ${dir}`);
        fs.mkdirSync(testsDir, { recursive: true });
    }
    // Create __mocks__ directory
    const mocksDir = path.join(fullDir, '__mocks__');
    if (!fs.existsSync(mocksDir)) {
        console.log(`Creating __mocks__ directory in ${dir}`);
        fs.mkdirSync(mocksDir, { recursive: true });
    }
    // Find all JS files and create corresponding test files
    const jsFiles = fs.readdirSync(fullDir, { withFileTypes: true })
        .filter(entry => entry.isFile() &&
        (entry.name.endsWith('.js') || entry.name.endsWith('.ts')) &&
        !entry.name.includes('.template') &&
        !entry.name.startsWith('.'))
        .map(entry => entry.name);
    // Create mock file for coverage-tracker
    const mockFile = path.join(mocksDir, 'coverage-tracker.js');
    if (!fs.existsSync(mockFile)) {
        console.log(`Creating coverage-tracker mock for ${dir}`);
        fs.writeFileSync(mockFile, MOCK_FILE_TEMPLATE);
    }
    // Create test files for each JS file
    for (const jsFile of jsFiles) {
        const fileBaseName = path.basename(jsFile, path.extname(jsFile));
        const testFileName = `${fileBaseName}.test.js`;
        const testFilePath = path.join(testsDir, testFileName);
        if (!fs.existsSync(testFilePath)) {
            console.log(`Creating test file for ${jsFile}`);
            let testContent;
            // Plugin test files get plugin-specific template
            if (jsFile.includes('-plugin.js')) {
                testContent = PLUGIN_TEST_TEMPLATE
                    .replace(/\{\{fileName\}\}/g, jsFile)
                    .replace(/\{\{pluginName\}\}/g, fileBaseName);
            }
            else {
                // Regular test files
                testContent = TEST_FILE_TEST_TEMPLATE
                    .replace(/\{\{fileName\}\}/g, jsFile)
                    .replace(/\{\{testName\}\}/g, fileBaseName);
            }
            fs.writeFileSync(testFilePath, testContent);
        }
    }
}
// Add Jest configuration to package.json if it doesn't exist
const packageJsonPath = path.resolve(BASE_DIR, '..', '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
    console.log('Updating package.json with Jest configuration');
    let packageJson;
    try {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    }
    catch (error) {
        console.error('Error reading package.json:', error.message);
        packageJson = {};
    }
    if (!packageJson.jest) {
        packageJson.jest = {
            testEnvironment: 'node',
            roots: [
                '<rootDir>/scripts/instrumentation'
            ],
            testMatch: [
                '**/__tests__/**/*.test.js'
            ],
            collectCoverageFrom: [
                'scripts/instrumentation/**/*.js',
                '!**/node_modules/**',
                '!**/__tests__/**',
                '!**/__mocks__/**',
                '!**/temp*/**'
            ]
        };
    }
    if (!packageJson.scripts) {
        packageJson.scripts = {};
    }
    if (!packageJson.scripts.test) {
        packageJson.scripts.test = 'jest';
    }
    if (!packageJson.scripts['test:instrumentation']) {
        packageJson.scripts['test:instrumentation'] = 'jest scripts/instrumentation';
    }
    if (!packageJson.scripts['test:coverage']) {
        packageJson.scripts['test:coverage'] = 'jest --coverage';
    }
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}
console.log('\nTest setup completed! Added __tests__ and __mocks__ directories with boilerplate tests.');
console.log('\nNext steps:');
console.log('1. Install Jest if you haven\'t already: npm install --save-dev jest');
console.log('2. Customize the test files to fit your implementation specifics');
console.log('3. Run the tests with: npm test:instrumentation');
