// Import React testing library
require('@testing-library/jest-dom');

// Mock environment variables
process.env.COVERAGE_TRACKING = 'true';
process.env.TEST_CONTEXT = 'jest';

// Global test utilities
global.mockComponent = (name) => ({
  name,
  timestamp: Date.now()
});

// Configure testing library
Object.defineProperty(global, 'MutationObserver', {
  writable: true,
  value: class {
    constructor(callback) {}
    disconnect() {}
    observe(element, initObject) {}
  }
});

// Mock for Istanbul coverage to ensure it captures all files
if (process.env.COVERAGE_TRACKING === 'true') {
  console.log('Coverage tracking is enabled for tests');
  
  // Force coverage collection for untested files
  jest.retryTimes(0);
  jest.setTimeout(30000);
} 