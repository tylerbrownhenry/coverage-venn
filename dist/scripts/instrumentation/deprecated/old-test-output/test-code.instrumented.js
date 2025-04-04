"use strict";
// Global variable for tracking
global.COVERAGE_TRACKER = {
    trackBranch: function (component, id, type, outcome) {
        console.log(`Branch ${id} in ${component} (${type}) took path ${outcome}`);
    },
    trackFunctionStart: function (component, name, id) {
        console.log(`Function ${name} (${id}) in ${component} started`);
    },
    trackFunctionEnd: function (component, name, id) {
        console.log(`Function ${name} (${id}) in ${component} ended`);
    },
    trackFunctionError: function (component, name, id) {
        console.log(`Function ${name} (${id}) in ${component} threw error`);
    },
    trackJSXRender: function (component, id, type) {
        console.log(`JSX ${type} (${id}) in ${component} rendered`);
    }
};
// Utility function to track execution (for testing short-circuit)
function track(name, value) {
    console.log(`Function ${name} executed with value ${value}`);
    return value;
}
// Simple function with branches
function test(value) {
    COVERAGE_TRACKER.trackBranch("TestCode", 0, "if", value > 10 ? 0 : 1);
    if (value > 10) {
        return "Greater than 10";
    }
    else {
        return "Less than or equal to 10";
    }
}
// Function with ternary expressions
function formatValue(value) {
    // Simple ternary
    return COVERAGE_TRACKER.trackBranch("TestCode", 1, "ternary", value ? 0 : 1), value ? value.toString() : "Empty";
}
// Function with nested ternary expressions
function getCategory(age) {
    return COVERAGE_TRACKER.trackBranch("TestCode", 2, "ternary", age < 13 ? 0 : 1), age < 13 ? "Child" : age < 20 ? "Teenager" : "Adult";
}
// Function with ternary in variable assignment
function classify(score) {
    const result = (COVERAGE_TRACKER.trackBranch("TestCode", 3, "ternary", score > 70 ? 0 : 1), score > 70 ? "Pass" : "Fail");
    return result;
}
// Function with mixed conditions
function evaluateData(a, b, c) {
    COVERAGE_TRACKER.trackBranch("TestCode", 4, "if", a > b ? 0 : 1);
    // If statement
    if (a > b) {
        return "A is bigger";
    }
    // Ternary expression
    return COVERAGE_TRACKER.trackBranch("TestCode", 5, "ternary", c ? 0 : 1), c ? "C is true" : "C is false";
}
// Function with logical AND (&&)
function conditionalAnd(a, b) {
    // Simple logical AND
    return COVERAGE_TRACKER.trackBranch("TestCode", 6, "ternary", a && b ? 0 : 1), a && b ? "Both true" : "At least one false";
}
// Function with logical OR (||)
function conditionalOr(a, b) {
    // Simple logical OR
    return COVERAGE_TRACKER.trackBranch("TestCode", 7, "ternary", a || b ? 0 : 1), a || b ? "At least one true" : "Both false";
}
// Function with short-circuit evaluation
function shortCircuit(a, b) {
    // Short-circuit AND
    return COVERAGE_TRACKER.trackBranch("TestCode", 8, "ternary", track("first", a) && track("second", b) ? 0 : 1), track("first", a) && track("second", b) ? "Both executed" : "Short-circuited";
}
// Function with nested logical expressions
function complexLogical(a, b, c) {
    // Nested logical expressions
    return COVERAGE_TRACKER.trackBranch("TestCode", 9, "ternary", a && b || c ? 0 : 1), a && b || c ? "Complex true" : "Complex false";
}
// Function with JSX-like conditional rendering pattern
function renderConditional(condition, element) {
    // Simulates React's condition && <Component /> pattern
    return COVERAGE_TRACKER.trackBranch("TestCode", 10, "logical", condition ? 0 : 1), condition && element;
}
// Call functions to test
console.log("=== If Statement Tests ===");
console.log(test(5));
console.log(test(15));
console.log("\n=== Simple Ternary Tests ===");
console.log(formatValue(null));
console.log(formatValue(42));
console.log("\n=== Nested Ternary Tests ===");
console.log(getCategory(10));
console.log(getCategory(16));
console.log(getCategory(25));
console.log("\n=== Ternary in Assignment ===");
console.log(classify(80));
console.log(classify(50));
console.log("\n=== Mixed Condition Tests ===");
console.log(evaluateData(10, 5, true));
console.log(evaluateData(5, 10, false));
console.log("\n=== Logical AND Tests ===");
console.log(conditionalAnd(true, true));
console.log(conditionalAnd(true, false));
console.log(conditionalAnd(false, true));
console.log("\n=== Logical OR Tests ===");
console.log(conditionalOr(true, false));
console.log(conditionalOr(false, true));
console.log(conditionalOr(false, false));
console.log("\n=== Short-Circuit Tests ===");
console.log(shortCircuit(true, true));
console.log(shortCircuit(false, true)); // second shouldn't execute
console.log("\n=== Complex Logical Tests ===");
console.log(complexLogical(true, true, false));
console.log(complexLogical(false, false, true));
console.log(complexLogical(false, false, false));
console.log("\n=== Conditional Rendering Pattern ===");
console.log(renderConditional(true, "Element1"));
console.log(renderConditional(false, "Element2")); // shouldn't render
