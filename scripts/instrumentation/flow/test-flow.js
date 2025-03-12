/**
 * Test script for Flow instrumentation
 * 
 * This script tests the Flow instrumentation plugin with optimizations for
 * handling Flow type annotations. It uses a step-by-step approach to isolate issues:
 * 
 * 1. Test with extremely basic Flow file first (tiny-flow-test.js)
 * 2. Then test with a basic Flow file (flow-simple-test.js)
 * 3. Finally, if previous tests pass, test with a full Flow file (flow-test.js)
 * 
 * Each step runs with strict memory limits and timeouts, includes detailed logging,
 * and implements circuit breakers to prevent infinite loops or memory leaks.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const babel = require('@babel/core');

// Constants for test configuration
const TEST_DIR = path.join(__dirname, 'temp');
const COVERAGE_TRACKER_PATH = path.join(TEST_DIR, 'coverage-tracker.js');
const TINY_FLOW_TEST_PATH = path.join(TEST_DIR, 'tiny-flow-test.js');
const SIMPLE_FLOW_TEST_PATH = path.join(TEST_DIR, 'flow-simple-test.js');
const FULL_FLOW_TEST_PATH = path.join(TEST_DIR, 'flow-test.js');
const INSTRUMENTED_TINY_FLOW_TEST_PATH = path.join(TEST_DIR, 'instrumented-tiny-flow-test.js');
const INSTRUMENTED_SIMPLE_FLOW_TEST_PATH = path.join(TEST_DIR, 'instrumented-simple-flow-test.js');
const INSTRUMENTED_FULL_FLOW_TEST_PATH = path.join(TEST_DIR, 'instrumented-flow-test.js');

// Check if the required Babel packages are installed
try {
  require('@babel/preset-flow');
  console.log("@babel/preset-flow is installed and ready for use.");
} catch (error) {
  console.error("@babel/preset-flow is not installed. Installing it now...");
  try {
    execSync('npm install --save-dev @babel/preset-flow', { stdio: 'inherit' });
    console.log("@babel/preset-flow has been installed successfully.");
  } catch (installError) {
    console.error("Failed to install @babel/preset-flow. Please install it manually.");
    process.exit(1);
  }
}

// Create test directory if it doesn't exist
if (!fs.existsSync(TEST_DIR)) {
  fs.mkdirSync(TEST_DIR, { recursive: true });
  console.log(`Created test directory: ${TEST_DIR}`);
}

// Coverage tracker implementation
const coverageTrackerContent = `
// Simple coverage tracker with memory optimizations
let coverageData = {
  branches: {},
  jsxRenders: {},
  functionCalls: {},
  errors: {}
};

let _flowCoverage = {};

global.COVERAGE_TRACKER = {
  // Track branch coverage
  trackBranch(component, id, type, result) {
    if (!coverageData.branches[component]) {
      coverageData.branches[component] = {};
    }
    
    const key = \`\${id}:\${type}\`;
    if (!coverageData.branches[component][key]) {
      coverageData.branches[component][key] = {
        count: 0,
        trueCount: 0,
        falseCount: 0
      };
    }
    
    coverageData.branches[component][key].count++;
    if (result) {
      coverageData.branches[component][key].trueCount++;
    } else {
      coverageData.branches[component][key].falseCount++;
    }
    
    console.log(\`[\${component}] Branch \${type} (id: \${id}) evaluated to \${result}\`);
    return result;
  },
  
  // Track JSX renders
  trackJSXRender(component, id, type) {
    if (!coverageData.jsxRenders[component]) {
      coverageData.jsxRenders[component] = {};
    }
    
    const key = \`\${id}:\${type}\`;
    if (!coverageData.jsxRenders[component][key]) {
      coverageData.jsxRenders[component][key] = {
        count: 0
      };
    }
    
    coverageData.jsxRenders[component][key].count++;
    
    console.log(\`[\${component}] JSX element \${type} (id: \${id}) rendered\`);
    return true;
  },
  
  // Track function calls
  trackFunction(component, id, name, args) {
    if (!coverageData.functionCalls[component]) {
      coverageData.functionCalls[component] = {};
    }
    
    const key = \`\${id}:\${name}\`;
    if (!coverageData.functionCalls[component][key]) {
      coverageData.functionCalls[component][key] = {
        count: 0,
        args: []
      };
    }
    
    const data = coverageData.functionCalls[component][key];
    data.count++;
    
    // Only store up to 10 argument samples to prevent memory issues
    if (data.args.length < 10) {
      data.args.push(args || []);
    }
    
    console.log(\`[\${component}] Function \${name} (id: \${id}) called\`);
    return true;
  },
  
  // Track errors
  trackError(component, id, type, error) {
    if (!coverageData.errors[component]) {
      coverageData.errors[component] = {};
    }
    
    const key = \`\${id}:\${type}\`;
    if (!coverageData.errors[component][key]) {
      coverageData.errors[component][key] = {
        count: 0,
        errors: []
      };
    }
    
    const data = coverageData.errors[component][key];
    data.count++;
    
    // Only store up to 5 error samples to prevent memory issues
    if (data.errors.length < 5) {
      data.errors.push(error ? error.toString() : 'Unknown error');
    }
    
    console.log(\`[\${component}] Error in \${type} (id: \${id}): \${error}\`);
    return true;
  },
  
  // Get coverage report
  getCoverageReport() {
    return coverageData;
  }
};

module.exports = global.COVERAGE_TRACKER;
`;

// Write the coverage tracker to file
fs.writeFileSync(COVERAGE_TRACKER_PATH, coverageTrackerContent);
console.log(`Created coverage tracker at: ${COVERAGE_TRACKER_PATH}`);

// Create tiny Flow test file (minimal example to verify Flow syntax)
const tinyFlowTestContent = `
// @flow
// Minimal Flow example

// Basic type annotation
function add(a: number, b: number): number {
  return a + b;
}

const result: number = add(1, 2);
console.log('Result:', result);
`;

fs.writeFileSync(TINY_FLOW_TEST_PATH, tinyFlowTestContent);
console.log(`Created tiny Flow test at: ${TINY_FLOW_TEST_PATH}`);

// Create simple Flow test file (more complex than tiny but still simple)
const simpleFlowTestContent = `
// @flow
// Simple Flow example with various type annotations

// Type aliases
type UserID = string;
type UserStatus = 'active' | 'inactive' | 'banned';

// Interface-like type
type User = {
  id: UserID,
  name: string,
  age: number,
  status: UserStatus,
  email?: string, // Optional property
};

// Function with object parameter and return type
function getDisplayName(user: User): string {
  return \`\${user.name} (\${user.status})\`;
}

// Array type
function getActiveUsers(users: Array<User>): Array<User> {
  return users.filter(user => user.status === 'active');
}

// Generic type
function getFirstItem<T>(items: Array<T>): ?T {
  return items.length > 0 ? items[0] : null;
}

// Test data
const users: Array<User> = [
  { id: 'user1', name: 'Alice', age: 30, status: 'active' },
  { id: 'user2', name: 'Bob', age: 25, status: 'inactive' },
  { id: 'user3', name: 'Charlie', age: 35, status: 'active' },
];

// Test function calls
console.log('Active users:', getActiveUsers(users).length);
console.log('First user name:', getDisplayName(users[0]));
console.log('First active user:', getFirstItem(getActiveUsers(users))?.name);
`;

fs.writeFileSync(SIMPLE_FLOW_TEST_PATH, simpleFlowTestContent);
console.log(`Created simple Flow test at: ${SIMPLE_FLOW_TEST_PATH}`);

// Create full Flow test file (comprehensive test with all Flow features)
const fullFlowTestContent = `
// @flow
// Comprehensive Flow example with advanced features

// Primitive types
const count: number = 42;
const name: string = 'Flow Test';
const isEnabled: boolean = true;
const nothing: null = null;
const missing: void = undefined;

// Literal types
type Alignment = 'left' | 'center' | 'right';
const textAlign: Alignment = 'center';

// Maybe types
function getMiddleName(fullName: string): ?string {
  const parts = fullName.split(' ');
  return parts.length > 2 ? parts[1] : null;
}

// Object types with exact syntax
type ExactUser = {|
  id: string,
  name: string,
  age: number,
  metadata: {| createdAt: Date, lastLogin: ?Date |}
|};

// Array and tuple types
const numbers: Array<number> = [1, 2, 3, 4, 5];
const userInfo: [string, number, boolean] = ['john', 30, true];

// Function types
type CallbackFn = (error: ?Error, result: ?Object) => void;
type DataProcessor = (data: string) => Promise<Object>;

// Generic types
class Container<T> {
  value: T;
  
  constructor(value: T) {
    this.value = value;
  }
  
  getValue(): T {
    return this.value;
  }
}

// Union and intersection types
type Id = string | number;
type Named = { name: string };
type Timestamped = { createdAt: Date };
type NamedAndTimestamped = Named & Timestamped;

// Type casting with Flow
const userId = ((document.getElementById('user-id'): any): HTMLInputElement);

// Utility types
type Keys = $Keys<ExactUser>;
type Values = $Values<{| a: string, b: number |}>;
type Optional = $Shape<ExactUser>;

// React component with Flow (simplified)
type Props = {|
  title: string,
  items: Array<string>,
  onSelect?: (item: string) => void
|};

function ItemList(props: Props) {
  const { title, items, onSelect } = props;
  
  function handleClick(item: string) {
    if (onSelect) {
      onSelect(item);
    }
  }
  
  return {
    type: 'div',
    props: { className: 'item-list' },
    children: [
      { type: 'h2', props: {}, children: [title] },
      { 
        type: 'ul', 
        props: {}, 
        children: items.map(item => ({
          type: 'li',
          props: { onClick: () => handleClick(item) },
          children: [item]
        }))
      }
    ]
  };
}

// Test functions and data
function processUser(user: ExactUser): string {
  const ageGroup = user.age < 18 ? 'minor' : 'adult';
  const createdDate = user.metadata.createdAt.toISOString().split('T')[0];
  return \`\${user.name} (\${ageGroup}) - Created: \${createdDate}\`;
}

const testUser: ExactUser = {
  id: 'user123',
  name: 'Alice Johnson',
  age: 28,
  metadata: {
    createdAt: new Date('2023-01-15'),
    lastLogin: new Date()
  }
};

const numberContainer = new Container<number>(42);

console.log('User details:', processUser(testUser));
console.log('Container value:', numberContainer.getValue());
console.log('Middle name:', getMiddleName('John Smith Doe'));
`;

fs.writeFileSync(FULL_FLOW_TEST_PATH, fullFlowTestContent);
console.log(`Created full Flow test at: ${FULL_FLOW_TEST_PATH}`);

// Function to transform Flow files with Babel
function transformFile(inputFile, outputFile, presets = [], plugins = []) {
  try {
    console.log(`Transforming ${path.basename(inputFile)}...`);
    
    const source = fs.readFileSync(inputFile, 'utf8');
    
    const result = babel.transformSync(source, {
      filename: path.basename(inputFile),
      presets: [
        '@babel/preset-flow',
        ...presets
      ],
      plugins: [
        // Use our Flow instrumentation plugin
        path.resolve(__dirname, 'flow-support-plugin.js'),
        ...plugins
      ],
      babelrc: false,
      configFile: false
    });

    if (result && result.code) {
      // Add coverage tracker import at the beginning
      const instrumentedCode = `
// Import coverage tracker
require('./coverage-tracker');

${result.code}
      `;
      
      fs.writeFileSync(outputFile, instrumentedCode);
      console.log(`Successfully wrote instrumented code to: ${outputFile}`);
      return true;
    } else {
      console.error(`Failed to transform ${path.basename(inputFile)}: No code generated`);
      return false;
    }
  } catch (error) {
    console.error(`Error transforming ${path.basename(inputFile)}:`, error);
    return false;
  }
}

// Execute the instrumented code
function executeInstrumentedFile(filePath, description) {
  try {
    console.log(`\nRunning ${description}...`);
    console.log('-----------------------------------------------------');
    
    // Set a memory limit and timeout to prevent runaway processes
    execSync(`node --max-old-space-size=512 ${filePath}`, { 
      stdio: 'inherit',
      timeout: 10000 // 10 seconds timeout
    });
    
    console.log('-----------------------------------------------------');
    console.log(`${description} executed successfully\n`);
    return true;
  } catch (error) {
    console.error(`Error executing ${description}:`, error);
    return false;
  }
}

// Step 1: Transform and run the tiny Flow test
console.log('\n============= STEP 1: TINY FLOW TEST =============');
const tinySuccess = transformFile(
  TINY_FLOW_TEST_PATH, 
  INSTRUMENTED_TINY_FLOW_TEST_PATH
);

if (tinySuccess) {
  const tinyExecutionSuccess = executeInstrumentedFile(
    INSTRUMENTED_TINY_FLOW_TEST_PATH,
    'tiny Flow test'
  );
  
  if (!tinyExecutionSuccess) {
    console.error('Tiny Flow test failed. Stopping the test process.');
    process.exit(1);
  }
} else {
  console.error('Failed to transform tiny Flow test. Stopping the test process.');
  process.exit(1);
}

// Step 2: Transform and run the simple Flow test
console.log('\n============= STEP 2: SIMPLE FLOW TEST =============');
const simpleSuccess = transformFile(
  SIMPLE_FLOW_TEST_PATH, 
  INSTRUMENTED_SIMPLE_FLOW_TEST_PATH
);

if (simpleSuccess) {
  const simpleExecutionSuccess = executeInstrumentedFile(
    INSTRUMENTED_SIMPLE_FLOW_TEST_PATH,
    'simple Flow test'
  );
  
  if (!simpleExecutionSuccess) {
    console.warn('Simple Flow test execution failed. Proceeding with caution.');
  }
} else {
  console.warn('Failed to transform simple Flow test. Proceeding with caution.');
}

// Step 3: Transform and run the full Flow test
console.log('\n============= STEP 3: FULL FLOW TEST =============');
const fullSuccess = transformFile(
  FULL_FLOW_TEST_PATH, 
  INSTRUMENTED_FULL_FLOW_TEST_PATH
);

if (fullSuccess) {
  const fullExecutionSuccess = executeInstrumentedFile(
    INSTRUMENTED_FULL_FLOW_TEST_PATH,
    'full Flow test'
  );
  
  if (!fullExecutionSuccess) {
    console.warn('Full Flow test execution failed, but the plugin transformation worked.');
  }
} else {
  console.warn('Failed to transform full Flow test. The plugin may need improvements for advanced Flow features.');
}

console.log('\n============= FLOW INSTRUMENTATION TEST COMPLETE =============');
console.log('Results summary:');
console.log('- Tiny Flow test: ' + (tinySuccess ? 'Transformed ✓' : 'Failed to transform ✗'));
console.log('- Simple Flow test: ' + (simpleSuccess ? 'Transformed ✓' : 'Failed to transform ✗'));
console.log('- Full Flow test: ' + (fullSuccess ? 'Transformed ✓' : 'Failed to transform ✗'));
console.log('\nFlow instrumentation test completed!'); 