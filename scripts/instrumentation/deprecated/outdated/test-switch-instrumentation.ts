import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as babel from '@babel/core';

// Create test directory
const TEST_DIR = path.resolve(__dirname, '../.instrumentation-test/switch-test');
if (!fs.existsSync(TEST_DIR)) {
  fs.mkdirSync(TEST_DIR, { recursive: true });
}

// Create a coverage tracker module
const coverageTrackerPath = path.join(TEST_DIR, 'coverage-tracker.js');
fs.writeFileSync(coverageTrackerPath, `
const COVERAGE_TRACKER = {
  branches: {},
  switches: {},
  cases: {},
  functions: {},
  jsx: {},
  
  // Branch tracking
  trackBranch(component, branchId, type, condition) {
    if (!this.branches[component]) {
      this.branches[component] = {};
    }
    if (!this.branches[component][branchId]) {
      this.branches[component][branchId] = { 
        type, 
        hits: 0,
        conditions: []
      };
    }
    
    this.branches[component][branchId].hits++;
    this.branches[component][branchId].conditions.push(condition);
    
    return condition;
  },
  
  // Switch statement tracking
  trackSwitch(component, switchId, value) {
    if (!this.switches[component]) {
      this.switches[component] = {};
    }
    if (!this.switches[component][switchId]) {
      this.switches[component][switchId] = {
        hits: 0,
        values: []
      };
    }
    
    this.switches[component][switchId].hits++;
    this.switches[component][switchId].values.push(value);
    
    return value;
  },
  
  // Case tracking
  trackCase(component, switchId, caseId, isMatch) {
    if (!this.cases[component]) {
      this.cases[component] = {};
    }
    if (!this.cases[component][caseId]) {
      this.cases[component][caseId] = {
        switchId,
        hits: 0,
        matches: 0
      };
    }
    
    this.cases[component][caseId].hits++;
    if (isMatch) {
      this.cases[component][caseId].matches++;
    }
    
    return isMatch;
  },
  
  // Function tracking
  trackFunctionStart(component, functionId, name) {
    if (!this.functions[component]) {
      this.functions[component] = {};
    }
    if (!this.functions[component][functionId]) {
      this.functions[component][functionId] = {
        name,
        calls: 0,
        errors: 0
      };
    }
    
    this.functions[component][functionId].calls++;
    return functionId;
  },
  
  trackFunctionEnd(component, functionId) {
    // Just for tracking successful completion
    return functionId;
  },
  
  trackFunctionError(component, functionId, error) {
    if (this.functions[component] && this.functions[component][functionId]) {
      this.functions[component][functionId].errors++;
    }
    throw error; // Re-throw to preserve original behavior
  },
  
  // JSX tracking
  trackJSX(component, jsxId, elementType) {
    if (!this.jsx[component]) {
      this.jsx[component] = {};
    }
    if (!this.jsx[component][jsxId]) {
      this.jsx[component][jsxId] = {
        elementType,
        renders: 0
      };
    }
    
    this.jsx[component][jsxId].renders++;
  },
  
  getSummary() {
    const branchCount = Object.values(this.branches)
      .reduce((count, branches) => count + Object.keys(branches).length, 0);
    
    const switchCount = Object.values(this.switches)
      .reduce((count, switches) => count + Object.keys(switches).length, 0);
    
    const caseCount = Object.values(this.cases)
      .reduce((count, cases) => count + Object.keys(cases).length, 0);
    
    const functionCount = Object.values(this.functions)
      .reduce((count, funcs) => count + Object.keys(funcs).length, 0);
    
    const jsxCount = Object.values(this.jsx)
      .reduce((count, elements) => count + Object.keys(elements).length, 0);
    
    return {
      branches: branchCount,
      switches: switchCount,
      cases: caseCount,
      functions: functionCount,
      jsx: jsxCount
    };
  },
  
  getResults() {
    return {
      branches: this.branches,
      switches: this.switches,
      cases: this.cases,
      functions: this.functions,
      jsx: this.jsx
    };
  }
};

// Make it global for testing
global.COVERAGE_TRACKER = COVERAGE_TRACKER;
module.exports = COVERAGE_TRACKER;
`);

