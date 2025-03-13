"use strict";
/**
 * Global setup script that runs before all tests.
 *
 * This script:
 * 1. Sets up the coverage instrumentation
 * 2. Creates necessary directories
 * 3. Reports that instrumentation is enabled
 */
const fs = require('fs');
const path = require('path');
module.exports = async function () {
    // Get the project root directory
    const projectRoot = process.cwd();
    console.log(`Project root: ${projectRoot}`);
    // Ensure the coverage output directory exists
    const coverageDir = path.resolve(projectRoot, 'coverage-instrumentation');
    if (!fs.existsSync(coverageDir)) {
        fs.mkdirSync(coverageDir, { recursive: true });
    }
    // Check if instrumentation is enabled
    const isInstrumented = process.env.COVERAGE_INSTRUMENTATION === 'true';
    // Log the instrumentation status
    console.log('\nCoverage Instrumentation:', isInstrumented ? 'ENABLED' : 'DISABLED');
    if (isInstrumented) {
        console.log('Coverage data will be saved to:', coverageDir);
        console.log('Using custom babel plugin for enhanced code coverage tracking');
    }
    // Store the start time for calculating total test duration
    global.__INSTRUMENTATION_START_TIME__ = Date.now();
    // Note: COVERAGE_TRACKER will be initialized in the custom test environment
    // We cannot define it here since it won't be available to tests
};
