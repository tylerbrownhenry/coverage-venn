"use strict";
// Import the coverage tracker
const COVERAGE_TRACKER = require('./coverage-tracker');
// This file will be instrumented by our plugin
function TestComponent(props) {
    COVERAGE_TRACKER.trackBranch("InstrumentationTest", 0, "if", props.condition ? 0 : 1);
    // If statement
    if (props.condition) {
        return "Condition is true";
    }
    // Ternary expression
    const result = (COVERAGE_TRACKER.trackBranch("InstrumentationTest", 1, "ternary", props.value > 10 ? 0 : 1), props.value > 10 ? "Greater than 10" : "Less than or equal to 10");
    // Logical expression
    const showExtra = (COVERAGE_TRACKER.trackBranch("InstrumentationTest", 2, "logical", props.showDetails ? 0 : 1), props.showDetails && "Extra details");
    return result;
}
// Test the component
console.log(TestComponent({
    condition: true
}));
console.log(TestComponent({
    condition: false,
    value: 15,
    showDetails: true
}));
console.log(TestComponent({
    condition: false,
    value: 5,
    showDetails: false
}));
