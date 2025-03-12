"use strict";

/**
 * Simple Flow Test File
 * 
 * This file tests basic Flow features for initial performance testing.
 */
// Some basic Flow types
// Simple function with Flow types
function greet(name) {
  return "Hello, ".concat(name, "!");
}

// Arrow function with type assertion
var isActive = function isActive(user) {
  return COVERAGE_TRACKER.trackBranch("isActive", "25:9", "ternary", user.isActive) ? true : false;
};

// Function with conditional logic
function processUser(user) {
  if (COVERAGE_TRACKER.trackBranch("processUser", "30:2", "if", user.isActive)) {
    return "User ".concat(user.name, " is active");
  } else {
    return "User ".concat(user.name, " is inactive");
  }
}

// Test code
try {
  console.log('Running simple Flow test...');

  // Test functions
  console.log(greet('World'));
  var user = {
    id: 1,
    name: 'John',
    isActive: true
  };
  console.log(COVERAGE_TRACKER.trackBranch("flow-simple-test", "45:14", "ternary", isActive(user)) ? 'User is active' : 'User is inactive');
  console.log(processUser(user));
  console.log('Simple Flow test completed!');
} catch (error) {
  console.error('Error in simple Flow test:', error);
}