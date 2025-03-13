"use strict";
// Mock module for tests
module.exports = {
    // Mock methods/properties that tests will use
    transformCode: jest.fn().mockReturnValue({
        code: "const mockTransformedCode = true;",
        success: true
    }),
    runTests: jest.fn().mockReturnValue({
        passed: true,
        coverage: { branches: 100, functions: 100 }
    }),
    testFunction: jest.fn().mockReturnValue(true),
    instrumentationDetails: {
        name: "MOCK_INSTRUMENTATION",
        version: "1.0.0-test"
    }
};
// Don't allow any process.exit calls from the mock
process.exit = jest.fn();
