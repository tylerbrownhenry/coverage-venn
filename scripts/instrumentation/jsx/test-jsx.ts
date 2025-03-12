/**
 * Test JSX Coverage Instrumentation
 * 
 * This script tests the Babel instrumentation on a simple code snippet
 * that simulates JSX structure without requiring JSX syntax.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { execSync } from 'child_process';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const babel = require('@babel/core');

const TEST_DIR = path.resolve(__dirname, 'temp');

async function main() {
  try {
    // Create test directory
    await fs.mkdir(TEST_DIR, { recursive: true });
    console.log(`Created test directory: ${TEST_DIR}`);
    
    // Create a mock coverage tracker module
    const coverageTrackerModule = `
      // Global coverage tracker for our instrumentation
      global.COVERAGE_TRACKER = {
        coverageData: {
          branches: {},
          jsxElements: {},
          functions: {}
        },
        
        trackBranch(component, id, type, outcome) {
          const key = \`\${component}:\${id}:\${type}\`;
          if (!this.coverageData.branches[key]) {
            this.coverageData.branches[key] = { count: 0, outcomes: {} };
          }
          
          this.coverageData.branches[key].count++;
          
          const outcomeKey = outcome.toString();
          if (!this.coverageData.branches[key].outcomes[outcomeKey]) {
            this.coverageData.branches[key].outcomes[outcomeKey] = 0;
          }
          
          this.coverageData.branches[key].outcomes[outcomeKey]++;
          
          console.log(\`Branch \${id} in \${component} (\${type}) took path \${outcome}\`);
          return outcome; // Return to not interfere with code logic
        },
        
        trackJSXRender(component, id, elementType) {
          const key = \`\${component}:\${id}:\${elementType}\`;
          if (!this.coverageData.jsxElements[key]) {
            this.coverageData.jsxElements[key] = { count: 0 };
          }
          
          this.coverageData.jsxElements[key].count++;
          console.log(\`JSX \${elementType} (\${id}) in \${component} rendered\`);
          return true; // Return a value to not break the code flow
        },
        
        trackFunction(component, id, name) {
          const key = \`\${component}:\${id}:\${name}\`;
          if (!this.coverageData.functions[key]) {
            this.coverageData.functions[key] = { count: 0 };
          }
          
          this.coverageData.functions[key].count++;
          console.log(\`Function \${name} (\${id}) in \${component} called\`);
          return true; // Return a value to not break the code flow
        },
        
        getReport() {
          return this.coverageData;
        }
      };
      
      module.exports = global.COVERAGE_TRACKER;
    `;
    
    const coverageTrackerPath = path.join(TEST_DIR, 'coverage-tracker.js');
    await fs.writeFile(coverageTrackerPath, coverageTrackerModule, 'utf8');
    
    // Create a simple test component that we'll instrument
    const instrumentationTestCode = `
      // Test component with conditional rendering similar to JSX
      function TestComponent(props) {
        // Extract props with defaults
        const {
          condition = false,
          value = 0,
          showDetails = false
        } = props;
        
        // Create a wrapper element (like a React component)
        const wrapper = {
          type: 'div',
          props: { className: 'test-component' },
          children: []
        };
        
        // Conditional rendering similar to how JSX works
        if (condition) {
          // This is like rendering: <h1>Condition is true</h1>
          wrapper.children.push({
            type: 'h1',
            props: {},
            children: ['Condition is true']
          });
        } else {
          // This is like rendering: <h2>Value is: {value}</h2>
          wrapper.children.push({
            type: 'h2',
            props: {},
            children: ['Value is: ' + value]
          });
          
          // Nested conditional (like in JSX)
          if (showDetails && value > 10) {
            // This is like rendering: <p>This is a high value!</p>
            wrapper.children.push({
              type: 'p',
              props: { className: 'highlight' },
              children: ['This is a high value!']
            });
          } else if (showDetails) {
            // This is like rendering: <p>This is a regular value.</p>
            wrapper.children.push({
              type: 'p',
              props: {},
              children: ['This is a regular value.']
            });
          }
        }
        
        return wrapper;
      }
      
      // Test the component
      console.log(TestComponent({ condition: true }));
      console.log(TestComponent({ condition: false, value: 15, showDetails: true }));
      console.log(TestComponent({ condition: false, value: 5, showDetails: false }));
    `;
    
    const instrumentationTestPath = path.join(TEST_DIR, 'instrumentation-test.js');
    await fs.writeFile(instrumentationTestPath, instrumentationTestCode, 'utf8');
    
    // Configure Babel with our plugin
    const babelOptions = {
      plugins: [
        // Our instrumentation plugin
        require('./coverage-instrumentation-plugin')
      ],
      babelrc: false,
      configFile: false
    };
    
    // Transform with Babel
    const result = babel.transformSync(instrumentationTestCode, {
      ...babelOptions,
      filename: 'instrumentation-test.js'
    });
    
    if (result && result.code) {
      // Write the instrumented code
      const instrumentedPath = path.join(TEST_DIR, 'instrumented-test.js');
      await fs.writeFile(instrumentedPath, `
        // Import the coverage tracker
        const COVERAGE_TRACKER = require('./coverage-tracker');
        
        ${result.code}
      `, 'utf8');
      
      console.log('Instrumented code written to:', instrumentedPath);
      
      // Run the instrumented code
      console.log('\nRunning instrumented code:');
      console.log('-------------------------------------------');
      
      execSync(`cd ${TEST_DIR} && node instrumented-test.js`, { stdio: 'inherit' });
      
      console.log('-------------------------------------------');
      console.log('Instrumentation test completed successfully!');
    } else {
      console.error('Failed to transform code with our plugin');
    }
  } catch (error) {
    console.error('Error testing JSX instrumentation:', error);
  }
}

main().catch(console.error); 