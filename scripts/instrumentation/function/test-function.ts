/**
 * Test Function Instrumentation
 * 
 * This script tests the Babel instrumentation for function tracking
 * to verify it works correctly with various function patterns.
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
          functions: {},
          tryCatch: {}
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
        
        trackFunctionStart(funcName, component, id) {
          const key = \`\${component}:\${id}:\${funcName}\`;
          if (!this.coverageData.functions[key]) {
            this.coverageData.functions[key] = { 
              count: 0,
              calls: []
            };
          }
          
          this.coverageData.functions[key].count++;
          console.log(\`Function \${funcName} (id: \${id}) in \${component} started\`);
          return true;
        },
        
        trackFunctionEnd(funcName, component, id) {
          console.log(\`Function \${funcName} (id: \${id}) in \${component} completed\`);
          return true;
        },
        
        trackFunctionError(funcName, component, id) {
          console.log(\`Function \${funcName} (id: \${id}) in \${component} encountered an error\`);
          return true;
        },
        
        trackFunction(component, id, functionName, params) {
          const key = \`\${component}:\${id}:\${functionName}\`;
          if (!this.coverageData.functions[key]) {
            this.coverageData.functions[key] = { 
              count: 0,
              calls: []
            };
          }
          
          this.coverageData.functions[key].count++;
          this.coverageData.functions[key].calls.push({
            timestamp: Date.now(),
            params: params || []
          });
          
          console.log(\`Function \${functionName} (\${id}) in \${component} called\`);
          return true;
        },
        
        trackTryCatch(component, id, blockType, status) {
          const key = \`\${component}:\${id}:\${blockType}\`;
          if (!this.coverageData.tryCatch[key]) {
            this.coverageData.tryCatch[key] = {
              count: 0,
              try: 0,
              catch: 0,
              finally: 0
            };
          }
          
          this.coverageData.tryCatch[key].count++;
          this.coverageData.tryCatch[key][status]++;
          
          console.log(\`Try/Catch block \${id} in \${component} entered \${status} section\`);
          return true;
        },
        
        getReport() {
          return this.coverageData;
        }
      };
      
      module.exports = global.COVERAGE_TRACKER;
    `;
    
    const coverageTrackerPath = path.join(TEST_DIR, 'coverage-tracker.js');
    await fs.writeFile(coverageTrackerPath, coverageTrackerModule, 'utf8');
    
    // Create a file that our plugin will instrument
    const testFunctionCode = `
      // ------------------------------------
      // Standard function declarations
      // ------------------------------------
      
      // Named function declaration
      function add(a, b) {
        return a + b;
      }
      
      // Function with multiple parameters and default values
      function greet(name, greeting = "Hello") {
        return \`\${greeting}, \${name}!\`;
      }
      
      // Function with rest parameters
      function sum(...numbers) {
        return numbers.reduce((total, num) => total + num, 0);
      }
      
      // Function with destructuring
      function processUser({ name, age }) {
        return \`\${name} is \${age} years old.\`;
      }
      
      // Nested function
      function outer(x) {
        function inner(y) {
          return x + y;
        }
        return inner(10);
      }
      
      // ------------------------------------
      // Arrow functions
      // ------------------------------------
      
      // Basic arrow function
      const multiply = (a, b) => a * b;
      
      // Arrow function with block body
      const getFullName = (first, last) => {
        const title = "Mr.";
        return \`\${title} \${first} \${last}\`;
      };
      
      // Arrow function with implicit return of object
      const createPerson = (name, age) => ({ name, age });
      
      // ------------------------------------
      // Function expressions
      // ------------------------------------
      
      // Named function expression
      const factorial = function fact(n) {
        if (n <= 1) return 1;
        return n * fact(n - 1);
      };
      
      // Anonymous function expression
      const divide = function(a, b) {
        if (b === 0) throw new Error("Cannot divide by zero");
        return a / b;
      };
      
      // IIFE (Immediately Invoked Function Expression)
      const result = (function() {
        const x = 10;
        const y = 20;
        return x + y;
      })();
      
      // Function as callback
      [1, 2, 3].map(function(num) {
        return num * 2;
      });
      
      // Function with internal function calls
      function processData(data) {
        function validate(item) {
          return item !== null && item !== undefined;
        }
        
        function transform(item) {
          return item * 2;
        }
        
        return data.filter(validate).map(transform);
      }
      
      // ------------------------------------
      // Test calls
      // ------------------------------------
      
      console.log("Testing function instrumentation:");
      console.log("---------------------------------");
      
      console.log("add(5, 3):", add(5, 3));
      console.log("greet('World'):", greet('World'));
      console.log("greet('Universe', 'Greetings'):", greet('Universe', 'Greetings'));
      console.log("sum(1, 2, 3, 4, 5):", sum(1, 2, 3, 4, 5));
      console.log("processUser({ name: 'John', age: 30 }):", processUser({ name: 'John', age: 30 }));
      console.log("outer(5):", outer(5));
      console.log("multiply(4, 6):", multiply(4, 6));
      console.log("getFullName('John', 'Doe'):", getFullName('John', 'Doe'));
      console.log("createPerson('Alice', 25):", createPerson('Alice', 25));
      console.log("factorial(5):", factorial(5));
      console.log("divide(10, 2):", divide(10, 2));
      console.log("result:", result);
      console.log("processData([1, 2, null, 3]):", processData([1, 2, null, 3]));
      
      console.log("---------------------------------");
      console.log("Function instrumentation test completed");
    `;
    
    const testFunctionPath = path.join(TEST_DIR, 'test-functions.js');
    await fs.writeFile(testFunctionPath, testFunctionCode, 'utf8');
    
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
    try {
      const result = babel.transformSync(testFunctionCode, {
        ...babelOptions,
        filename: 'test-functions.js'
      });
      
      if (result && result.code) {
        // Write the instrumented code
        const instrumentedPath = path.join(TEST_DIR, 'instrumented-functions.js');
        await fs.writeFile(instrumentedPath, `
          // Import the coverage tracker
          const COVERAGE_TRACKER = require('./coverage-tracker');
          
          ${result.code}
        `, 'utf8');
        
        console.log('Instrumented code written to:', instrumentedPath);
        
        // Run the instrumented code
        console.log('\nRunning instrumented code:');
        console.log('-------------------------------------------');
        
        execSync(`cd ${TEST_DIR} && node instrumented-functions.js`, { stdio: 'inherit' });
        
        console.log('-------------------------------------------');
        console.log('Function instrumentation test completed successfully!');
      } else {
        console.error('Failed to transform code with our plugin');
      }
    } catch (error: any) {
      console.error('Error during code transformation:', error.message);
      
      if (error.code === 'BABEL_TRANSFORM_ERROR' && error.message.includes('Maximum call stack size exceeded')) {
        console.error('\nDetected a stack overflow issue with the plugin.');
        console.error('This could be due to circular references or excessive recursion in the plugin.');
        
        // Create a minimal test to see if the plugin works with simpler input
        const minimalTest = `
          function add(a, b) {
            return a + b;
          }
          console.log(add(1, 2));
        `;
        
        try {
          console.log('\nTrying a minimal test case...');
          const minResult = babel.transformSync(minimalTest, {
            ...babelOptions,
            filename: 'minimal-test.js'
          });
          
          if (minResult && minResult.code) {
            console.log('Minimal test transformation successful!');
            console.log('This indicates the plugin works but struggles with complex input.');
            
            // Write the minimal transformed code for inspection
            const minimalPath = path.join(TEST_DIR, 'minimal-instrumented.js');
            await fs.writeFile(minimalPath, minResult.code, 'utf8');
            console.log(`Minimal instrumented code written to: ${minimalPath}`);
          }
        } catch (minError: any) {
          console.error('Even minimal test failed:', minError.message);
        }
      }
    }
  } catch (error) {
    console.error('Error testing function instrumentation:', error);
  }
}

main().catch(console.error); 