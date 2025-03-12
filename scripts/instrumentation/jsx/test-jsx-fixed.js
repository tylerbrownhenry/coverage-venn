/**
 * Test JSX instrumentation with the fixed plugin
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
  
  getReport() {
    return {
      functions: this.functions,
      branches: this.branches
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
  }
};

module.exports = COVERAGE_TRACKER;
`);

// Create test JSX file
const testJSXFile = path.join(TEST_DIR, 'test-jsx.jsx');
fs.writeFileSync(testJSXFile, `
// Import React (normally required for JSX)
// This is just for testing babel transformation, we don't actually run this file directly
const React = { createElement: (...args) => args };

// Simple component with JSX
function Button({ text, onClick }) {
  return (
    <button className="btn" onClick={onClick}>
      {text}
    </button>
  );
}

// Component with conditional rendering
function ConditionalComponent({ condition, value }) {
  return (
    <div>
      {condition ? (
        <span className="true-case">{value}</span>
      ) : (
        <span className="false-case">No value</span>
      )}
    </div>
  );
}

// Component with function and JSX together
function ComplexComponent({ items, onItemClick }) {
  const handleItemClick = (item) => {
    console.log('Item clicked:', item);
    onItemClick(item);
  };

  return (
    <div className="list-container">
      <h2>Items List</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id} onClick={() => handleItemClick(item)}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Export for completeness
export { Button, ConditionalComponent, ComplexComponent };
`);

// Prepare @babel/preset-react configuration
const babelConfigFile = path.join(TEST_DIR, 'babel.config.json');
fs.writeFileSync(babelConfigFile, JSON.stringify({
  "presets": ["@babel/preset-react"]
}, null, 2));

// Instrument the code
console.log('Instrumenting JSX with fixed plugin...');
try {
  // Verify plugin exists
  if (!fs.existsSync(PLUGIN_PATH)) {
    console.error(`Fixed plugin not found at: ${PLUGIN_PATH}`);
    process.exit(1);
  }
  
  // Check if @babel/preset-react is installed
  try {
    require.resolve('@babel/preset-react');
  } catch (error) {
    console.error('@babel/preset-react is required but not installed. Please install it first.');
    process.exit(1);
  }
  
  const result = babel.transformFileSync(testJSXFile, {
    presets: ['@babel/preset-react'],
    plugins: [PLUGIN_PATH],
    filename: 'test-jsx.jsx'
  });
  
  if (result && result.code) {
    const instrumentedFile = path.join(TEST_DIR, 'instrumented-jsx.js');
    fs.writeFileSync(instrumentedFile, result.code);
    console.log(`Instrumented JSX code written to: ${instrumentedFile}`);
    
    // Since we can't directly run JSX, just display some info
    console.log('\nJSX Instrumentation results:');
    console.log('-------------------------------------------');
    console.log('Successfully transformed JSX code with the fixed plugin.');
    console.log('The instrumented code is available for inspection at:');
    console.log(instrumentedFile);
    console.log('-------------------------------------------');
  } else {
    console.error('Failed to transform JSX code with the fixed plugin');
  }
} catch (error) {
  console.error('Error during JSX instrumentation test:', error.message);
  if (error.stack) {
    console.error(error.stack.split('\n').slice(0, 3).join('\n'));
  }
} 