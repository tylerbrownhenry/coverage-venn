
        // Import the coverage tracker
        const COVERAGE_TRACKER = require('./coverage-tracker');
        
        // Mock React for Node.js environment
        global.React = require('./react');
        
        console.log('Preparing to test instrumented components...');
        
        // This is a simplified test runner
        // In a real environment, this would render the components
        
        try {
          // Import all instrumented components
          console.log('Importing components...');
          
          // Import the JavaScript versions - note these are now CommonJS modules
          const SimpleComponent = require('./src/components/SimpleComponent.js');
          const ConditionalComponent = require('./src/components/ConditionalComponent.js');
          const NestedComponent = require('./src/components/NestedComponent.js');
          const PropsComponent = require('./src/components/PropsComponent.js');
          const DynamicComponent = require('./src/components/DynamicComponent.js');
          
          // Create dummy props for testing
          console.log('=== Testing SimpleComponent ===');
          SimpleComponent.default();
          
          console.log('\n=== Testing ConditionalComponent ===');
          ConditionalComponent.default({ condition: true });
          ConditionalComponent.default({ condition: false });
          
          console.log('\n=== Testing NestedComponent ===');
          NestedComponent.default();
          
          console.log('\n=== Testing PropsComponent ===');
          PropsComponent.default({ 
            title: 'Test Title', 
            description: 'Test Description', 
            items: ['item1', 'item2', 'item3'] 
          });
          PropsComponent.default({ items: [] });
          
          console.log('\n=== Testing DynamicComponent ===');
          DynamicComponent.default({ count: 2 });
          
          // Generate a coverage report
          console.log('\n=== Generating Coverage Report ===');
          const coverageReport = COVERAGE_TRACKER.getCoverageReport();
          
          // Summary statistics
          const jsxElementCount = Object.keys(coverageReport.jsxElements).length;
          const branchCount = Object.keys(coverageReport.branches).length;
          const functionCount = Object.keys(coverageReport.functions).length;
          
          // Analyze the report
          console.log('\nInstrumentation Results:');
          
          // JSX elements tracked
          if (jsxElementCount > 0) {
            console.log('\nJSX Elements Tracked:');
            Object.entries(coverageReport.jsxElements).forEach(([key, data]) => {
              console.log(`  - ${key}: rendered ${data.count} time(s)`);
            });
          }
          
          // Branches tracked
          if (branchCount > 0) {
            console.log('\nBranches Tracked:');
            Object.entries(coverageReport.branches).forEach(([key, data]) => {
              const outcomes = Object.entries(data.outcomes)
                .map(([outcome, count]) => `path ${outcome}: ${count} time(s)`)
                .join(', ');
              console.log(`  - ${key}: executed ${data.count} time(s) [${outcomes}]`);
            });
          }
          
          // Functions tracked
          if (functionCount > 0) {
            console.log('\nFunctions Tracked:');
            Object.entries(coverageReport.functions).forEach(([key, data]) => {
              console.log(`  - ${key}: started ${data.count} time(s), completed ${data.completed} time(s), errors ${data.errors} time(s)`);
            });
          }
          
          console.log(`\nCoverage Summary:
  - JSX Elements Tracked: ${jsxElementCount}
  - Branches Tracked: ${branchCount}
  - Functions Tracked: ${functionCount}
`);
          
          // Write report to file
          const fs = require('fs');
          fs.writeFileSync(
            './instrumentation-coverage-report.json', 
            JSON.stringify(coverageReport, null, 2)
          );
          console.log('Coverage report saved to: instrumentation-coverage-report.json');
          
        } catch (error) {
          console.error('Error running instrumented components:', error);
          console.error(error.stack);
        }
      