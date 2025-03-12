#!/usr/bin/env node

/**
 * A simplified script to test if our instrumentation configuration works.
 * This script runs a single test file to verify the configuration.
 * 
 * This creates a simplified, standalone configuration to avoid issues with
 * global setup and teardown.
 */

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the project root
const projectRoot = path.resolve(__dirname, '..');

// Path to the test file
const testFile = path.resolve(projectRoot, '__tests__/utils/string-utils.test.js');

// Verify the test file exists
if (!fs.existsSync(testFile)) {
  console.error(`Test file not found: ${testFile}`);
  process.exit(1);
}

// Path to local Jest
const jestBin = path.resolve(projectRoot, 'node_modules/.bin/jest');

// Verify Jest exists
if (!fs.existsSync(jestBin)) {
  console.error(`Jest binary not found at: ${jestBin}`);
  console.error('Make sure you have run npm install');
  process.exit(1);
}

// Create a temporary plugin file with only branch instrumentation
const tempPluginPath = path.resolve(projectRoot, '.temp-plugin.js');
const tempPlugin = `
/**
 * Simplified instrumentation plugin that only tracks branches
 * to avoid recursion issues.
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
    name: "simplified-instrumentation-plugin",
    
    visitor: {
      // Only instrument if statements for simplicity
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
// Initialize the coverage tracker globally with minimal implementation
global.COVERAGE_TRACKER = {
  // Only implement branch tracking for simplicity
  trackBranch: (component, branchId, type, condition) => {
    console.log(\`Branch: \${component}.\${branchId} \${type} \${condition}\`);
    return condition;
  }
};
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
    "**/__tests__/**/*.{js,jsx,ts,tsx}",
  ],
  verbose: true
};
`;

fs.writeFileSync(tempConfigPath, tempConfig);

// Set environment variables
const env = {
  ...process.env,
  COVERAGE_INSTRUMENTATION: 'true',
  NODE_ENV: 'test'
};

console.log('=== Testing Instrumentation Configuration ===');
console.log('Project root:', projectRoot);
console.log('Test file:', testFile);
console.log('Using temporary plugin:', tempPluginPath);
console.log('Using temporary config:', tempConfigPath);
console.log('Using temporary setup:', tempSetupPath);

// Run Jest with the minimal config
const args = [
  testFile,
  '--config', tempConfigPath,
  '--no-cache'
];

console.log(`Running: ${jestBin} ${args.join(' ')}`);

try {
  // Use spawnSync for simpler error handling
  const result = spawnSync(jestBin, args, {
    env,
    stdio: 'inherit',
    cwd: projectRoot
  });

  if (result.error) {
    console.error('Error running Jest:', result.error);
    process.exit(1);
  }

  process.exit(result.status);
} finally {
  // Clean up temporary files
  if (fs.existsSync(tempConfigPath)) {
    fs.unlinkSync(tempConfigPath);
  }
  if (fs.existsSync(tempSetupPath)) {
    fs.unlinkSync(tempSetupPath);
  }
  if (fs.existsSync(tempPluginPath)) {
    fs.unlinkSync(tempPluginPath);
  }
} 