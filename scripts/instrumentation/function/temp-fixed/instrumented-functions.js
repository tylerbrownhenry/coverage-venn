// Import the coverage tracker at the top of the file
const COVERAGE_TRACKER = require('./coverage-tracker');

// Basic function declaration
function add(a, b) {
  COVERAGE_TRACKER.trackFunctionStart("add", "TestFile", 0);
  return a + b;
}

// Function with conditional logic
function checkValue(value) {
  COVERAGE_TRACKER.trackFunctionStart("checkValue", "TestFile", 1);
  if (COVERAGE_TRACKER.trackBranch("TestFile", 0, "if", value > 10)) {
    return "Greater than 10";
  } else {
    return "10 or less";
  }
}

// Nested functions
function outer(x) {
  COVERAGE_TRACKER.trackFunctionStart("outer", "TestFile", 2);
  function inner(y) {
    COVERAGE_TRACKER.trackFunctionStart("inner", "TestFile", 3);
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