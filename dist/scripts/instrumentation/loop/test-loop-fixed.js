"use strict";
/**
 * Test Loop instrumentation with the fixed plugin
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const babel = require('@babel/core');
// Set up test environment
const TEST_DIR = path.resolve(__dirname, 'temp-fixed');
const PLUGIN_PATH = path.resolve(__dirname, '..', 'fixed-coverage-plugin.js');
// Create test directory
if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
}
// Create coverage tracker file
const coverageTrackerFile = path.join(TEST_DIR, 'coverage-tracker.js');
fs.writeFileSync(coverageTrackerFile, `
// Coverage tracker for fixed plugin
const COVERAGE_TRACKER = {
  functions: {},
  branches: {},
  loops: {},
  
  trackFunctionStart(functionName, component, id) {
    const key = \`\${component}:\${id}:\${functionName}\`;
    if (!this.functions[key]) {
      this.functions[key] = { calls: 0 };
    }
    this.functions[key].calls++;
    console.log(\`Function \${functionName} (id: \${id}) in \${component} started\`);
    return true;
  },
  
  trackBranch(component, branchId, branchType, condition) {
    const key = \`\${component}:\${branchId}:\${branchType}\`;
    if (!this.branches[key]) {
      this.branches[key] = { 
        evaluations: 0,
        truthy: 0,
        falsy: 0
      };
    }
    
    this.branches[key].evaluations++;
    
    if (condition) {
      this.branches[key].truthy++;
      console.log(\`Branch \${branchType} (id: \${branchId}) in \${component} evaluated to true\`);
    } else {
      this.branches[key].falsy++;
      console.log(\`Branch \${branchType} (id: \${branchId}) in \${component} evaluated to false\`);
    }
    
    return condition;
  },
  
  trackLoop(component, loopId, ...args) {
    const key = \`\${component}:\${loopId}\`;
    
    if (!this.loops[key]) {
      this.loops[key] = {
        executions: 0
      };
    }
    
    this.loops[key].executions++;
    console.log(\`Loop (id: \${loopId}) in \${component} executed\`);
    
    return args[0]; // Return first argument for chaining
  },
  
  printReport() {
    console.log('\\nCoverage Report:');
    console.log('-----------------');
    
    console.log('\\nFunctions:');
    for (const key in this.functions) {
      const [component, id, name] = key.split(':');
      console.log(\`  \${name} in \${component}: \${this.functions[key].calls} calls\`);
    }
    
    console.log('\\nBranches:');
    for (const key in this.branches) {
      const [component, id, type] = key.split(':');
      const branch = this.branches[key];
      console.log(\`  \${type} \${id} in \${component}: \${branch.evaluations} evaluations (true: \${branch.truthy}, false: \${branch.falsy})\`);
    }
    
    console.log('\\nLoops:');
    for (const key in this.loops) {
      const [component, id] = key.split(':');
      console.log(\`  Loop \${id} in \${component}: \${this.loops[key].executions} executions\`);
    }
  }
};

// This makes the COVERAGE_TRACKER global to avoid reference issues
global.COVERAGE_TRACKER = COVERAGE_TRACKER;
module.exports = COVERAGE_TRACKER;
`);
// Create test file with Loop examples
const testFile = path.join(TEST_DIR, 'test-loop.js');
fs.writeFileSync(testFile, `
// Import the coverage tracker at the top of the file
const COVERAGE_TRACKER = require('./coverage-tracker');

// Add sample code with Loop statements here
// For example:
/* 
function testLoop() {
  // Loop code to test
}

// Run test function
testLoop();
*/

// Print coverage report
COVERAGE_TRACKER.printReport();
`);
// Before running the test, make sure the fixed plugin has Loop support
// You may need to add Loop support to the fixed plugin if not already included
// Instrument the code
console.log('Instrumenting Loop with fixed plugin...');
try {
    // Verify plugin exists
    if (!fs.existsSync(PLUGIN_PATH)) {
        console.error(`Fixed plugin not found at: ${PLUGIN_PATH}`);
        process.exit(1);
    }
    const result = babel.transformFileSync(testFile, {
        plugins: [PLUGIN_PATH],
        filename: 'test-loop.js'
    });
    if (result && result.code) {
        const instrumentedFile = path.join(TEST_DIR, 'instrumented-loop.js');
        fs.writeFileSync(instrumentedFile, result.code);
        console.log(`Instrumented code written to: ${instrumentedFile}`);
        // Run the instrumented code
        console.log('\nRunning instrumented code:');
        console.log('-------------------------------------------');
        execSync(`node ${instrumentedFile}`, { stdio: 'inherit' });
        console.log('-------------------------------------------');
        console.log('Loop instrumentation test with fixed plugin completed successfully!');
    }
    else {
        console.error('Failed to transform code with the fixed plugin');
    }
}
catch (error) {
    console.error('Error during Loop instrumentation test:', error.message);
    if (error.stack) {
        console.error(error.stack.split('\n').slice(0, 3).join('\n'));
    }
}
