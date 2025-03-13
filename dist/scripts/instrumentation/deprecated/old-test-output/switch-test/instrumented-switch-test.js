"use strict";
// Test function with switch statement
function testSwitch(value) {
    COVERAGE_TRACKER.trackFunctionStart("SwitchTest", "testSwitch", 0);
    try {
        const _switchValue = value;
        COVERAGE_TRACKER.trackSwitch("SwitchTest", 1, _switchValue);
        switch (_switchValue) {
            case 1:
                COVERAGE_TRACKER.trackCase("SwitchTest", 1, 2, _switchValue === 1);
                console.log("One");
                break;
            case 2:
                COVERAGE_TRACKER.trackCase("SwitchTest", 1, 3, _switchValue === 2);
                console.log("Two");
                break;
            case 3:
                COVERAGE_TRACKER.trackCase("SwitchTest", 1, 4, _switchValue === 3);
                console.log("Three");
                break;
            default:
                COVERAGE_TRACKER.trackCase("SwitchTest", 1, 5, true);
                console.log("Unknown");
        }
        COVERAGE_TRACKER.trackFunctionEnd("SwitchTest", "testSwitch", 0);
    }
    catch (error) {
        COVERAGE_TRACKER.trackFunctionError("SwitchTest", "testSwitch", 0);
        throw error;
    }
}
// Test switch with fallthrough
function testFallthrough(value) {
    COVERAGE_TRACKER.trackFunctionStart("SwitchTest", "testFallthrough", 6);
    try {
        const _switchValue2 = value;
        COVERAGE_TRACKER.trackSwitch("SwitchTest", 7, _switchValue2);
        switch (_switchValue2) {
            case 'a':
                COVERAGE_TRACKER.trackCase("SwitchTest", 7, 8, _switchValue2 === 'a');
                console.log("A");
            // Fallthrough
            case 'b':
                COVERAGE_TRACKER.trackCase("SwitchTest", 7, 9, _switchValue2 === 'b');
                console.log("B");
                break;
            case 'c':
            case 'd':
                COVERAGE_TRACKER.trackCase("SwitchTest", 7, 11, _switchValue2 === 'd');
                console.log("C or D");
                break;
            default:
                COVERAGE_TRACKER.trackCase("SwitchTest", 7, 12, true);
                console.log("Other letter");
        }
        COVERAGE_TRACKER.trackFunctionEnd("SwitchTest", "testFallthrough", 6);
    }
    catch (error) {
        COVERAGE_TRACKER.trackFunctionError("SwitchTest", "testFallthrough", 6);
        throw error;
    }
}
// Test switch with return
function testSwitchReturn(value) {
    COVERAGE_TRACKER.trackFunctionStart("SwitchTest", "testSwitchReturn", 13);
    try {
        const _switchValue3 = value;
        COVERAGE_TRACKER.trackSwitch("SwitchTest", 14, _switchValue3);
        switch (_switchValue3) {
            case "success":
                COVERAGE_TRACKER.trackCase("SwitchTest", 14, 15, _switchValue3 === "success");
                return "Operation successful";
            case "failure":
                COVERAGE_TRACKER.trackCase("SwitchTest", 14, 16, _switchValue3 === "failure");
                return "Operation failed";
            case "pending":
                COVERAGE_TRACKER.trackCase("SwitchTest", 14, 17, _switchValue3 === "pending");
                return "Operation pending";
            default:
                COVERAGE_TRACKER.trackCase("SwitchTest", 14, 18, true);
                return "Unknown status";
        }
        COVERAGE_TRACKER.trackFunctionEnd("SwitchTest", "testSwitchReturn", 13);
    }
    catch (error) {
        COVERAGE_TRACKER.trackFunctionError("SwitchTest", "testSwitchReturn", 13);
        throw error;
    }
}
// Test switch with complex expression
function testComplexSwitch(a, b) {
    COVERAGE_TRACKER.trackFunctionStart("SwitchTest", "testComplexSwitch", 19);
    try {
        const _switchValue4 = a * b + Math.floor(a / b);
        COVERAGE_TRACKER.trackSwitch("SwitchTest", 20, _switchValue4);
        switch (_switchValue4) {
            case 0:
                COVERAGE_TRACKER.trackCase("SwitchTest", 20, 21, _switchValue4 === 0);
                return "Zero";
            case 1:
            case 2:
                COVERAGE_TRACKER.trackCase("SwitchTest", 20, 23, _switchValue4 === 2);
                return "Small";
            case 3:
            case 4:
            case 5:
                COVERAGE_TRACKER.trackCase("SwitchTest", 20, 26, _switchValue4 === 5);
                return "Medium";
            default:
                COVERAGE_TRACKER.trackCase("SwitchTest", 20, 27, true);
                return "Large";
        }
        COVERAGE_TRACKER.trackFunctionEnd("SwitchTest", "testComplexSwitch", 19);
    }
    catch (error) {
        COVERAGE_TRACKER.trackFunctionError("SwitchTest", "testComplexSwitch", 19);
        throw error;
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
    console.dir(tracker.getResults(), {
        depth: null
    });
}
catch (error) {
    console.error("Test execution error:", error);
}
