"use strict";
/**
 * Test Function Instrumentation
 *
 * This script tests the Babel instrumentation for function tracking
 * to verify it works correctly with various function patterns.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const babel = require('@babel/core');
const TEST_DIR = path.resolve(process.cwd(), '.instrumentation-test/function-test');
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
        
        trackFunctionStart(component, name, id) {
          const key = \`\${component}:\${name}:\${id}\`;
          if (!this.coverageData.functions[key]) {
            this.coverageData.functions[key] = { 
              count: 0,
              completed: 0,
              errors: 0
            };
          }
          
          this.coverageData.functions[key].count++;
          console.log(\`Function \${name} (\${id}) in \${component} started\`);
        },
        
        trackFunctionEnd(component, name, id) {
          const key = \`\${component}:\${name}:\${id}\`;
          if (this.coverageData.functions[key]) {
            this.coverageData.functions[key].completed++;
          }
          console.log(\`Function \${name} (\${id}) in \${component} ended\`);
        },
        
        trackFunctionError(component, name, id) {
          const key = \`\${component}:\${name}:\${id}\`;
          if (this.coverageData.functions[key]) {
            this.coverageData.functions[key].errors++;
          }
          console.log(\`Function \${name} (\${id}) in \${component} threw error\`);
        },
        
        trackTry(component, id, blockType) {
          const key = \`\${component}:\${id}:\${blockType}\`;
          if (!this.coverageData.tryCatch[key]) {
            this.coverageData.tryCatch[key] = { 
              tryCount: 0,
              catchCount: 0,
              finallyCount: 0
            };
          }
          
          this.coverageData.tryCatch[key].tryCount++;
          console.log(\`Try block \${id} in \${component} executed\`);
        },
        
        trackCatch(component, id, blockType) {
          const key = \`\${component}:\${id}:\${blockType}\`;
          if (!this.coverageData.tryCatch[key]) {
            this.coverageData.tryCatch[key] = { 
              tryCount: 0,
              catchCount: 0,
              finallyCount: 0
            };
          }
          
          this.coverageData.tryCatch[key].catchCount++;
          console.log(\`Catch block \${id} in \${component} executed\`);
        },
        
        trackFinally(component, id, blockType) {
          const key = \`\${component}:\${id}:\${blockType}\`;
          if (!this.coverageData.tryCatch[key]) {
            this.coverageData.tryCatch[key] = { 
              tryCount: 0,
              catchCount: 0,
              finallyCount: 0
            };
          }
          
          this.coverageData.tryCatch[key].finallyCount++;
          console.log(\`Finally block \${id} in \${component} executed\`);
        },
        
        getCoverageReport() {
          return this.coverageData;
        }
      };
      
      module.exports = global.COVERAGE_TRACKER;
    `;
        const trackerPath = path.join(TEST_DIR, 'coverage-tracker.js');
        await fs.writeFile(trackerPath, coverageTrackerModule, 'utf8');
        console.log(`Created coverage tracker at: ${trackerPath}`);
        // Create a test file with various function patterns
        const testCode = `
      // Import the coverage tracker
      const COVERAGE_TRACKER = require('./coverage-tracker');
      
      /**
       * This is a test file for function instrumentation
       * with various function patterns.
       */
      
      // 1. Regular function declaration
      function regularFunction(a, b) {
        return a + b;
      }
      
      // 2. Named function with complex body
      function complexFunction(items) {
        const result = [];
        
        for (let i = 0; i < items.length; i++) {
          if (items[i] > 0) {
            result.push(items[i] * 2);
          } else {
            result.push(0);
          }
        }
        
        return result;
      }
      
      // 3. Function with error handling
      function errorProneFunction(value) {
        try {
          if (typeof value !== 'number') {
            throw new Error('Value must be a number');
          }
          return value * 2;
        } catch (e) {
          console.error('Error in errorProneFunction:', e.message);
          return 0;
        }
      }
      
      // 4. Arrow function with expression body
      const arrowExpressionFn = (x) => x * x;
      
      // 5. Arrow function with block body
      const arrowBlockFn = (x) => {
        const y = x * 2;
        return y + 1;
      };
      
      // 6. Arrow function in object
      const obj = {
        name: 'Test Object',
        getValue: (x) => x * 3,
        calculate: function(a, b) {
          return a * b;
        }
      };
      
      // 7. Async function
      async function asyncFunction(value) {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 10));
        return value * 3;
      }
      
      // 8. Immediately invoked function expression (IIFE)
      const result = (function(x) {
        return x + 5;
      })(10);
      
      // Test functions with different arguments
      console.log('=== Testing Regular Function ===');
      console.log(regularFunction(5, 3));
      
      console.log('\\n=== Testing Complex Function ===');
      console.log(complexFunction([1, -2, 3, 0, 5]));
      
      console.log('\\n=== Testing Error Prone Function ===');
      console.log(errorProneFunction(10));
      console.log(errorProneFunction('not a number')); // This should trigger the error handler
      
      console.log('\\n=== Testing Arrow Functions ===');
      console.log(arrowExpressionFn(4));
      console.log(arrowBlockFn(5));
      
      console.log('\\n=== Testing Object Methods ===');
      console.log(obj.getValue(3));
      console.log(obj.calculate(4, 5));
      
      console.log('\\n=== Testing Async Function ===');
      // For simplicity, we'll use a promise handler for the async function
      asyncFunction(7).then(result => {
        console.log(result);
        
        // Output the coverage report after all tests have completed
        console.log('\\n=== Generating Coverage Report ===');
        const coverageReport = COVERAGE_TRACKER.getCoverageReport();
        
        // Summary statistics
        const jsxElementCount = Object.keys(coverageReport.jsxElements).length;
        const branchCount = Object.keys(coverageReport.branches).length;
        const functionCount = Object.keys(coverageReport.functions).length;
        
        // Analyze the report
        console.log('\\nInstrumentation Results:');
        
        // JSX elements tracked
        if (jsxElementCount > 0) {
          console.log('\\nJSX Elements Tracked:');
          Object.entries(coverageReport.jsxElements).forEach(([key, data]) => {
            console.log(\`  - \${key}: rendered \${data.count} time(s)\`);
          });
        }
        
        // Branches tracked
        if (branchCount > 0) {
          console.log('\\nBranches Tracked:');
          Object.entries(coverageReport.branches).forEach(([key, data]) => {
            const outcomes = Object.entries(data.outcomes)
              .map(([outcome, count]) => \`path \${outcome}: \${count} time(s)\`)
              .join(', ');
            console.log(\`  - \${key}: executed \${data.count} time(s) [\${outcomes}]\`);
          });
        }
        
        // Functions tracked
        if (functionCount > 0) {
          console.log('\\nFunctions Tracked:');
          Object.entries(coverageReport.functions).forEach(([key, data]) => {
            console.log(\`  - \${key}: started \${data.count} time(s), completed \${data.completed} time(s), errors \${data.errors} time(s)\`);
          });
        }
        
        console.log(\`\\nCoverage Summary:
- JSX Elements Tracked: \${jsxElementCount}
- Branches Tracked: \${branchCount}
- Functions Tracked: \${functionCount}
\`);
      });
      
      console.log('\\n=== Testing IIFE Result ===');
      console.log(result);
    `;
        const testFilePath = path.join(TEST_DIR, 'function-test.js');
        await fs.writeFile(testFilePath, testCode, 'utf8');
        console.log(`Created test file at: ${testFilePath}`);
        // Create a file that our plugin will instrument
        const instrumentationTestPath = path.join(TEST_DIR, 'function-test.js');
        // Configure Babel with our plugin
        const babelOptions = {
            plugins: [
                // Our instrumentation plugin
                require('../src/instrumentation/babel/coverage-instrumentation-plugin')
            ],
            babelrc: false,
            configFile: false
        };
        console.log('Instrumenting code with Babel...');
        // Transform with Babel
        const result = babel.transformSync(testCode, {
            ...babelOptions,
            filename: 'function-test.js'
        });
        if (result && result.code) {
            // Write the instrumented code
            const instrumentedPath = path.join(TEST_DIR, 'instrumented-function-test.js');
            await fs.writeFile(instrumentedPath, result.code, 'utf8');
            console.log('Instrumented code written to:', instrumentedPath);
            // Run the instrumented code
            console.log('\nRunning instrumented code:');
            console.log('-------------------------------------------');
            try {
                (0, child_process_1.execSync)(`cd ${TEST_DIR} && node instrumented-function-test.js`, { stdio: 'inherit' });
                console.log('-------------------------------------------');
                console.log('Function instrumentation test completed successfully!');
            }
            catch (error) {
                console.error('Error running function test:', error);
            }
        }
        else {
            console.error('Failed to transform code with our plugin');
        }
    }
    catch (error) {
        console.error('Error testing function instrumentation:', error);
    }
}
main().catch(console.error);
