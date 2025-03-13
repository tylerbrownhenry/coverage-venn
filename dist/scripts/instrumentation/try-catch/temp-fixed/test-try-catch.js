"use strict";
// Import the coverage tracker
const COVERAGE_TRACKER = require('./coverage-tracker');
// Basic try-catch
function testBasicTryCatch() {
    console.log('Testing basic try-catch...');
    try {
        console.log('In try block');
        return 'Success';
    }
    catch (error) {
        console.log('In catch block');
        return 'Error: ' + error.message;
    }
    finally {
        console.log('In finally block');
    }
}
// Try-catch with error
function testTryCatchWithError() {
    console.log('Testing try-catch with error...');
    try {
        console.log('In try block, about to throw error');
        throw new Error('Test error');
        return 'This will not execute';
    }
    catch (error) {
        console.log('In catch block, caught:', error.message);
        return 'Caught error: ' + error.message;
    }
    finally {
        console.log('In finally block');
    }
}
// Nested try-catch blocks
function testNestedTryCatch() {
    console.log('Testing nested try-catch...');
    try {
        console.log('In outer try block');
        try {
            console.log('In inner try block');
            throw new Error('Inner error');
        }
        catch (innerError) {
            console.log('In inner catch block:', innerError.message);
        }
        finally {
            console.log('In inner finally block');
        }
        return 'Outer try completed';
    }
    catch (outerError) {
        console.log('In outer catch block:', outerError.message);
        return 'Outer catch: ' + outerError.message;
    }
    finally {
        console.log('In outer finally block');
    }
}
// Run tests
console.log(testBasicTryCatch());
console.log('--------');
console.log(testTryCatchWithError());
console.log('--------');
console.log(testNestedTryCatch());
// Print coverage report
COVERAGE_TRACKER.printReport();
