"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom");
// Mock environment variables
process.env.COVERAGE_TRACKING = 'true';
process.env.TEST_CONTEXT = 'jest';
// Global test utilities
global.mockComponent = (name) => ({
    name,
    timestamp: Date.now()
});
