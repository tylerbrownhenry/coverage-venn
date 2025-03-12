import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as babel from '@babel/core';

// Create test directory
const TEST_DIR = path.resolve(__dirname, '../.instrumentation-test/try-catch-test');
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
  tryBlocks: {},
  
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
  
  // Try/Catch/Finally tracking
  trackTry(component, blockId, blockType) {
    if (!this.tryBlocks[component]) {
      this.tryBlocks[component] = {};
    }
    if (!this.tryBlocks[component][blockId]) {
      this.tryBlocks[component][blockId] = {
        type: blockType,
        hits: 0
      };
    }
    
    this.tryBlocks[component][blockId].hits++;
    return blockId;
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
    
    const tryBlockCount = Object.values(this.tryBlocks)
      .reduce((count, blocks) => count + Object.keys(blocks).length, 0);
    
    return {
      branches: branchCount,
      switches: switchCount,
      cases: caseCount,
      functions: functionCount,
      jsx: jsxCount,
      tryBlocks: tryBlockCount
    };
  },
  
  getResults() {
    return {
      branches: this.branches,
      switches: this.switches,
      cases: this.cases,
      functions: this.functions,
      jsx: this.jsx,
      tryBlocks: this.tryBlocks
    };
  }
};

// Make it global for testing
global.COVERAGE_TRACKER = COVERAGE_TRACKER;
module.exports = COVERAGE_TRACKER;
`);

// Create a wrapper module to load the tracker and then the instrumented code
const wrapperPath = path.join(TEST_DIR, 'wrapper.js');
fs.writeFileSync(wrapperPath, `
// First, load and set up the coverage tracker
const COVERAGE_TRACKER = require('./coverage-tracker');
global.COVERAGE_TRACKER = COVERAGE_TRACKER;

// Now load the instrumented code
require('./instrumented-try-catch-test');
`);

// Create test file with various try/catch/finally patterns
const testFilePath = path.join(TEST_DIR, 'try-catch-test.js');
fs.writeFileSync(testFilePath, `
// Simple try/catch
function simpleTryCatch(shouldThrow) {
  try {
    console.log("In try block");
    if (shouldThrow) {
      throw new Error("Test error");
    }
    return "Success";
  } catch (error) {
    console.log("In catch block:", error.message);
    return "Caught: " + error.message;
  }
}

// Try/catch/finally
function tryCatchFinally(shouldThrow) {
  let result = "";
  try {
    console.log("In try block with finally");
    if (shouldThrow) {
      throw new Error("Test error with finally");
    }
    result = "Success";
  } catch (error) {
    console.log("In catch block with finally:", error.message);
    result = "Caught: " + error.message;
  } finally {
    console.log("In finally block");
    result += " (finally executed)";
  }
  return result;
}

// Try/finally (no catch)
function tryFinally(shouldThrow) {
  let result = "";
  try {
    console.log("In try block with only finally");
    if (shouldThrow) {
      throw new Error("Uncaught error");
    }
    result = "Success";
  } finally {
    console.log("In finally block (no catch)");
    result += " (finally executed)";
  }
  return result;
}

// Nested try/catch blocks
function nestedTryCatch(level, shouldThrowInner, shouldThrowOuter) {
  try {
    console.log("Outer try block (level " + level + ")");
    if (shouldThrowOuter) {
      throw new Error("Outer error at level " + level);
    }
    
    try {
      console.log("Inner try block (level " + level + ")");
      if (shouldThrowInner) {
        throw new Error("Inner error at level " + level);
      }
      return "Inner success at level " + level;
    } catch (innerError) {
      console.log("Inner catch block:", innerError.message);
      return "Inner caught: " + innerError.message;
    }
  } catch (outerError) {
    console.log("Outer catch block:", outerError.message);
    return "Outer caught: " + outerError.message;
  }
}

// Try blocks that throw different types of errors
function typedErrors(errorType) {
  try {
    console.log("In try block with error type:", errorType);
    
    switch(errorType) {
      case "reference":
        nonExistentVariable.property; // ReferenceError
        break;
      case "type":
        null.toString(); // TypeError
        break;
      case "syntax":
        // We can't create a syntax error at runtime, so simulate it
        throw new SyntaxError("Simulated syntax error");
      case "range":
        throw new RangeError("Range error");
      case "none":
        return "No error thrown";
      default:
        throw new Error("Generic error");
    }
  } catch (error) {
    console.log("Caught", error.constructor.name + ":", error.message);
    return "Caught " + error.constructor.name;
  }
}

// Error propagation
function propagateError() {
  try {
    console.log("Trying to call a function that will throw");
    const result = innerErrorFunction();
    return "Should not reach here: " + result;
  } catch (error) {
    console.log("Caught propagated error:", error.message);
    return "Propagated error caught";
  }
}

function innerErrorFunction() {
  throw new Error("Error from inner function");
}

// Let's test these functions
try {
  // Import tracker
  const tracker = require('./coverage-tracker');
  
  // Run tests
  console.log("\\n1. Testing simple try/catch:");
  console.log(simpleTryCatch(false)); // No error
  console.log(simpleTryCatch(true));  // With error
  
  console.log("\\n2. Testing try/catch/finally:");
  console.log(tryCatchFinally(false)); // No error
  console.log(tryCatchFinally(true));  // With error
  
  console.log("\\n3. Testing try/finally (no catch):");
  console.log(tryFinally(false)); // No error
  try {
    console.log(tryFinally(true));  // Will throw
  } catch (e) {
    console.log("Caught outside:", e.message);
  }
  
  console.log("\\n4. Testing nested try/catch:");
  console.log(nestedTryCatch(1, false, false)); // No errors
  console.log(nestedTryCatch(2, true, false));  // Inner error
  console.log(nestedTryCatch(3, false, true));  // Outer error
  console.log(nestedTryCatch(4, true, true));   // Both errors (outer catches)
  
  console.log("\\n5. Testing different error types:");
  console.log(typedErrors("none"));      // No error
  console.log(typedErrors("type"));      // TypeError
  console.log(typedErrors("syntax"));    // SyntaxError
  console.log(typedErrors("range"));     // RangeError
  try {
    console.log(typedErrors("reference")); // ReferenceError
  } catch (e) {
    console.log("Uncaught reference error (expected)");
  }
  
  console.log("\\n6. Testing error propagation:");
  console.log(propagateError());
  
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
  console.log(`Created wrapper module at ${wrapperPath}`);

  try {
    // Run babel transform
    console.log('Instrumenting code with Babel...');
    
    const result = babel.transformFileSync(testFilePath, {
      plugins: [pluginPath],
      filename: 'try-catch-test.js',
      sourceMaps: true,
    });

    if (!result || !result.code) {
      throw new Error('Babel transform did not return code');
    }

    // Write the instrumented code to a file
    const instrumentedPath = path.join(TEST_DIR, 'instrumented-try-catch-test.js');
    fs.writeFileSync(instrumentedPath, result.code);
    console.log(`Instrumented code written to ${instrumentedPath}`);

    // Run the wrapper module which loads the coverage tracker first
    console.log('\nRunning instrumented code through wrapper...');
    execSync(`node ${wrapperPath}`, { stdio: 'inherit' });

  } catch (error) {
    console.error('Error during instrumentation or execution:', error);
  }
}

main().catch(console.error); 