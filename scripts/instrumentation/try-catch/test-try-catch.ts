import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as babel from '@babel/core';

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
  switches: {},
  cases: {},
  functions: {},
  jsx: {},
  tryBlocks: {},
  
  // Branch tracking
  trackBranch(component, branchId, type, condition) {
    if (!this.branches[component]) {
      this.branches[component] = {};
    }
    if (!this.branches[component][branchId]) {
      this.branches[component][branchId] = { 
        type, 
        hits: 0,
        conditions: []
      };
    }
    
    this.branches[component][branchId].hits++;
    this.branches[component][branchId].conditions.push(condition);
    
    return condition;
  },
  
  // Switch statement tracking
  trackSwitch(component, switchId, value) {
    if (!this.switches[component]) {
      this.switches[component] = {};
    }
    if (!this.switches[component][switchId]) {
      this.switches[component][switchId] = {
        hits: 0,
        values: []
      };
    }
    
    this.switches[component][switchId].hits++;
    this.switches[component][switchId].values.push(value);
    
    console.log(\`Switch \${switchId} in \${component} evaluated with value: \${value}\`);
    return value;
  },
  
  // Case tracking
  trackCase(component, switchId, caseId, matches) {
    const key = \`\${component}:\${switchId}:\${caseId}\`;
    if (!this.cases[key]) {
      this.cases[key] = {
        hits: 0,
        matches: 0
      };
    }
    
    this.cases[key].hits++;
    if (matches) {
      this.cases[key].matches++;
    }
    
    console.log(\`Case \${caseId} for switch \${switchId} in \${component} evaluated: \${matches ? 'matched' : 'not matched'}\`);
    return matches;
  },
  
  // Function tracking
  trackFunction(component, funcId, name) {
    if (!this.functions[component]) {
      this.functions[component] = {};
    }
    if (!this.functions[component][funcId]) {
      this.functions[component][funcId] = {
        name,
        hits: 0
      };
    }
    
    this.functions[component][funcId].hits++;
    console.log(\`Function \${name} (\${funcId}) in \${component} called\`);
  },
  
  // JSX tracking
  trackJSX(component, jsxId, elementType) {
    if (!this.jsx[component]) {
      this.jsx[component] = {};
    }
    if (!this.jsx[component][jsxId]) {
      this.jsx[component][jsxId] = {
        elementType,
        hits: 0
      };
    }
    
    this.jsx[component][jsxId].hits++;
    console.log(\`JSX \${elementType} (\${jsxId}) in \${component} rendered\`);
  },
  
  // Try-catch tracking
  trackTryEnter(component, tryId) {
    const key = \`\${component}:\${tryId}\`;
    if (!this.tryBlocks[key]) {
      this.tryBlocks[key] = {
        tryCount: 0,
        catchCount: 0,
        finallyCount: 0,
        errors: []
      };
    }
    
    this.tryBlocks[key].tryCount++;
    console.log(\`Try block \${tryId} in \${component} entered\`);
    return true;
  },
  
  trackCatchEnter(component, tryId, error) {
    const key = \`\${component}:\${tryId}\`;
    if (!this.tryBlocks[key]) {
      this.tryBlocks[key] = {
        tryCount: 0,
        catchCount: 0,
        finallyCount: 0,
        errors: []
      };
    }
    
    this.tryBlocks[key].catchCount++;
    this.tryBlocks[key].errors.push(error ? error.toString() : 'Unknown error');
    console.log(\`Catch block \${tryId} in \${component} entered with error: \${error}\`);
    return true;
  },
  
  trackFinallyEnter(component, tryId) {
    const key = \`\${component}:\${tryId}\`;
    if (!this.tryBlocks[key]) {
      this.tryBlocks[key] = {
        tryCount: 0,
        catchCount: 0,
        finallyCount: 0,
        errors: []
      };
    }
    
    this.tryBlocks[key].finallyCount++;
    console.log(\`Finally block \${tryId} in \${component} entered\`);
    return true;
  },
  
  // Get coverage report
  getReport() {
    return {
      branches: this.branches,
      switches: this.switches,
      cases: this.cases,
      functions: this.functions,
      jsx: this.jsx,
      tryBlocks: this.tryBlocks
    };
  },
  
  // Print coverage report
  printReport() {
    console.log('\\nCoverage Report:');
    console.log('----------------');
    
    // Report try/catch blocks
    console.log('\\nTry-Catch Statements:');
    for (const key in this.tryBlocks) {
      const [component, tryId] = key.split(':');
      const block = this.tryBlocks[key];
      console.log(\`  \${component} - Try Block \${tryId}:\`);
      console.log(\`    try: \${block.tryCount} entries\`);
      console.log(\`    catch: \${block.catchCount} entries\`);
      console.log(\`    finally: \${block.finallyCount} entries\`);
      if (block.errors.length > 0) {
        console.log(\`    errors: \${JSON.stringify(block.errors)}\`);
      }
    }
  }
};

module.exports = COVERAGE_TRACKER;
`);

// Create the test case file with examples of try-catch statements
const testTryCatchPath = path.join(TEST_DIR, 'test-try-catch.js');
fs.writeFileSync(testTryCatchPath, `
// Test functions to be used with try-catch

// Function that works normally
function divide(a, b) {
  return a / b;
}

// Function that throws an error
function validatePositive(num) {
  if (num <= 0) {
    throw new Error('Number must be positive');
  }
  return num;
}

// Function that might throw different errors
function processData(data) {
  if (!data) {
    throw new TypeError('Data is required');
  }
  
  if (!Array.isArray(data)) {
    throw new Error('Data must be an array');
  }
  
  if (data.length === 0) {
    throw new RangeError('Data array cannot be empty');
  }
  
  return data.map(item => item * 2);
}

// Function with nested try-catch
function nestedTryCatch(value) {
  try {
    console.log('Outer try block');
    try {
      console.log('Inner try block');
      if (value < 0) {
        throw new Error('Negative value in inner block');
      }
      return 'Inner success';
    } catch (innerError) {
      console.log('Inner catch block');
      throw new Error(\`Inner error caught: \${innerError.message}\`);
    } finally {
      console.log('Inner finally block');
    }
  } catch (outerError) {
    console.log('Outer catch block');
    return \`Outer error caught: \${outerError.message}\`;
  } finally {
    console.log('Outer finally block');
  }
}

// Function where finally returns
function finallyReturn() {
  try {
    console.log('Try block in finallyReturn');
    return 'Return from try';
  } catch (error) {
    console.log('Catch block in finallyReturn');
    return 'Return from catch';
  } finally {
    console.log('Finally block in finallyReturn');
    // Note: This return will override any returns from try or catch
    return 'Return from finally';
  }
}

// Function with try without catch (only finally)
function tryWithoutCatch() {
  try {
    console.log('Try block without catch');
    return 'Success';
  } finally {
    console.log('Finally block without catch');
  }
}

// Function that rethrows an error
function rethrowError(shouldThrow) {
  try {
    if (shouldThrow) {
      throw new Error('Original error');
    }
    return 'No error';
  } catch (error) {
    console.log('Caught error, but rethrowing');
    throw new Error(\`Rethrown: \${error.message}\`);
  }
}

// Function with catch that does conditional handling
function conditionalCatch(input) {
  try {
    if (typeof input !== 'number') {
      throw new TypeError('Input must be a number');
    }
    if (input < 0) {
      throw new RangeError('Input must be non-negative');
    }
    return Math.sqrt(input);
  } catch (error) {
    if (error instanceof TypeError) {
      console.log('Type error handled specifically');
      return 'Invalid type';
    } else if (error instanceof RangeError) {
      console.log('Range error handled specifically');
      return 'Invalid range';
    } else {
      console.log('Unknown error');
      throw error; // Rethrow unknown errors
    }
  }
}

// Async function with try-catch
async function asyncTryCatch() {
  try {
    console.log('Async try block');
    const result = await Promise.resolve(42);
    return result;
  } catch (error) {
    console.log('Async catch block');
    return 0;
  } finally {
    console.log('Async finally block');
  }
}

// Testing success cases
console.log('\\nTesting successful operations:');
try {
  console.log('Division result:', divide(10, 2));
} catch (error) {
  console.log('Error caught:', error.message);
}

try {
  console.log('Validation result:', validatePositive(5));
} catch (error) {
  console.log('Error caught:', error.message);
}

try {
  console.log('Process data result:', processData([1, 2, 3]));
} catch (error) {
  console.log('Error caught:', error.message);
}

// Testing error cases
console.log('\\nTesting error conditions:');
try {
  console.log('Division by zero:', divide(10, 0));
} catch (error) {
  console.log('Error caught:', error.message);
}

try {
  console.log('Validation of negative:', validatePositive(-5));
} catch (error) {
  console.log('Error caught:', error.message);
}

try {
  console.log('Process null data:', processData(null));
} catch (error) {
  console.log('Error caught:', error.message);
}

try {
  console.log('Process non-array data:', processData('string'));
} catch (error) {
  console.log('Error caught:', error.message);
}

try {
  console.log('Process empty array:', processData([]));
} catch (error) {
  console.log('Error caught:', error.message);
}

// Testing nested try-catch
console.log('\\nTesting nested try-catch:');
console.log('Nested try-catch with positive value:', nestedTryCatch(5));
console.log('Nested try-catch with negative value:', nestedTryCatch(-5));

// Testing finally behavior
console.log('\\nTesting finally behavior:');
console.log('Finally return result:', finallyReturn());
console.log('Try without catch result:', tryWithoutCatch());

// Testing rethrow
console.log('\\nTesting error rethrowing:');
try {
  console.log('Should not throw:', rethrowError(false));
} catch (error) {
  console.log('Caught rethrown error:', error.message);
}

try {
  console.log('Should throw:', rethrowError(true));
} catch (error) {
  console.log('Caught rethrown error:', error.message);
}

// Testing conditional catch
console.log('\\nTesting conditional catch:');
console.log('Conditional catch with valid input:', conditionalCatch(16));
console.log('Conditional catch with negative input:', conditionalCatch(-4));
console.log('Conditional catch with string input:', conditionalCatch('test'));

// Testing async try-catch
console.log('\\nTesting async try-catch:');
asyncTryCatch().then(result => console.log('Async result:', result));

// Get the coverage report
const coverageTracker = require('./coverage-tracker');
setTimeout(() => {
  coverageTracker.printReport();
}, 100); // Short delay to ensure async operations complete
`);

// Instrument the file with Babel
const instrumentedFilePath = path.join(TEST_DIR, 'instrumented-try-catch.js');

async function main() {
  try {
    console.log('Instrumenting try-catch statements with coverage tracking...');
    
    // Path to the plugin
    const pluginPath = path.resolve(__dirname, 'coverage-instrumentation-plugin.js');
    
    const cwd = process.cwd();
    process.chdir(TEST_DIR);
    
    const result = babel.transformFileSync('test-try-catch.js', {
      plugins: [pluginPath],
      filename: 'test-try-catch.js'
    });
    
    if (result && result.code) {
      fs.writeFileSync(instrumentedFilePath, result.code);
      
      console.log('Running instrumented code...');
      execSync(`node ${instrumentedFilePath}`, { stdio: 'inherit' });
    } else {
      console.error('Error: Babel transformation failed to produce code');
    }
    
    process.chdir(cwd);
    
    console.log('\nTry-catch instrumentation test completed successfully!');
  } catch (error) {
    console.error('Error during try-catch instrumentation test:', error);
  }
}

main(); 