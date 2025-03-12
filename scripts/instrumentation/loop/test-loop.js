/**
 * Test Loop instrumentation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const babel = require('@babel/core');

// Set up test environment
const TEST_DIR = path.resolve(__dirname, 'temp');
const PLUGIN_PATH = path.resolve(__dirname, 'loop-plugin.js');

// Create test directory
if (!fs.existsSync(TEST_DIR)) {
  fs.mkdirSync(TEST_DIR, { recursive: true });
}

// Create coverage tracker file
const coverageTrackerFile = path.join(TEST_DIR, 'coverage-tracker.js');
fs.writeFileSync(coverageTrackerFile, `
// Coverage tracker for Loop instrumentation
const COVERAGE_TRACKER = {
  loops: {},
  
  trackLoop(component, loopId, ...args) {
    const key = \`\${component}:\${loopId}\`;
    
    if (!this.loops[key]) {
      this.loops[key] = {
        executions: 0
      };
    }
    
    this.loops[key].executions++;
    console.log(\`Loop (id: \${loopId}) in \${component} executed\`);
    
    return args[0]; // Return first argument for chaining
  },
  
  printReport() {
    console.log('\\nCoverage Report:');
    console.log('-----------------');
    
    console.log('\\nLoops:');
    for (const key in this.loops) {
      const [component, id] = key.split(':');
      console.log(\`  Loop \${id} in \${component}: \${this.loops[key].executions} executions\`);
    }
  }
};

module.exports = COVERAGE_TRACKER;
`);

// Create test file with Loop examples
const testFile = path.join(TEST_DIR, 'test-loop.js');
fs.writeFileSync(testFile, `
// Import coverage tracker
const COVERAGE_TRACKER = require('./coverage-tracker');

// Add sample code with Loop statements here
// For example:
/* 
function testLoop() {
  // Loop code to test
}

// Run test function
testLoop(); 
*/

// Print coverage report
COVERAGE_TRACKER.printReport();
`);

// Instrument the code
console.log('Instrumenting Loop with plugin...');
try {
  // Verify plugin exists
  if (!fs.existsSync(PLUGIN_PATH)) {
    console.error(`Plugin not found at: ${PLUGIN_PATH}`);
    process.exit(1);
  }
  
  const result = babel.transformFileSync(testFile, {
    plugins: [PLUGIN_PATH],
    filename: 'test-loop.js'
  });
  
  if (result && result.code) {
    const instrumentedFile = path.join(TEST_DIR, 'instrumented-loop.js');
    fs.writeFileSync(instrumentedFile, result.code);
    console.log(`Instrumented code written to: ${instrumentedFile}`);
    
    // Run the instrumented code
    console.log('\nRunning instrumented code:');
    console.log('-------------------------------------------');
    
    execSync(`node ${instrumentedFile}`, { stdio: 'inherit' });
    
    console.log('-------------------------------------------');
    console.log('Loop instrumentation test completed successfully!');
  } else {
    console.error('Failed to transform code with the plugin');
  }
} catch (error) {
  console.error('Error during Loop instrumentation test:', error.message);
  if (error.stack) {
    console.error(error.stack.split('\n').slice(0, 3).join('\n'));
  }
} 