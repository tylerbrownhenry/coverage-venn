/**
 * Jest Coverage Setup
 * 
 * This file is loaded by Jest before tests run and injects the
 * coverage tracker into the global scope so instrumented code
 * can access it.
 */

// Import coverage tracker
const coverageTracker = require('../trackers/coverage-tracker').default;

// Make coverage tracker available globally
global.COVERAGE_TRACKER = coverageTracker;

// Setup environment for tracking
beforeAll(() => {
  if (global.testInfo && global.testInfo.testName) {
    coverageTracker.start(global.testInfo.testName);
  } else {
    coverageTracker.start('Jest Test Run');
  }
  
  console.log('[Coverage] Initialized coverage tracker for tests');
});

// Capture coverage data after tests
afterAll(() => {
  if (coverageTracker.isActive) {
    const coverageData = coverageTracker.stop();
    
    // Log summary of coverage data
    const componentCount = Object.keys(coverageData.components).length;
    console.log(`[Coverage] Collected data for ${componentCount} components`);
    
    // Store coverage data in a location where it can be accessed
    if (global.__BABEL_COVERAGE_DATA__) {
      global.__BABEL_COVERAGE_DATA__ = coverageData;
    }
    
    // Convert to Istanbul format for integration with Jest's coverage reports
    if (global.__coverage__) {
      const istanbulCoverage = coverageTracker.toIstanbulFormat();
      
      // Merge with existing Istanbul coverage data
      Object.assign(global.__coverage__, istanbulCoverage);
    }
  }
}); 