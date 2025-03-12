/**
 * Test try-catch instrumentation with the fixed plugin
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const babel = require('@babel/core');

// Set up test environment
const TEST_DIR = path.resolve(__dirname, 'temp-fixed');
const PLUGIN_PATH = path.resolve(__dirname, '..', 'fixed-coverage-plugin.js');

// Create test directory
if (!fs.existsSync(TEST_DIR)) {
  fs.mkdirSync(TEST_DIR, { recursive: true });
}

// Create coverage tracker file
const coverageTrackerFile = path.join(TEST_DIR, 'coverage-tracker.js');
fs.writeFileSync(coverageTrackerFile, `
// Coverage tracker for fixed plugin
const COVERAGE_TRACKER = {
  functions: {},
  branches: {},
  tryCatch: {},
  
  trackFunctionStart(functionName, component, id) {
    const key = \`\${component}:\${id}:\${functionName}\`;
    if (!this.functions[key]) {
      this.functions[key] = { calls: 0 };
    }
    this.functions[key].calls++;
    console.log(\`Function \${functionName} (id: \${id}) in \${component} started\`);
    return true;
  },
  
  trackFunctionEnd(functionName, component, id) {
    console.log(\`Function \${functionName} (id: \${id}) in \${component} completed\`);
    return true;
  },
  
  trackFunctionError(functionName, component, id) {
    console.log(\`Function \${functionName} (id: \${id}) in \${component} errored\`);
    return true;
  },
  
  trackBranch(component, branchId, branchType, condition) {
    const key = \`\${component}:\${branchId}:\${branchType}\`;
    if (!this.branches[key]) {
      this.branches[key] = { 
        evaluations: 0,
        truthy: 0,
        falsy: 0
      };
    }
    
    this.branches[key].evaluations++;
    
    if (condition) {
      this.branches[key].truthy++;
      console.log(\`Branch \${branchType} (id: \${branchId}) in \${component} evaluated to true\`);
    } else {
      this.branches[key].falsy++;
      console.log(\`Branch \${branchType} (id: \${branchId}) in \${component} evaluated to false\`);
    }
    
    return condition;
  },
  
  trackTryCatch(component, id, block, error) {
    const key = \`\${component}:\${id}\`;
    
    if (!this.tryCatch[key]) {
      this.tryCatch[key] = {
        try: 0,
        catch: 0,
        finally: 0
      };
    }
    
    this.tryCatch[key][block]++;
    
    if (block === 'try') {
      console.log(\`Try block (id: \${id}) in \${component} executed\`);
    } else if (block === 'catch') {
      console.log(\`Catch block (id: \${id}) in \${component} executed with error: \${error?.message || 'Unknown'}\`);
    } else if (block === 'finally') {
      console.log(\`Finally block (id: \${id}) in \${component} executed\`);
    }
  },
  
  getReport() {
    return {
      functions: this.functions,
      branches: this.branches,
      tryCatch: this.tryCatch
    };
  },
  
  printReport() {
    console.log('\\nCoverage Report:');
    console.log('-----------------');
    
    console.log('\\nFunctions:');
    for (const key in this.functions) {
      const [component, id, name] = key.split(':');
      console.log(\`  \${name} in \${component}: \${this.functions[key].calls} calls\`);
    }
    
    console.log('\\nBranches:');
    for (const key in this.branches) {
      const [component, id, type] = key.split(':');
      const branch = this.branches[key];
      console.log(\`  \${type} \${id} in \${component}: \${branch.evaluations} evaluations (true: \${branch.truthy}, false: \${branch.falsy})\`);
    }
    
    console.log('\\nTry-Catch:');
    for (const key in this.tryCatch) {
      const [component, id] = key.split(':');
      const tc = this.tryCatch[key];
      console.log(\`  Block \${id} in \${component}: try: \${tc.try}, catch: \${tc.catch}, finally: \${tc.finally}\`);
    }
  }
};

module.exports = COVERAGE_TRACKER;
`);

// Create test file with try-catch blocks
const testTryCatchFile = path.join(TEST_DIR, 'test-try-catch.js');
fs.writeFileSync(testTryCatchFile, `
// Import the coverage tracker
const COVERAGE_TRACKER = require('./coverage-tracker');

// Basic try-catch
function testBasicTryCatch() {
  console.log('Testing basic try-catch...');
  try {
    console.log('In try block');
    return 'Success';
  } catch (error) {
    console.log('In catch block');
    return 'Error: ' + error.message;
  } finally {
    console.log('In finally block');
  }
}

// Try-catch with error
function testTryCatchWithError() {
  console.log('Testing try-catch with error...');
  try {
    console.log('In try block, about to throw error');
    throw new Error('Test error');
    return 'This will not execute';
  } catch (error) {
    console.log('In catch block, caught:', error.message);
    return 'Caught error: ' + error.message;
  } finally {
    console.log('In finally block');
  }
}

// Nested try-catch blocks
function testNestedTryCatch() {
  console.log('Testing nested try-catch...');
  try {
    console.log('In outer try block');
    try {
      console.log('In inner try block');
      throw new Error('Inner error');
    } catch (innerError) {
      console.log('In inner catch block:', innerError.message);
    } finally {
      console.log('In inner finally block');
    }
    return 'Outer try completed';
  } catch (outerError) {
    console.log('In outer catch block:', outerError.message);
    return 'Outer catch: ' + outerError.message;
  } finally {
    console.log('In outer finally block');
  }
}

// Run tests
console.log(testBasicTryCatch());
console.log('--------');
console.log(testTryCatchWithError());
console.log('--------');
console.log(testNestedTryCatch());

// Print coverage report
COVERAGE_TRACKER.printReport();
`);

// Instrument the code
console.log('Instrumenting try-catch with fixed plugin...');
try {
  // Verify plugin exists
  if (!fs.existsSync(PLUGIN_PATH)) {
    console.error(`Fixed plugin not found at: ${PLUGIN_PATH}`);
    process.exit(1);
  }
  
  const result = babel.transformFileSync(testTryCatchFile, {
    plugins: [PLUGIN_PATH],
    filename: 'test-try-catch.js'
  });
  
  if (result && result.code) {
    const instrumentedFile = path.join(TEST_DIR, 'instrumented-try-catch.js');
    fs.writeFileSync(instrumentedFile, result.code);
    console.log(`Instrumented code written to: ${instrumentedFile}`);
    
    // Run the instrumented code
    console.log('\nRunning instrumented code:');
    console.log('-------------------------------------------');
    
    execSync(`node ${instrumentedFile}`, { stdio: 'inherit' });
    
    console.log('-------------------------------------------');
    console.log('Try-catch instrumentation test completed successfully!');
  } else {
    console.error('Failed to transform code with the fixed plugin');
  }
} catch (error) {
  console.error('Error during try-catch instrumentation test:', error.message);
  if (error.stack) {
    console.error(error.stack.split('\n').slice(0, 3).join('\n'));
  }
} 