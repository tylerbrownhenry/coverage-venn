"use strict";
/**
 * Jest configuration for instrumented testing.
 *
 * This configuration:
 * 1. Uses our custom Jest environment with coverage tracking
 * 2. Sets up Babel to use our instrumentation plugin
 * 3. Preserves all other settings from the main Jest config
 */
const path = require('path');
const fs = require('fs');
const baseConfig = require('../../../jest.config.js');
// Get the project root directory
const projectRoot = path.resolve(__dirname, '../../..');
// Check if jest-junit is installed
const jestJunitInstalled = fs.existsSync(path.join(projectRoot, 'node_modules/jest-junit'));
// Create a copy of the base config to modify
const config = { ...baseConfig };
// Use our custom environment
config.testEnvironment = path.resolve(__dirname, './coverage-jest-environment.js');
// Fix the setupFilesAfterEnv paths to use absolute paths
if (config.setupFilesAfterEnv) {
    config.setupFilesAfterEnv = config.setupFilesAfterEnv.map(setupFile => {
        if (setupFile === '<rootDir>/jest.setup.js') {
            return path.resolve(projectRoot, 'jest.setup.js');
        }
        return setupFile;
    });
}
// Update roots to include the __tests__ directory at the project root
config.roots = [...(config.roots || []), '<rootDir>/__tests__'];
// Update testMatch to include tests in the project root __tests__ directory
config.testMatch = [
    ...(config.testMatch || []),
    "<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}"
];
// Use our Babel configuration
config.transform = {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
            configFile: path.resolve(__dirname, './babel.config.js')
        }]
};
// Store coverage data in a separate directory to avoid conflicts
config.coverageDirectory = 'coverage-instrumentation';
// Add reporters
config.reporters = ['default'];
// Add JUnit reporter if installed
if (jestJunitInstalled) {
    config.reporters.push([
        'jest-junit',
        {
            outputDirectory: 'coverage-instrumentation',
            outputName: 'junit.xml'
        }
    ]);
}
// Set coverage thresholds (can be adjusted as needed)
config.coverageThreshold = {
    global: {
        branches: 50,
        functions: 60,
        lines: 70,
        statements: 70
    }
};
// Global setup and teardown hooks
config.globalSetup = path.resolve(__dirname, './global-setup.js');
config.globalTeardown = path.resolve(__dirname, './global-teardown.js');
// Export the updated config
module.exports = config;
