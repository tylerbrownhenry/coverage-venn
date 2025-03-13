"use strict";
/**
 * Test JSX Coverage Instrumentation
 *
 * This script tests the Babel instrumentation on a simple code snippet
 * that simulates JSX structure without requiring JSX syntax.
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
const TEST_DIR = path.resolve(process.cwd(), '.instrumentation-test/jsx-test');
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
        
        getCoverageReport() {
          return this.coverageData;
        }
      };
      
      module.exports = global.COVERAGE_TRACKER;
    `;
        const trackerPath = path.join(TEST_DIR, 'coverage-tracker.js');
        await fs.writeFile(trackerPath, coverageTrackerModule, 'utf8');
        console.log(`Created coverage tracker at: ${trackerPath}`);
        // Create a test file with simulated JSX structure
        const testCode = `
      // Import the coverage tracker
      const COVERAGE_TRACKER = require('./coverage-tracker');
      
      /**
       * This is a simulated JSX test that doesn't use actual JSX syntax
       * but still tests our instrumentation plugin's JSX tracking capabilities.
       */
      
      // Simulate a React.createElement call that our plugin would instrument
      function createElement(type, props, ...children) {
        // This would be instrumented by our plugin in a real JSX context
        COVERAGE_TRACKER.trackJSXRender('TestComponent', 1, type);
        return { type, props, children };
      }
      
      // Simulate a simple component
      function SimpleComponent(props) {
        // Conditional rendering with if statement
        if (props.showHeader) {
          return createElement('div', { className: 'header' },
            createElement('h1', null, 'Header')
          );
        }
        
        // Conditional rendering with ternary
        const content = props.items.length > 0 
          ? createElement('ul', null, 
              ...props.items.map((item, index) => 
                createElement('li', { key: index }, item)
              )
            )
          : createElement('p', null, 'No items');
        
        // Conditional rendering with logical AND
        const footer = props.showFooter && 
          createElement('footer', null, 'Footer content');
        
        // Return the main component structure
        return createElement('div', { className: 'container' },
          createElement('h2', null, props.title || 'Default Title'),
          content,
          footer
        );
      }
      
      // Test the component with different props
      console.log('=== Testing with header ===');
      SimpleComponent({ showHeader: true });
      
      console.log('\\n=== Testing with items ===');
      SimpleComponent({ 
        showHeader: false, 
        title: 'Item List', 
        items: ['Item 1', 'Item 2', 'Item 3'],
        showFooter: true
      });
      
      console.log('\\n=== Testing with no items ===');
      SimpleComponent({ 
        showHeader: false, 
        items: [],
        showFooter: false
      });
      
      // Generate a coverage report
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
    `;
        const testFilePath = path.join(TEST_DIR, 'jsx-simulation-test.js');
        await fs.writeFile(testFilePath, testCode, 'utf8');
        console.log(`Created test file at: ${testFilePath}`);
        // Run the test
        console.log('\nRunning JSX simulation test:');
        console.log('-------------------------------------------');
        try {
            // Execute the test
            (0, child_process_1.execSync)(`cd ${TEST_DIR} && node jsx-simulation-test.js`, { stdio: 'inherit' });
            console.log('-------------------------------------------');
            console.log('JSX simulation test completed successfully!');
            // Now let's test our actual instrumentation plugin
            console.log('\nTesting instrumentation plugin with simulated JSX:');
            // Create a file that our plugin will instrument
            const instrumentationTestCode = `
        // This file will be instrumented by our plugin
        
        function TestComponent(props) {
          // If statement
          if (props.condition) {
            return "Condition is true";
          }
          
          // Ternary expression
          const result = props.value > 10 ? "Greater than 10" : "Less than or equal to 10";
          
          // Logical expression
          const showExtra = props.showDetails && "Extra details";
          
          return result;
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
                    require('../src/instrumentation/babel/coverage-instrumentation-plugin')
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
                (0, child_process_1.execSync)(`cd ${TEST_DIR} && node instrumented-test.js`, { stdio: 'inherit' });
                console.log('-------------------------------------------');
                console.log('Instrumentation test completed successfully!');
            }
            else {
                console.error('Failed to transform code with our plugin');
            }
        }
        catch (error) {
            console.error('Error running test:', error);
        }
    }
    catch (error) {
        console.error('Error testing JSX instrumentation:', error);
    }
}
main().catch(console.error);
