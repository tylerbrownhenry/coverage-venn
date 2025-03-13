"use strict";
/**
 * Simplified test for Flow instrumentation with Babel plugin
 *
 * This script:
 * 1. Creates a test directory
 * 2. Sets up a coverage tracker file
 * 3. Creates a simple Flow test file with minimal types
 * 4. Runs Babel to transform the file with our plugin
 * 5. Executes the instrumented code
 * 6. Logs coverage data
 */
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const { execSync } = require('child_process');
// Set up test environment
const testDir = path.resolve(__dirname, '../.instrumentation-test/flow-test-simple');
const sourceFile = path.resolve(testDir, 'flow-test-simple.js');
const instrumentedFile = path.resolve(testDir, 'instrumented-flow-test.js');
const coverageTrackerFile = path.resolve(testDir, 'coverage-tracker.js');
console.log('Setting up simplified Flow instrumentation test...');
console.log(`Test directory: ${testDir}`);
// Ensure the test directory exists
if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
}
// Create coverage tracker file (simplified version)
const coverageTrackerContent = `
// Global coverage tracker
global.COVERAGE_TRACKER = {
  branches: {},
  
  trackBranch(component, branchId, branchType, path) {
    if (!this.branches[component]) {
      this.branches[component] = {};
    }
    
    const key = \`\${branchId}:\${branchType}\`;
    if (!this.branches[component][key]) {
      this.branches[component][key] = { 
        type: branchType,
        paths: { 0: 0, 1: 0 } 
      };
    }
    
    this.branches[component][key].paths[path]++;
    console.log(\`Branch \${branchType} in \${component} took path \${path}\`);
    return path === 0;
  },
  
  printSummary() {
    let totalBranches = 0;
    
    Object.keys(this.branches).forEach(component => {
      totalBranches += Object.keys(this.branches[component]).length;
    });
    
    console.log('\\n--- Coverage Summary ---');
    console.log(\`Branches tracked: \${totalBranches}\`);
    console.log('------------------------\\n');
  }
};

fs.writeFileSync(coverageTrackerFile, coverageTrackerContent);
console.log(`, Coverage, tracker, created, at, { coverageTrackerFile };
`);

// Create a new simple Flow test file
const flowTestContent = `;
// @flow
/**
 * Simple Flow Test File
 *
 * This file includes only basic Flow features to test our plugin.
 */
// Basic type annotations
function add(a, b) {
    return a + b;
}
// Conditional with type
function processValue(value) {
    if (typeof value === 'string') {
        return value.toUpperCase();
    }
    else {
        return String(value * 2);
    }
}
// Function using type
function greet(person) {
    if (person.age > 18) {
        return ;
        `Hello, \${person.name}!\`;
  } else {
    return \`Hi there, \${person.name}!\`;
  }
}

// Run tests
try {
  console.log('Testing add:', add(5, 10));
  
  console.log('Processing string:', processValue('hello'));
  console.log('Processing number:', processValue(42));
  
  const person = { name: 'Alice', age: 30 };
  console.log(greet(person));
  
  const youngPerson = { name: 'Bob', age: 15 };
  console.log(greet(youngPerson));
  
  console.log('Flow test completed successfully!');
} catch (error) {
  console.error('Error in Flow test:', error);
}
`;
        // Write the Flow test file
        fs.writeFileSync(sourceFile, flowTestContent);
        console.log(`Simple Flow test file created at: ${sourceFile}`);
        // Create a simplified Flow plugin focused on basic instrumentation
        const simpleFlowPluginContent = `
/**
 * Simplified Babel plugin for Flow support
 */
module.exports = function(babel) {
  const { types: t } = babel;
  
  return {
    name: 'simplified-flow-plugin',
    visitor: {
      // Remove Flow type annotations
      TypeAnnotation(path) {
        // Just log when we find type annotations
        console.log('Removing Flow type annotation');
      },
      
      // Remove type casts
      TypeCastExpression(path) {
        console.log('Replacing Flow type cast with expression');
        path.replaceWith(path.node.expression);
      },
      
      // Skip type declarations
      TypeAlias(path) {
        console.log('Skipping Flow type alias');
      },
      
      // Instrument if statements
      IfStatement(path) {
        // Skip if already instrumented
        if (path.node._instrumented) return;
        
        try {
          const filename = this.filename || 'unknown';
          const componentName = filename.split('/').pop().split('.')[0];
          const testPath = path.get('test');
          
          if (testPath && testPath.node) {
            // Create a unique ID
            const loc = path.node.loc;
            const branchId = loc ? \`\${loc.start.line}:\${loc.start.column}\` : Math.random().toString(36).substr(2, 9);
            
            // Create instrumentation
            const condition = testPath.node;
            const trackerCall = t.callExpression(
              t.memberExpression(
                t.identifier('COVERAGE_TRACKER'),
                t.identifier('trackBranch')
              ),
              [
                t.stringLiteral(componentName),
                t.stringLiteral(branchId),
                t.stringLiteral('if'),
                condition
              ]
            );
            
            // Replace test with instrumented version
            testPath.replaceWith(trackerCall);
            path.node._instrumented = true;
          }
        } catch (error) {
          console.error('Error instrumenting if statement:', error);
        }
      }
    }
  };
};
`;
        const pluginPath = path.resolve(testDir, 'simplified-flow-plugin.js');
        fs.writeFileSync(pluginPath, simpleFlowPluginContent);
        console.log(`Simplified Flow plugin created at: ${pluginPath}`);
        // Instrument code using our simplified Babel plugin
        console.log('Instrumenting Flow code with simplified plugin...');
        // Transform Flow file with our plugin
        try {
            const result = babel.transformFileSync(sourceFile, {
                presets: [
                    '@babel/preset-env',
                    '@babel/preset-flow'
                ],
                plugins: [
                    pluginPath
                ],
                filename: path.basename(sourceFile)
            });
            fs.writeFileSync(instrumentedFile, result.code);
            console.log(`Instrumented code written to: ${instrumentedFile}`);
        }
        catch (error) {
            console.error('Error during Babel transformation:', error);
            process.exit(1);
        }
        // Execute the instrumented file
        console.log('Running instrumented Flow code...');
        try {
            // Set a timeout to prevent hanging
            const timeout = 10000; // 10 seconds
            // Require the coverage tracker first with increased memory limit
            execSync(`node --max-old-space-size=4096 -e "require('${coverageTrackerFile}'); require('${instrumentedFile}')"`, {
                stdio: 'inherit',
                timeout
            });
            // Print summary with increased memory limit
            execSync(`node --max-old-space-size=4096 -e "require('${coverageTrackerFile}').printSummary()"`, {
                stdio: 'inherit',
                timeout: 5000 // 5 seconds timeout for summary
            });
            console.log('Flow instrumentation test completed successfully!');
        }
        catch (error) {
            console.error('Error executing instrumented code:', error);
            if (error.signal === 'SIGTERM') {
                console.error('Test execution timed out. This may indicate an infinite loop or excessive recursion.');
            }
            process.exit(1);
        }
    }
}
