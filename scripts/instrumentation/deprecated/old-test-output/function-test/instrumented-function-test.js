// Import the coverage tracker
const COVERAGE_TRACKER = require('./coverage-tracker');

/**
 * This is a test file for function instrumentation
 * with various function patterns.
 */

// 1. Regular function declaration
function regularFunction(a, b) {
  COVERAGE_TRACKER.trackFunctionStart("FunctionTest", "regularFunction", 0);
  try {
    COVERAGE_TRACKER.trackTry("FunctionTest", 1, "try");
    return a + b;
    COVERAGE_TRACKER.trackFunctionEnd("FunctionTest", "regularFunction", 0);
  } catch (error) {
    COVERAGE_TRACKER.trackTry("FunctionTest", 2, "catch");
    COVERAGE_TRACKER.trackFunctionError("FunctionTest", "regularFunction", 0);
    throw error;
  }
}

// 2. Named function with complex body
function complexFunction(items) {
  COVERAGE_TRACKER.trackFunctionStart("FunctionTest", "complexFunction", 3);
  try {
    COVERAGE_TRACKER.trackTry("FunctionTest", 4, "try");
    const result = [];
    for (let i = 0; i < items.length; i++) {
      COVERAGE_TRACKER.trackBranch("FunctionTest", 6, "if", (COVERAGE_TRACKER.trackBranch("FunctionTest", 7, "ternary", items[i] > 0 ? 0 : 1), items[i] > 0 ? 0 : 1));
      if (items[i] > 0) {
        result.push(items[i] * 2);
      } else {
        result.push(0);
      }
    }
    return result;
    COVERAGE_TRACKER.trackFunctionEnd("FunctionTest", "complexFunction", 3);
  } catch (error) {
    COVERAGE_TRACKER.trackTry("FunctionTest", 5, "catch");
    COVERAGE_TRACKER.trackFunctionError("FunctionTest", "complexFunction", 3);
    throw error;
  }
}

// 3. Function with error handling
function errorProneFunction(value) {
  COVERAGE_TRACKER.trackFunctionStart("FunctionTest", "errorProneFunction", 8);
  try {
    COVERAGE_TRACKER.trackTry("FunctionTest", 9, "try");
    try {
      COVERAGE_TRACKER.trackTry("FunctionTest", 11, "try");
      COVERAGE_TRACKER.trackBranch("FunctionTest", 13, "if", (COVERAGE_TRACKER.trackBranch("FunctionTest", 14, "ternary", typeof value !== 'number' ? 0 : 1), typeof value !== 'number' ? 0 : 1));
      if (typeof value !== 'number') {
        throw new Error('Value must be a number');
      }
      return value * 2;
    } catch (e) {
      COVERAGE_TRACKER.trackTry("FunctionTest", 12, "catch");
      console.error('Error in errorProneFunction:', e.message);
      return 0;
    }
    COVERAGE_TRACKER.trackFunctionEnd("FunctionTest", "errorProneFunction", 8);
  } catch (error) {
    COVERAGE_TRACKER.trackTry("FunctionTest", 10, "catch");
    COVERAGE_TRACKER.trackFunctionError("FunctionTest", "errorProneFunction", 8);
    throw error;
  }
}

// 4. Arrow function with expression body
const arrowExpressionFn = x => {
  COVERAGE_TRACKER.trackFunctionStart("FunctionTest", "arrowExpressionFn", 15);
  try {
    const _result = x * x;
    COVERAGE_TRACKER.trackFunctionEnd("FunctionTest", "arrowExpressionFn", 15);
    return _result;
  } catch (error) {
    COVERAGE_TRACKER.trackFunctionError("FunctionTest", "arrowExpressionFn", 15);
    throw error;
  }
};

// 5. Arrow function with block body
const arrowBlockFn = x => {
  COVERAGE_TRACKER.trackFunctionStart("FunctionTest", "arrowBlockFn", 16);
  try {
    const y = x * 2;
    return y + 1;
    COVERAGE_TRACKER.trackFunctionEnd("FunctionTest", "arrowBlockFn", 16);
  } catch (error) {
    COVERAGE_TRACKER.trackFunctionError("FunctionTest", "arrowBlockFn", 16);
    throw error;
  }
};

