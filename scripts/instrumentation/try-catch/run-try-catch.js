/**
 * Simplified test script for try-catch instrumentation with Node.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const babel = require('@babel/core');

// Create test directory
const TEST_DIR = path.resolve(__dirname, 'temp');
if (!fs.existsSync(TEST_DIR)) {
  fs.mkdirSync(TEST_DIR, { recursive: true });
}

// Create a coverage tracker module
const coverageTrackerPath = path.join(TEST_DIR, 'coverage-tracker.js');
fs.writeFileSync(coverageTrackerPath, `
const COVERAGE_TRACKER = {
  branches: {},
  tryCatch: {},
  functions: {},
  
  // Function tracking
  trackFunctionStart(funcName, component, id) {
    console.log(\`Function \${funcName} (\${id}) in \${component} started\`);
    return true;
  },
  
  trackFunctionEnd(funcName, component, id) {
    console.log(\`Function \${funcName} (\${id}) in \${component} completed\`);
    return true;
  },
  
  trackFunctionError(funcName, component, id) {
    console.log(\`Function \${funcName} (\${id}) in \${component} encountered an error\`);
    return true;
  },
  
  // Try-catch tracking
  trackTryEnter(component, tryId) {
    if (!this.tryCatch[component]) {
      this.tryCatch[component] = {};
    }
    
    if (!this.tryCatch[component][tryId]) {
      this.tryCatch[component][tryId] = {
        tryCount: 0,
        catchCount: 0,
        finallyCount: 0
      };
    }
    
    this.tryCatch[component][tryId].tryCount++;
    console.log(\`Try block \${tryId} in \${component} entered\`);
    return true;
  },
  
  trackCatchEnter(component, tryId, error) {
    if (!this.tryCatch[component]) {
      this.tryCatch[component] = {};
    }
    
    if (!this.tryCatch[component][tryId]) {
      this.tryCatch[component][tryId] = {
        tryCount: 0,
        catchCount: 0,
        finallyCount: 0
      };
    }
    
    this.tryCatch[component][tryId].catchCount++;
    console.log(\`Catch block \${tryId} in \${component} entered with error: \${error}\`);
    return true;
  },
  
  trackFinallyEnter(component, tryId) {
    if (!this.tryCatch[component]) {
      this.tryCatch[component] = {};
    }
    
    if (!this.tryCatch[component][tryId]) {
      this.tryCatch[component][tryId] = {
        tryCount: 0,
        catchCount: 0,
        finallyCount: 0
      };
    }
    
    this.tryCatch[component][tryId].finallyCount++;
    console.log(\`Finally block \${tryId} in \${component} entered\`);
    return true;
  },
  
  // Get coverage report
  getReport() {
    return {
      branches: this.branches,
      tryCatch: this.tryCatch
    };
  }
};

module.exports = COVERAGE_TRACKER;
`);

// Create a simple test file
const testTryCatchPath = path.join(TEST_DIR, 'test-try-catch.js');
fs.writeFileSync(testTryCatchPath, `
// Simple function with try-catch
function divide(a, b) {
  try {
    if (b === 0) {
      throw new Error('Cannot divide by zero');
    }
    return a / b;
  } catch (error) {
    console.log('Error caught:', error.message);
    return null;
  }
}

// Function with try-catch-finally
function processValue(value) {
  let processed = null;
  try {
    console.log('Processing value:', value);
    processed = value.toString().toUpperCase();
    return processed;
  } catch (error) {
    console.log('Error processing value:', error.message);
    return 'ERROR';
  } finally {
    console.log('Processing complete, result:', processed);
  }
}

// Test calls
console.log('divide(10, 2) =', divide(10, 2));
console.log('divide(10, 0) =', divide(10, 0));
console.log('processValue("hello") =', processValue("hello"));
console.log('processValue(null) =', processValue(null));
`);

// Try to instrument the file with a simple test first
const minimalTestPath = path.join(TEST_DIR, 'minimal-test.js');
fs.writeFileSync(minimalTestPath, `
function simple() {
  try {
    return "success";
  } catch (error) {
    return "error";
  }
}
console.log(simple());
`);

try {
  console.log('Testing plugin with minimal example first...');
  const pluginPath = path.resolve(__dirname, 'coverage-instrumentation-plugin.js');
  
  // First try a minimal test to see if the plugin works at all
  const minResult = babel.transformSync(fs.readFileSync(minimalTestPath, 'utf8'), {
    plugins: [pluginPath],
    filename: 'minimal-test.js'
  });
  
  if (minResult && minResult.code) {
    console.log('Minimal test transformation successful!');
    
    // Write the minimal transformed code for inspection
    const minimalInstrumentedPath = path.join(TEST_DIR, 'minimal-instrumented.js');
    fs.writeFileSync(minimalInstrumentedPath, `
// Import coverage tracker
const COVERAGE_TRACKER = require('./coverage-tracker');

${minResult.code}
    `);
    
    // Run the minimal instrumented code
    console.log('\nRunning minimal instrumented code:');
    execSync(`node ${minimalInstrumentedPath}`, { stdio: 'inherit' });
    
    // Now try to instrument the full test file
    console.log('\nInstrumenting full try-catch test file...');
    try {
      const result = babel.transformSync(fs.readFileSync(testTryCatchPath, 'utf8'), {
        plugins: [pluginPath],
        filename: 'test-try-catch.js'
      });
      
      if (result && result.code) {
        const instrumentedPath = path.join(TEST_DIR, 'instrumented-try-catch.js');
        fs.writeFileSync(instrumentedPath, `
// Import coverage tracker
const COVERAGE_TRACKER = require('./coverage-tracker');

${result.code}
        `);
        
        console.log('Instrumented code written to:', instrumentedPath);
        console.log('\nRunning instrumented code:');
        execSync(`node ${instrumentedPath}`, { stdio: 'inherit' });
        console.log('\nTry-catch instrumentation test completed successfully!');
      } else {
        console.error('Failed to transform full try-catch test.');
      }
    } catch (fullError) {
      console.error('Error instrumenting full try-catch test:', fullError.message);
      
      if (fullError.message.includes('Maximum call stack size exceeded')) {
        console.error('\nStack overflow detected with full test.');
        console.error('The plugin works with simple cases but struggles with more complex code.');
      }
    }
  } else {
    console.log('Even minimal test transformation failed.');
  }
} catch (error) {
  console.error('Error during try-catch instrumentation test:', error.message);
} 