// Create test file with various switch cases
const testFilePath = path.join(TEST_DIR, 'switch-test.js');
fs.writeFileSync(testFilePath, `
// Test function with switch statement
function testSwitch(value) {
  switch(value) {
    case 1:
      console.log("One");
      break;
    case 2:
      console.log("Two");
      break;
    case 3:
      console.log("Three");
      break;
    default:
      console.log("Unknown");
  }
}

// Test switch with fallthrough
function testFallthrough(value) {
  switch(value) {
    case 'a':
      console.log("A");
      // Fallthrough
    case 'b':
      console.log("B");
      break;
    case 'c':
    case 'd':
      console.log("C or D");
      break;
    default:
      console.log("Other letter");
  }
}

// Test switch with return
function testSwitchReturn(value) {
  switch(value) {
    case "success":
      return "Operation successful";
    case "failure":
      return "Operation failed";
    case "pending":
      return "Operation pending";
    default:
      return "Unknown status";
  }
}

// Test switch with complex expression
function testComplexSwitch(a, b) {
  switch(a * b + Math.floor(a / b)) {
    case 0:
      return "Zero";
    case 1:
    case 2:
      return "Small";
    case 3:
    case 4:
    case 5:
      return "Medium";
    default:
      return "Large";
  }
}

// Let's test these functions
try {
  // Import tracker
  const tracker = require('./coverage-tracker');
  
  // Run tests
  console.log("Testing basic switch:");
  testSwitch(1);
  testSwitch(2);
  testSwitch(4); // default case
  
  console.log("\\nTesting fallthrough:");
  testFallthrough('a');
  testFallthrough('c');
  testFallthrough('x'); // default case
  
  console.log("\\nTesting switch with return:");
  console.log(testSwitchReturn("success"));
  console.log(testSwitchReturn("unknown")); // default case
  
  console.log("\\nTesting complex switch:");
  console.log(testComplexSwitch(2, 1)); // 2*1 + Math.floor(2/1) = 2 + 2 = 4
  console.log(testComplexSwitch(5, 2)); // 5*2 + Math.floor(5/2) = 10 + 2 = 12 (default)
  
  // Report results
  console.log("\\nCoverage Summary:");
  console.log(tracker.getSummary());
  
  console.log("\\nDetailed Results:");
  console.dir(tracker.getResults(), { depth: null });
} catch (error) {
  console.error("Test execution error:", error);
}
`);

// Path to the plugin
const pluginPath = path.resolve(__dirname, '../src/instrumentation/babel/coverage-instrumentation-plugin.js');

async function main() {
  console.log(`Created test directory at ${TEST_DIR}`);
  console.log(`Created coverage tracker at ${coverageTrackerPath}`);
  console.log(`Created test file at ${testFilePath}`);

  try {
    // Run babel transform
    console.log('Instrumenting code with Babel...');
    
    const result = babel.transformFileSync(testFilePath, {
      plugins: [pluginPath],
      filename: 'switch-test.js',
      sourceMaps: true,
    });

    if (!result || !result.code) {
      throw new Error('Babel transform did not return code');
    }

    // Write the instrumented code to a file
    const instrumentedPath = path.join(TEST_DIR, 'instrumented-switch-test.js');
    fs.writeFileSync(instrumentedPath, result.code);
    console.log(`Instrumented code written to ${instrumentedPath}`);

    // Run the instrumented code
    console.log('\nRunning instrumented code...');
    execSync(`node ${instrumentedPath}`, { stdio: 'inherit' });

  } catch (error) {
    console.error('Error during instrumentation or execution:', error);
  }
}

main().catch(console.error); 