// 6. Arrow function in object
const obj = {
  name: 'Test Object',
  getValue: x => {
    COVERAGE_TRACKER.trackFunctionStart("FunctionTest", "getValue", 17);
    try {
      const _result2 = x * 3;
      COVERAGE_TRACKER.trackFunctionEnd("FunctionTest", "getValue", 17);
      return _result2;
    } catch (error) {
      COVERAGE_TRACKER.trackFunctionError("FunctionTest", "getValue", 17);
      throw error;
    }
  },
  calculate: function (a, b) {
    return a * b;
  }
};

// 7. Async function
async function asyncFunction(value) {
  COVERAGE_TRACKER.trackFunctionStart("FunctionTest", "asyncFunction", 18);
  try {
    COVERAGE_TRACKER.trackTry("FunctionTest", 19, "try");
    // Simulate async operation
    await new Promise(resolve => {
      COVERAGE_TRACKER.trackFunctionStart("FunctionTest", "anonymous", 21);
      try {
        const _result3 = setTimeout(resolve, 10);
        COVERAGE_TRACKER.trackFunctionEnd("FunctionTest", "anonymous", 21);
        return _result3;
      } catch (error) {
        COVERAGE_TRACKER.trackFunctionError("FunctionTest", "anonymous", 21);
        throw error;
      }
    });
    return value * 3;
    COVERAGE_TRACKER.trackFunctionEnd("FunctionTest", "asyncFunction", 18);
  } catch (error) {
    COVERAGE_TRACKER.trackTry("FunctionTest", 20, "catch");
    COVERAGE_TRACKER.trackFunctionError("FunctionTest", "asyncFunction", 18);
    throw error;
  }
}

// 8. Immediately invoked function expression (IIFE)
const result = function (x) {
  return x + 5;
}(10);

// Test functions with different arguments
console.log('=== Testing Regular Function ===');
console.log(regularFunction(5, 3));
console.log('\n=== Testing Complex Function ===');
console.log(complexFunction([1, -2, 3, 0, 5]));
console.log('\n=== Testing Error Prone Function ===');
console.log(errorProneFunction(10));
console.log(errorProneFunction('not a number')); // This should trigger the error handler

console.log('\n=== Testing Arrow Functions ===');
console.log(arrowExpressionFn(4));
console.log(arrowBlockFn(5));
console.log('\n=== Testing Object Methods ===');
console.log(obj.getValue(3));
console.log(obj.calculate(4, 5));
console.log('\n=== Testing Async Function ===');
// For simplicity, we'll use a promise handler for the async function
asyncFunction(7).then(result => {
  COVERAGE_TRACKER.trackFunctionStart("FunctionTest", "anonymous", 22);
  try {
    console.log(result);

    // Output the coverage report after all tests have completed
    console.log('\n=== Generating Coverage Report ===');
    const coverageReport = COVERAGE_TRACKER.getCoverageReport();

    // Summary statistics
    const jsxElementCount = Object.keys(coverageReport.jsxElements).length;
    const branchCount = Object.keys(coverageReport.branches).length;
    const functionCount = Object.keys(coverageReport.functions).length;

    // Analyze the report
    console.log('\nInstrumentation Results:');

    // JSX elements tracked
    if (jsxElementCount > 0) {
      console.log('\nJSX Elements Tracked:');
      Object.entries(coverageReport.jsxElements).forEach(([key, data]) => {
        console.log(`  - ${key}: rendered ${data.count} time(s)`);
      });
    }

    // Branches tracked
    if (branchCount > 0) {
      console.log('\nBranches Tracked:');
      Object.entries(coverageReport.branches).forEach(([key, data]) => {
        const outcomes = Object.entries(data.outcomes).map(([outcome, count]) => `path ${outcome}: ${count} time(s)`).join(', ');
        console.log(`  - ${key}: executed ${data.count} time(s) [${outcomes}]`);
      });
    }

    // Functions tracked
    if (functionCount > 0) {
      console.log('\nFunctions Tracked:');
      Object.entries(coverageReport.functions).forEach(([key, data]) => {
        console.log(`  - ${key}: started ${data.count} time(s), completed ${data.completed} time(s), errors ${data.errors} time(s)`);
      });
    }
    console.log(`\nCoverage Summary:
- JSX Elements Tracked: ${jsxElementCount}
- Branches Tracked: ${branchCount}
- Functions Tracked: ${functionCount}
`);
    COVERAGE_TRACKER.trackFunctionEnd("FunctionTest", "anonymous", 22);
  } catch (error) {
    COVERAGE_TRACKER.trackFunctionError("FunctionTest", "anonymous", 22);
    throw error;
  }
});
console.log('\n=== Testing IIFE Result ===');
console.log(result);