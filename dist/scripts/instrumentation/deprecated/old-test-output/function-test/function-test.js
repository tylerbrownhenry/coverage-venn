"use strict";
// Import the coverage tracker
const COVERAGE_TRACKER = require('./coverage-tracker');
/**
 * This is a test file for function instrumentation
 * with various function patterns.
 */
// 1. Regular function declaration
function regularFunction(a, b) {
    return a + b;
}
// 2. Named function with complex body
function complexFunction(items) {
    const result = [];
    for (let i = 0; i < items.length; i++) {
        if (items[i] > 0) {
            result.push(items[i] * 2);
        }
        else {
            result.push(0);
        }
    }
    return result;
}
// 3. Function with error handling
function errorProneFunction(value) {
    try {
        if (typeof value !== 'number') {
            throw new Error('Value must be a number');
        }
        return value * 2;
    }
    catch (e) {
        console.error('Error in errorProneFunction:', e.message);
        return 0;
    }
}
// 4. Arrow function with expression body
const arrowExpressionFn = (x) => x * x;
// 5. Arrow function with block body
const arrowBlockFn = (x) => {
    const y = x * 2;
    return y + 1;
};
// 6. Arrow function in object
const obj = {
    name: 'Test Object',
    getValue: (x) => x * 3,
    calculate: function (a, b) {
        return a * b;
    }
};
// 7. Async function
async function asyncFunction(value) {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 10));
    return value * 3;
}
// 8. Immediately invoked function expression (IIFE)
const result = (function (x) {
    return x + 5;
})(10);
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
            const outcomes = Object.entries(data.outcomes)
                .map(([outcome, count]) => `path ${outcome}: ${count} time(s)`)
                .join(', ');
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
});
console.log('\n=== Testing IIFE Result ===');
console.log(result);
