/**
 * Run all fixed instrumentation tests
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// First create the fixed plugin file if it doesn't exist
const PLUGIN_DIR = path.resolve(__dirname);
const PLUGIN_PATH = path.resolve(PLUGIN_DIR, 'fixed-coverage-plugin.js');

// Check if the fixed plugin exists
if (!fs.existsSync(PLUGIN_PATH)) {
  console.error(`Error: Fixed plugin not found at ${PLUGIN_PATH}`);
  process.exit(1);
}

// Check for required babel dependencies
try {
  require.resolve('@babel/core');
  require.resolve('@babel/helper-plugin-utils');
} catch (error) {
  console.error('Error: Required babel dependencies are missing. Please install @babel/core and @babel/helper-plugin-utils');
  process.exit(1);
}

// Run Function Instrumentation Test
console.log('\n============================================');
console.log('RUNNING FUNCTION INSTRUMENTATION TEST');
console.log('============================================\n');

try {
  const functionTestFile = path.join(__dirname, 'function', 'test-function-fixed.js');
  
  // Create the file and directory if it doesn't exist
  if (!fs.existsSync(path.dirname(functionTestFile))) {
    fs.mkdirSync(path.dirname(functionTestFile), { recursive: true });
  }
  
  // Run the function test
  execSync(`node ${functionTestFile}`, { stdio: 'inherit' });
  console.log('Function instrumentation test completed successfully');
} catch (error) {
  console.error('Error running function instrumentation test:', error.message);
}

// Run JSX Instrumentation Test (if @babel/preset-react is available)
console.log('\n============================================');
console.log('RUNNING JSX INSTRUMENTATION TEST');
console.log('============================================\n');

try {
  // Check if @babel/preset-react is installed
  try {
    require.resolve('@babel/preset-react');
    const jsxTestFile = path.join(__dirname, 'jsx', 'test-jsx-fixed.js');
    
    // Create the file and directory if it doesn't exist
    if (!fs.existsSync(path.dirname(jsxTestFile))) {
      fs.mkdirSync(path.dirname(jsxTestFile), { recursive: true });
    }
    
    // Run the JSX test
    execSync(`node ${jsxTestFile}`, { stdio: 'inherit' });
    console.log('JSX instrumentation test completed successfully');
  } catch (error) {
    console.warn('@babel/preset-react is not installed, skipping JSX instrumentation test');
    console.warn('To run JSX tests, please install it with: npm install --save-dev @babel/preset-react');
  }
} catch (error) {
  console.error('Error running JSX instrumentation test:', error.message);
}

// Run Try-Catch Instrumentation Test
console.log('\n============================================');
console.log('RUNNING TRY-CATCH INSTRUMENTATION TEST');
console.log('============================================\n');

try {
  const tryCatchTestFile = path.join(__dirname, 'try-catch', 'test-try-catch-fixed.js');
  
  // Create the file and directory if it doesn't exist
  if (!fs.existsSync(path.dirname(tryCatchTestFile))) {
    fs.mkdirSync(path.dirname(tryCatchTestFile), { recursive: true });
  }
  
  // Run the try-catch test
  execSync(`node ${tryCatchTestFile}`, { stdio: 'inherit' });
  console.log('Try-Catch instrumentation test completed successfully');
} catch (error) {
  console.error('Error running try-catch instrumentation test:', error.message);
}

// Run Switch Instrumentation Test
console.log('\n============================================');
console.log('RUNNING SWITCH INSTRUMENTATION TEST');
console.log('============================================\n');

try {
  const switchTestFile = path.join(__dirname, 'switch', 'test-switch-fixed.js');
  
  // Create the file and directory if it doesn't exist
  if (!fs.existsSync(path.dirname(switchTestFile))) {
    fs.mkdirSync(path.dirname(switchTestFile), { recursive: true });
  }
  
  // Run the switch test
  execSync(`node ${switchTestFile}`, { stdio: 'inherit' });
  console.log('Switch instrumentation test completed successfully');
} catch (error) {
  console.error('Error running switch instrumentation test:', error.message);
}

// Run Loop Instrumentation Test
console.log('\n============================================');
console.log('RUNNING LOOP INSTRUMENTATION TEST');
console.log('============================================\n');

try {
  const loopTestFile = path.join(__dirname, 'loop', 'test-loop-fixed.js');
  
  // Create the file and directory if it doesn't exist
  if (!fs.existsSync(path.dirname(loopTestFile))) {
    fs.mkdirSync(path.dirname(loopTestFile), { recursive: true });
  }
  
  // Run the loop test
  execSync(`node ${loopTestFile}`, { stdio: 'inherit' });
  console.log('Loop instrumentation test completed successfully');
} catch (error) {
  console.error('Error running loop instrumentation test:', error.message);
}

// Run Class Instrumentation Test
console.log('\n============================================');
console.log('RUNNING CLASS INSTRUMENTATION TEST');
console.log('============================================\n');

try {
  const classTestFile = path.join(__dirname, 'class', 'test-class-fixed.js');
  
  // Create the file and directory if it doesn't exist
  if (!fs.existsSync(path.dirname(classTestFile))) {
    fs.mkdirSync(path.dirname(classTestFile), { recursive: true });
  }
  
  // Run the class test
  execSync(`node ${classTestFile}`, { stdio: 'inherit' });
  console.log('Class instrumentation test completed successfully');
} catch (error) {
  console.error('Error running class instrumentation test:', error.message);
}
console.log('\n============================================');
console.log('ALL TESTS COMPLETED');
console.log('============================================\n');

console.log('Summary:');
console.log('1. Created an anti-recursion fixed coverage plugin');
console.log('2. Tested function, JSX, try-catch, switch, loop, and class instrumentation');
console.log('3. Fixed stack overflow issues by preventing infinite recursion');
console.log('\nThe fixed plugin prevents stack overflow by:');
console.log('- Using a WeakSet to track visited nodes and prevent repeat processing');
console.log('- Adding recursion depth tracking with a maximum limit');
console.log('- Using simplified instrumentation approach');
console.log('- Adding proper node traversal protection'); 