"use strict";
/**
 * Test function instrumentation with the fixed plugin
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
  
  trackFunctionStart(functionName, component, id) {
    const key = \`\${component}:\${id}:\${functionName}\`;
    if (!this.functions[key]) {
      this.functions[key] = { calls: 0 };
    }
    this.functions[key].calls++;
    console.log(\`Function \${functionName} (id: \${id}) in \${component} started\`);
    return true;
  },
  
  trackFunctionEnd(functionName, component, id) {
    console.log(\`Function \${functionName} (id: \${id}) in \${component} completed\`);
    return true;
  },
  
  trackFunctionError(functionName, component, id) {
    console.log(\`Function \${functionName} (id: \${id}) in \${component} errored\`);
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
  
  getReport() {
    return {
      functions: this.functions,
      branches: this.branches
    };
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
  }
};

// This makes the COVERAGE_TRACKER global to avoid reference issues
global.COVERAGE_TRACKER = COVERAGE_TRACKER;
module.exports = COVERAGE_TRACKER;
`);
// Create test file with various function patterns
const testFunctionsFile = path.join(TEST_DIR, 'test-functions.js');
fs.writeFileSync(testFunctionsFile, `
// Import the coverage tracker at the top of the file
const COVERAGE_TRACKER = require('./coverage-tracker');

// Basic function declaration
function add(a, b) {
  return a + b;
}

// Function with conditional logic
function checkValue(value) {
  if (value > 10) {
    return "Greater than 10";
  } else {
    return "10 or less";
  }
}

// Nested functions
function outer(x) {
  function inner(y) {
    return y * 2;
  }
  return inner(x) + 5;
}

// Test calls
console.log('Testing function instrumentation:');
console.log('add(3, 4) =', add(3, 4));
console.log('checkValue(15) =', checkValue(15));
console.log('checkValue(5) =', checkValue(5));
console.log('outer(3) =', outer(3));

// Print coverage report
COVERAGE_TRACKER.printReport();
`);
// Instrument the code
console.log('Instrumenting functions with fixed plugin...');
try {
    // Verify plugin exists
    if (!fs.existsSync(PLUGIN_PATH)) {
        console.error(`Fixed plugin not found at: ${PLUGIN_PATH}`);
        process.exit(1);
    }
    const result = babel.transformFileSync(testFunctionsFile, {
        plugins: [PLUGIN_PATH],
        filename: 'test-functions.js'
    });
    if (result && result.code) {
        const instrumentedFile = path.join(TEST_DIR, 'instrumented-functions.js');
        fs.writeFileSync(instrumentedFile, result.code);
        console.log(`Instrumented code written to: ${instrumentedFile}`);
        // Run the instrumented code
        console.log('\nRunning instrumented code:');
        console.log('-------------------------------------------');
        execSync(`node ${instrumentedFile}`, { stdio: 'inherit' });
        console.log('-------------------------------------------');
        console.log('Function instrumentation test completed successfully!');
    }
    else {
        console.error('Failed to transform code with the fixed plugin');
    }
}
catch (error) {
    console.error('Error during function instrumentation test:', error.message);
    if (error.stack) {
        console.error(error.stack.split('\n').slice(0, 3).join('\n'));
    }
}
