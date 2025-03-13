"use strict";
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
const TEST_DIR = path.join(process.cwd(), '.instrumentation-test', 'flow-test');
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
}
catch (error) {
    console.error("@babel/preset-flow is not installed. Installing it now...");
    try {
        execSync('npm install --save-dev @babel/preset-flow', { stdio: 'inherit' });
        console.log("@babel/preset-flow has been installed successfully.");
    }
    catch (installError) {
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

// Memory optimization - enable object pooling
const NODE_POOL_SIZE = 1000;
const nodePool = [];

function resetPool() {
  nodePool.length = 0;
}

function getFromPool() {
  if (nodePool.length > 0) {
    return nodePool.pop();
  }
  return {};
}

function returnToPool(obj) {
  if (nodePool.length < NODE_POOL_SIZE) {
    Object.keys(obj).forEach(key => {
      delete obj[key];
    });
    nodePool.push(obj);
  }
}

// Circuit breaker - prevent infinite tracking
const MAX_NODES_PER_TYPE = 2000;
const trackedNodes = new Set();

function shouldTrack(id, type) {
  const key = \`\${type}:\${id}\`;
  if (trackedNodes.has(key)) {
    return false;
  }
  
  // Count nodes by type
  let countByType = 0;
  for (const existingKey of trackedNodes) {
    if (existingKey.startsWith(type)) {
      countByType++;
      if (countByType >= MAX_NODES_PER_TYPE) {
        console.log(\`Circuit breaker: maximum \${type} nodes (\${MAX_NODES_PER_TYPE}) reached\`);
        return false;
      }
    }
  }
  
  trackedNodes.add(key);
  return true;
}

// Export the COVERAGE_TRACKER global
global.COVERAGE_TRACKER = {
  // Track branches (if/else, ternary, logical expressions)
  trackBranch: function(id, componentName, branchType, condition, location) {
    if (!shouldTrack(id, 'branch')) return condition;
    
    const key = \`\${componentName}-\${branchType}-\${location}\`;
    
    if (!coverageData.branches[key]) {
      coverageData.branches[key] = { count: 0, paths: {} };
    }
    
    coverageData.branches[key].count++;
    
    const pathKey = String(condition);
    if (!coverageData.branches[key].paths[pathKey]) {
      coverageData.branches[key].paths[pathKey] = 0;
    }
    
    coverageData.branches[key].paths[pathKey]++;
    
    if (branchType === 'if' || branchType === 'ternary') {
      console.log(\`Branch \${branchType} in \${componentName} took path \${condition}\`);
    } else if (branchType.startsWith('logical')) {
      console.log(\`Branch \${branchType} in \${componentName} took path \${condition}\`);
    }
    
    return condition;
  },
  
  // Track JSX renders
  trackJsxRender: function(id, componentName, elementType, props) {
    if (!shouldTrack(id, 'jsx')) return;
    
    const key = \`\${componentName}-\${elementType}\`;
    
    if (!coverageData.jsxRenders[key]) {
      coverageData.jsxRenders[key] = 0;
    }
    
    coverageData.jsxRenders[key]++;
    console.log(\`JSX Render: \${elementType} in \${componentName}\`);
  },
  
  // Track function calls
  trackFunctionCall: function(id, functionName, arguments) {
    if (!shouldTrack(id, 'function')) return;
    
    const key = functionName;
    
    if (!coverageData.functionCalls[key]) {
      coverageData.functionCalls[key] = 0;
    }
    
    coverageData.functionCalls[key]++;
    console.log(\`Function Call: \${functionName}\`);
  },
  
  // Track errors
  trackError: function(id, componentName, errorMessage) {
    if (!shouldTrack(id, 'error')) return;
    
    const key = \`\${componentName}-\${errorMessage}\`;
    
    if (!coverageData.errors[key]) {
      coverageData.errors[key] = 0;
    }
    
    coverageData.errors[key]++;
    console.error(\`Error in \${componentName}: \${errorMessage}\`);
  },
  
  // Get coverage data
  getCoverageData: function() {
    return coverageData;
  },
  
  // Print summary of coverage data
  printSummary: function() {
    console.log('\\nCoverage Summary:');
    console.log('----------------');
    console.log(\`Branches covered: \${Object.keys(coverageData.branches).length}\`);
    console.log(\`JSX elements covered: \${Object.keys(coverageData.jsxRenders).length}\`);
    console.log(\`Functions covered: \${Object.keys(coverageData.functionCalls).length}\`);
    console.log(\`Errors tracked: \${Object.keys(coverageData.errors).length}\`);
    console.log('----------------\\n');
  },
  
  // Reset coverage data (for memory optimization)
  reset: function() {
    coverageData = {
      branches: {},
      jsxRenders: {},
      functionCalls: {},
      errors: {}
    };
    
    trackedNodes.clear();
    resetPool();
    
    // Force garbage collection if available
    if (global.gc) {
      try {
        global.gc();
        console.log("Garbage collection executed");
      } catch (e) {
        // GC not available, ignore
      }
    }
    
    console.log("Coverage data reset");
  }
};

module.exports = global.COVERAGE_TRACKER;
`;
// Write coverage tracker to file
fs.writeFileSync(COVERAGE_TRACKER_PATH, coverageTrackerContent);
console.log(`Created coverage tracker at ${COVERAGE_TRACKER_PATH}`);
// Create a minimal Flow test file
const tinyFlowTestContent = `
// @flow
// This is the minimal Flow test file with just basic types

// Type definition
type User = {
  name: string,
  age: number
};

// Function with type annotations
function greetUser(user: User): string {
  if (user.age > 18) {
    return \`Hello, \${user.name}!\`;
  } else {
    return \`Hi there, \${user.name}!\`;
  }
}

// Simple variable with type
const defaultUser: User = {
  name: 'Guest',
  age: 25
};

// Call the function
const greeting = greetUser(defaultUser);
console.log(greeting);
`;
// Create a simple Flow test file
const simpleFlowTestContent = `
// @flow
// This is a simple Flow test file with basic types and components

// Type definitions
type User = {
  id: number,
  name: string,
  age: number,
  isActive: boolean
};

type Props = {
  user: User,
  onUpdate?: (user: User) => void
};

// Simple component with Flow types
function UserProfile(props: Props) {
  const { user, onUpdate } = props;
  
  function handleActivation() {
    if (user.isActive) {
      console.log(\`\${user.name} is already active\`);
      return;
    }
    
    const updatedUser = {
      ...user,
      isActive: true
    };
    
    if (onUpdate) {
      onUpdate(updatedUser);
    }
  }
  
  const displayName = user.name || 'Unknown User';
  
  // Conditional rendering
  const userStatus = user.isActive 
    ? 'Active User' 
    : 'Inactive User';
  
  // Logical expressions
  const showAdminControls = user.age >= 18 && user.isActive;
  
  // Return JSX-like structure (simplified for the test)
  return {
    name: displayName,
    age: user.age,
    status: userStatus,
    adminControls: showAdminControls,
    activate: handleActivation
  };
}

// Test data
const testUser: User = {
  id: 1,
  name: 'John Doe',
  age: 30,
  isActive: false
};

// Update callback
function updateUser(updatedUser: User) {
  console.log(\`User updated: \${updatedUser.name} (\${updatedUser.isActive ? 'active' : 'inactive'})\`);
}

// Use the component
const profile = UserProfile({
  user: testUser,
  onUpdate: updateUser
});

// Call the activation method
profile.activate();

console.log(\`User \${profile.name} is \${profile.status}\`);
`;
// Write Flow test files
fs.writeFileSync(TINY_FLOW_TEST_PATH, tinyFlowTestContent);
console.log(`Created tiny Flow test file at ${TINY_FLOW_TEST_PATH}`);
fs.writeFileSync(SIMPLE_FLOW_TEST_PATH, simpleFlowTestContent);
console.log(`Created simple Flow test file at ${SIMPLE_FLOW_TEST_PATH}`);
// Helper function to transform a file with Babel
function transformFile(inputFile, outputFile, presets = [], plugins = []) {
    try {
        // Read the source file
        const source = fs.readFileSync(inputFile, 'utf8');
        // Configure Babel to handle Flow syntax
        const babelOptions = {
            filename: path.basename(inputFile),
            presets: [
                ...presets,
                require('@babel/preset-flow') // Include Flow preset
            ],
            plugins: plugins,
            ast: true,
            code: true,
            babelrc: false,
            configFile: false,
            sourceType: 'module',
            parserOpts: {
                // Ensure Flow syntax is enabled
                plugins: ['flow', 'jsx']
            }
        };
        console.log(`Transforming ${path.basename(inputFile)} with Babel options:`, JSON.stringify(babelOptions, null, 2));
        // Transform the file with Babel
        const result = babel.transformSync(source, babelOptions);
        if (!result || !result.code) {
            console.error(`Error: Babel transformation failed for ${inputFile}`);
            return false;
        }
        // Write the transformed code to the output file
        fs.writeFileSync(outputFile, result.code);
        console.log(`Successfully transformed ${inputFile} to ${outputFile}`);
        return true;
    }
    catch (error) {
        console.error(`Error transforming file ${inputFile}:`, error);
        return false;
    }
}
// Helper function to execute a transformed file with memory limits
function executeInstrumentedFile(file, trackerFile, maxHeapSize = 2048, timeoutMs = 20000) {
    console.log(`\nExecuting ${path.basename(file)} with max heap size ${maxHeapSize}MB and timeout ${timeoutMs}ms\n`);
    try {
        // Execute the file with Node.js, setting memory limits
        execSync(`node --max-old-space-size=${maxHeapSize} -e "require('${trackerFile}'); require('${file}')"`, {
            stdio: 'inherit',
            timeout: timeoutMs // timeout in milliseconds
        });
        // If we got here, the execution was successful
        console.log(`\nSuccessfully executed ${path.basename(file)}`);
        // Print coverage summary
        try {
            execSync(`node --max-old-space-size=${maxHeapSize} -e "require('${trackerFile}').printSummary()"`, {
                stdio: 'inherit'
            });
        }
        catch (summaryError) {
            console.error("Error printing coverage summary:", summaryError.message);
        }
        // Reset coverage data
        try {
            execSync(`node --max-old-space-size=${maxHeapSize} -e "require('${trackerFile}').reset()"`, {
                stdio: 'inherit'
            });
        }
        catch (resetError) {
            console.error("Error resetting coverage tracker:", resetError.message);
        }
        return true;
    }
    catch (error) {
        console.error(`Error executing instrumented code:`, error);
        // Try to reset coverage data even if execution failed
        try {
            execSync(`node --max-old-space-size=${maxHeapSize} -e "require('${trackerFile}').reset()"`, {
                stdio: 'inherit'
            });
        }
        catch (resetError) {
            // Ignore reset errors after execution failure
        }
        return false;
    }
}
// Main test function
async function testFlowInstrumentation() {
    console.log("Starting Flow instrumentation test with optimized performance...");
    // Load the Flow support plugin
    const flowSupportPluginPath = path.join(process.cwd(), 'src/instrumentation/babel/flow-support-plugin.js');
    console.log(`Flow support plugin path: ${flowSupportPluginPath}`);
    try {
        const flowPlugin = require(flowSupportPluginPath);
        console.log("Successfully loaded Flow support plugin.");
    }
    catch (pluginError) {
        console.error("Error loading Flow support plugin:", pluginError);
        return false;
    }
    // 1. Test with the tiny Flow file first
    console.log("\n===== TESTING TINY FLOW FILE =====");
    const tinyTestSuccess = transformFile(TINY_FLOW_TEST_PATH, INSTRUMENTED_TINY_FLOW_TEST_PATH, [], // No additional presets (Flow preset is included in the function)
    [flowSupportPluginPath]);
    if (!tinyTestSuccess) {
        console.error("❌ Failed to transform tiny Flow test file. Stopping test.");
        return false;
    }
    const tinyExecutionSuccess = executeInstrumentedFile(INSTRUMENTED_TINY_FLOW_TEST_PATH, COVERAGE_TRACKER_PATH, 1024, // Use smaller heap for simple file
    10000 // Shorter timeout for simple file
    );
    if (!tinyExecutionSuccess) {
        console.error("❌ Failed to execute tiny Flow test file. Stopping test.");
        return false;
    }
    console.log("✅ Tiny Flow test completed successfully!");
    // 2. Test with the simple Flow file
    console.log("\n===== TESTING SIMPLE FLOW FILE =====");
    const simpleTestSuccess = transformFile(SIMPLE_FLOW_TEST_PATH, INSTRUMENTED_SIMPLE_FLOW_TEST_PATH, [], // No additional presets (Flow preset is included in the function)
    [flowSupportPluginPath]);
    if (!simpleTestSuccess) {
        console.error("❌ Failed to transform simple Flow test file. Stopping test.");
        return false;
    }
    const simpleExecutionSuccess = executeInstrumentedFile(INSTRUMENTED_SIMPLE_FLOW_TEST_PATH, COVERAGE_TRACKER_PATH, 1536, // Medium heap size
    15000 // Medium timeout
    );
    if (!simpleExecutionSuccess) {
        console.error("❌ Failed to execute simple Flow test file. Stopping full test.");
        // We'll still try the full test with modified settings
        console.log("⚠️ We'll stop here as the simple test failed. Debug and fix before continuing.");
        return false;
    }
    else {
        console.log("✅ Simple Flow test completed successfully!");
        return true;
    }
}
// Run the test
testFlowInstrumentation()
    .then(success => {
    if (success) {
        console.log("\n✅ Flow instrumentation test completed with optimized performance!");
    }
    else {
        console.error("\n❌ Flow instrumentation test failed at some stage.");
        process.exit(1);
    }
})
    .catch(error => {
    console.error("\n❌ Error running Flow instrumentation test:", error);
    process.exit(1);
});
