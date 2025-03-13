"use strict";
// Test function with switch statement
function testSwitch(value) {
    switch (value) {
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
    switch (value) {
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
    switch (value) {
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
    switch (a * b + Math.floor(a / b)) {
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
    console.log("\nTesting fallthrough:");
    testFallthrough('a');
    testFallthrough('c');
    testFallthrough('x'); // default case
    console.log("\nTesting switch with return:");
    console.log(testSwitchReturn("success"));
    console.log(testSwitchReturn("unknown")); // default case
    console.log("\nTesting complex switch:");
    console.log(testComplexSwitch(2, 1)); // 2*1 + Math.floor(2/1) = 2 + 2 = 4
    console.log(testComplexSwitch(5, 2)); // 5*2 + Math.floor(5/2) = 10 + 2 = 12 (default)
    // Report results
    console.log("\nCoverage Summary:");
    console.log(tracker.getSummary());
    console.log("\nDetailed Results:");
    console.dir(tracker.getResults(), { depth: null });
}
catch (error) {
    console.error("Test execution error:", error);
}
