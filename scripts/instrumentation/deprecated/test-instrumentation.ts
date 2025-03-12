/**
 * Test Coverage Instrumentation
 * 
 * This script tests the Babel instrumentation on a simple code snippet
 * to verify it works correctly.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { execSync } from 'child_process';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const babel = require('@babel/core');

const TEST_DIR = path.resolve(process.cwd(), '.instrumentation-test');

async function main() {
  try {
    // Create test directory
    await fs.mkdir(TEST_DIR, { recursive: true });
    console.log(`Created test directory: ${TEST_DIR}`);
    
    // Create a simple JS file to test instrumentation
    const testCode = `
      // Global variable for tracking
      global.COVERAGE_TRACKER = {
        trackBranch: function(component, id, type, outcome) {
          console.log(\`Branch \${id} in \${component} (\${type}) took path \${outcome}\`);
        },
        trackFunctionStart: function(component, name, id) {
          console.log(\`Function \${name} (\${id}) in \${component} started\`);
        },
        trackFunctionEnd: function(component, name, id) {
          console.log(\`Function \${name} (\${id}) in \${component} ended\`);
        },
        trackFunctionError: function(component, name, id) {
          console.log(\`Function \${name} (\${id}) in \${component} threw error\`);
        },
        trackJSXRender: function(component, id, type) {
          console.log(\`JSX \${type} (\${id}) in \${component} rendered\`);
        }
      };
      
      // Utility function to track execution (for testing short-circuit)
      function track(name, value) {
        console.log(\`Function \${name} executed with value \${value}\`);
        return value;
      }
      
      // Simple function with branches
      function test(value) {
        if (value > 10) {
          return "Greater than 10";
        } else {
          return "Less than or equal to 10";
        }
      }
      
      // Function with ternary expressions
      function formatValue(value) {
        // Simple ternary
        return value ? value.toString() : "Empty";
      }
      
      // Function with nested ternary expressions
      function getCategory(age) {
        return age < 13 ? "Child" : (age < 20 ? "Teenager" : "Adult");
      }
      
      // Function with ternary in variable assignment
      function classify(score) {
        const result = score > 70 ? "Pass" : "Fail";
        return result;
      }
      
      // Function with mixed conditions
      function evaluateData(a, b, c) {
        // If statement
        if (a > b) {
          return "A is bigger";
        }
        
        // Ternary expression
        return c ? "C is true" : "C is false";
      }
      
      // Function with logical AND (&&)
      function conditionalAnd(a, b) {
        // Simple logical AND
        return a && b ? "Both true" : "At least one false";
      }
      
      // Function with logical OR (||)
      function conditionalOr(a, b) {
        // Simple logical OR
        return a || b ? "At least one true" : "Both false";
      }
      
      // Function with short-circuit evaluation
      function shortCircuit(a, b) {
        // Short-circuit AND
        return track("first", a) && track("second", b) ? "Both executed" : "Short-circuited";
      }
      
      // Function with nested logical expressions
      function complexLogical(a, b, c) {
        // Nested logical expressions
        return (a && b) || c ? "Complex true" : "Complex false";
      }
      
      // Function with JSX-like conditional rendering pattern
      function renderConditional(condition, element) {
        // Simulates React's condition && <Component /> pattern
        return condition && element;
      }
      
      // Call functions to test
      console.log("=== If Statement Tests ===");
      console.log(test(5));
      console.log(test(15));
      
      console.log("\\n=== Simple Ternary Tests ===");
      console.log(formatValue(null));
      console.log(formatValue(42));
      
      console.log("\\n=== Nested Ternary Tests ===");
      console.log(getCategory(10));
      console.log(getCategory(16));
      console.log(getCategory(25));
      
      console.log("\\n=== Ternary in Assignment ===");
      console.log(classify(80));
      console.log(classify(50));
      
      console.log("\\n=== Mixed Condition Tests ===");
      console.log(evaluateData(10, 5, true));
      console.log(evaluateData(5, 10, false));
      
      console.log("\\n=== Logical AND Tests ===");
      console.log(conditionalAnd(true, true));
      console.log(conditionalAnd(true, false));
      console.log(conditionalAnd(false, true));
      
      console.log("\\n=== Logical OR Tests ===");
      console.log(conditionalOr(true, false));
      console.log(conditionalOr(false, true));
      console.log(conditionalOr(false, false));
      
      console.log("\\n=== Short-Circuit Tests ===");
      console.log(shortCircuit(true, true));
      console.log(shortCircuit(false, true));  // second shouldn't execute
      
      console.log("\\n=== Complex Logical Tests ===");
      console.log(complexLogical(true, true, false));
      console.log(complexLogical(false, false, true));
      console.log(complexLogical(false, false, false));
      
      console.log("\\n=== Conditional Rendering Pattern ===");
      console.log(renderConditional(true, "Element1"));
      console.log(renderConditional(false, "Element2"));  // shouldn't render
    `;
    
    // Write the test file
    const codePath = path.join(TEST_DIR, 'test-code.js');
    await fs.writeFile(codePath, testCode, 'utf8');
    console.log(`Created test file: ${codePath}`);
    
    // Import our instrumentation plugin (JavaScript version)
    try {
      // Configure Babel with our plugin
      const babelOptions = {
        plugins: [
          // Pass simplified options
          require('../src/instrumentation/babel/coverage-instrumentation-plugin')
        ],
        filename: 'test-code.js',
        babelrc: false,
        configFile: false, // Skip loading any config files
        sourceMaps: false
      };
      
      console.log('Running Babel transform on test code...');
      
      // Transform the code using Babel
      const transformResult = babel.transformSync(testCode, babelOptions);
      
      if (!transformResult || !transformResult.code) {
        throw new Error('Babel transform failed - no code was generated');
      }
      
      // Write the instrumented file for inspection
      const outputPath = path.join(TEST_DIR, 'test-code.instrumented.js');
      await fs.writeFile(outputPath, transformResult.code, 'utf8');
      console.log(`Transformed code written to: ${outputPath}`);
      
      // Run the instrumented code
      console.log('\nRunning instrumented code:');
      console.log('-------------------------------------------');
      
      try {
        // Execute the instrumented code
        execSync(`node ${outputPath}`, { stdio: 'inherit' });
        console.log('-------------------------------------------');
        console.log('Instrumented code ran successfully!');
      } catch (error) {
        console.error('Error running instrumented code:', error);
      }
      
      // Analyze the instrumented code
      console.log('\nInstrumentation analysis:');
      console.log('- Function tracking:', transformResult.code.includes('trackFunctionStart') ? 'YES' : 'NO');
      console.log('- If statement tracking:', transformResult.code.includes('trackBranch') && 
                                             transformResult.code.includes('"if"') ? 'YES' : 'NO');
      console.log('- Ternary tracking:', transformResult.code.includes('trackBranch') && 
                                        transformResult.code.includes('"ternary"') ? 'YES' : 'NO');
      console.log('- Logical expression tracking:', transformResult.code.includes('trackBranch') && 
                                                  transformResult.code.includes('"logical"') ? 'YES' : 'NO');
      
      // Count the number of instrumented branches
      const ifBranches = (transformResult.code.match(/"if"/g) || []).length;
      const ternaryBranches = (transformResult.code.match(/"ternary"/g) || []).length;
      const logicalBranches = (transformResult.code.match(/"logical"/g) || []).length;
      console.log(`- Instrumented branches: ${ifBranches} if statements, ${ternaryBranches} ternaries, ${logicalBranches} logical expressions`);
      
      // Print summary
      console.log('\nInstrumentation test complete!');
      
    } catch (error) {
      console.error('Error running Babel transform:', error);
    }
    
  } catch (error) {
    console.error('Error testing instrumentation:', error);
  }
}

main().catch(console.error); 