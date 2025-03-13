"use strict";
/**
 * Jest setup file for instrumentation tests
 */
// Increase timeout for all tests
jest.setTimeout(30000);
// Mock console methods to avoid cluttering test output
const originalConsole = { ...console };
beforeAll(() => {
    // Mock process.exit to prevent tests from terminating
    process.exit = jest.fn();
    // Mock console methods
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
    console.info = jest.fn();
});
afterAll(() => {
    // Restore console methods
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
    console.info = originalConsole.info;
});
// Helper to clear all mocks between tests
afterEach(() => {
    jest.clearAllMocks();
});
