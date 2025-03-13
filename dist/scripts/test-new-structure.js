#!/usr/bin/env node
"use strict";
/**
 * This script tests both the original and reorganized project structures by running specific tests
 */
const { execSync } = require('child_process');
const path = require('path');
try {
    // First run a test from the original structure
    console.log('Testing original structure...');
    execSync('npx jest src/managers/__tests__/component-manager.test.ts', { stdio: 'inherit' });
    console.log('\nTest from original structure completed successfully!');
    // Now try to run a test from the new structure 
    console.log('\nTesting reorganized structure...');
    execSync('npx jest src/component-management/managers/__tests__/component-manager.test.ts --runInBand', { stdio: 'inherit' });
    console.log('\nTest from new structure completed successfully!');
}
catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
}
console.log('\nAll tests completed successfully!');
