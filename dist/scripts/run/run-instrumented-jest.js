#!/usr/bin/env node
"use strict";
/**
 * Script to run Jest with instrumentation enabled.
 *
 * This script sets the necessary environment variables and runs Jest with
 * our custom configuration to enable instrumentation.
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
// Get the project root
const projectRoot = path.resolve(__dirname, '..');
// Path to local Jest
const jestBin = path.resolve(projectRoot, 'node_modules/.bin/jest');
// Verify Jest exists
if (!fs.existsSync(jestBin)) {
    console.error(`Jest binary not found at: ${jestBin}`);
    console.error('Make sure you have run npm install');
    process.exit(1);
}
// Create a temporary plugin file with instrumentation
const tempPluginPath = path.resolve(projectRoot, '.temp-plugin.js');
const tempPlugin = `
/**
 * Instrumentation plugin for code coverage.
 */
module.exports = function(api) {
  const t = api.types;
  let branchIDCounter = 0;
  
  function getComponentName(filename) {
    if (!filename) return '';
    
    // Extract component name from filename
    const parts = filename.split('/');
    const file = parts[parts.length - 1];
    const name = file.split('.')[0];
    
    // Convert to PascalCase if it's not already
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  
  function isPartOfInstrumentation(path) {
    // Check if this is part of our instrumentation code
    return path.findParent(parent => 
      parent.isCallExpression() && 
      parent.node.callee && 
      t.isMemberExpression(parent.node.callee) && 
      t.isIdentifier(parent.node.callee.object) &&
      parent.node.callee.object.name === 'COVERAGE_TRACKER'
    );
  }
  
  return {
    name: "coverage-instrumentation-plugin",
    
    visitor: {
      // Instrument if statements
      IfStatement(path, state) {
        // Skip if already instrumented or inside node_modules
        if (path.node._coverageInstrumented || 
            (state.filename && state.filename.includes('node_modules'))) {
          return;
        }
        
        // Skip if it's part of our instrumentation
        if (isPartOfInstrumentation(path)) {
          return;
        }
        
        try {
          const componentName = getComponentName(state.filename);
          const branchId = branchIDCounter++;
          
          // Create the tracking call
          const trackingCall = t.callExpression(
            t.memberExpression(
              t.identifier('COVERAGE_TRACKER'),
              t.identifier('trackBranch')
            ),
            [
              t.stringLiteral(componentName),
              t.numericLiteral(branchId),
              t.stringLiteral('if'),
              path.node.test
            ]
          );
          
          // Replace the test with the tracking call
          path.node.test = trackingCall;
          
          // Mark as instrumented
          path.node._coverageInstrumented = true;
        } catch (error) {
          console.error('Error instrumenting if statement:', error);
        }
      }
    }
  };
};
`;
fs.writeFileSync(tempPluginPath, tempPlugin);
// Create a temporary setup file
const tempSetupPath = path.resolve(projectRoot, '.temp-jest-setup.js');
const tempSetup = `
// Initialize the coverage tracker globally with a very simple implementation
global.COVERAGE_TRACKER = {
  // Super simple tracking function that just returns the condition
  trackBranch: (component, branchId, type, condition) => condition
};

// Log that instrumentation is enabled
console.log('Coverage instrumentation enabled');
`;
fs.writeFileSync(tempSetupPath, tempSetup);
// Create a temporary configuration file
const tempConfigPath = path.resolve(projectRoot, '.temp-jest-config.js');
const tempConfig = `
module.exports = {
  rootDir: '${projectRoot.replace(/\\/g, '\\\\')}',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '${tempSetupPath.replace(/\\/g, '\\\\')}',
    '${path.resolve(projectRoot, 'jest.setup.js').replace(/\\/g, '\\\\')}'
  ],
  transform: {
    '^.+\\\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-react',
        '@babel/preset-typescript'
      ],
      plugins: [
        '${tempPluginPath.replace(/\\/g, '\\\\')}'
      ]
    }]
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}",
    "<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/__mocks__/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/__mocks__/src/**/*.{spec,test}.{js,jsx,ts,tsx}"
  ],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "__mocks__/src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.*",
    "!src/**/*.test.*",
    "!src/**/*.spec.*",
    "!src/**/__tests__/**/*.*",
    "!__mocks__/src/**/*.d.ts",
    "!__mocks__/src/**/*.stories.*",
    "!__mocks__/src/**/*.test.*",
    "!__mocks__/src/**/*.spec.*",
    "!__mocks__/src/**/__tests__/**/*.*"
  ],
  coverageDirectory: 'coverage-instrumentation',
  verbose: true
};
`;
fs.writeFileSync(tempConfigPath, tempConfig);
// Parse command line arguments
const args = process.argv.slice(2);
const testPathPattern = args.filter(arg => !arg.startsWith('-')).join(' ');
const jestArgs = args.filter(arg => arg.startsWith('-'));
// Add our custom config
jestArgs.push('--config', tempConfigPath);
// Set environment variables
const env = {
    ...process.env,
    COVERAGE_INSTRUMENTATION: 'true',
    NODE_ENV: 'test'
};
console.log('=== Running Jest with Instrumentation ===');
console.log('Project root:', projectRoot);
console.log('Using temporary plugin:', tempPluginPath);
console.log('Using temporary config:', tempConfigPath);
console.log('Using temporary setup:', tempSetupPath);
if (testPathPattern) {
    console.log('Test pattern:', testPathPattern);
}
// Run Jest with the project directory as the working directory
try {
    const jest = spawn(jestBin, [...jestArgs, testPathPattern].filter(Boolean), {
        env,
        stdio: 'inherit',
        cwd: projectRoot
    });
    jest.on('close', code => {
        process.exit(code);
    });
}
catch (error) {
    console.error('Error running Jest:', error);
    process.exit(1);
}
finally {
    // Note: We don't clean up the temporary files here because they're needed
    // during the test run. They'll be cleaned up on the next run.
}
