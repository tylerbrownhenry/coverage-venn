/**
 * Custom Jest environment that provides coverage tracking capabilities.
 * This environment extends the standard JSDOM environment but adds our
 * custom coverage tracker to the global scope.
 */

const JSDOMEnvironment = require('jest-environment-jsdom');
const fs = require('fs');
const path = require('path');

class CoverageJestEnvironment extends JSDOMEnvironment {
  constructor(config, context) {
    super(config, context);
    
    // Create the coverage tracker with all our tracking methods
    this.global.COVERAGE_TRACKER = {
      branches: {},
      switches: {},
      cases: {},
      functions: {},
      jsx: {},
      tryBlocks: {},
      
      // Branch tracking
      trackBranch(component, branchId, type, condition) {
        if (!this.branches[component]) {
          this.branches[component] = {};
        }
        if (!this.branches[component][branchId]) {
          this.branches[component][branchId] = { 
            type, 
            hits: 0,
            conditions: []
          };
        }
        
        this.branches[component][branchId].hits++;
        this.branches[component][branchId].conditions.push(condition);
        
        return condition;
      },
      
      // Switch statement tracking
      trackSwitch(component, switchId, value) {
        if (!this.switches[component]) {
          this.switches[component] = {};
        }
        if (!this.switches[component][switchId]) {
          this.switches[component][switchId] = {
            hits: 0,
            values: []
          };
        }
        
        this.switches[component][switchId].hits++;
        this.switches[component][switchId].values.push(value);
        
        return value;
      },
      
      // Case tracking
      trackCase(component, switchId, caseId, isMatch) {
        if (!this.cases[component]) {
          this.cases[component] = {};
        }
        if (!this.cases[component][caseId]) {
          this.cases[component][caseId] = {
            switchId,
            hits: 0,
            matches: 0
          };
        }
        
        this.cases[component][caseId].hits++;
        if (isMatch) {
          this.cases[component][caseId].matches++;
        }
        
        return isMatch;
      },
      
      // Function tracking
      trackFunctionStart(component, functionId, name) {
        if (!this.functions[component]) {
          this.functions[component] = {};
        }
        if (!this.functions[component][functionId]) {
          this.functions[component][functionId] = {
            name,
            calls: 0,
            errors: 0
          };
        }
        
        this.functions[component][functionId].calls++;
        return functionId;
      },
      
      trackFunctionEnd(component, functionId) {
        // Just for tracking successful completion
        return functionId;
      },
      
      trackFunctionError(component, functionId, error) {
        if (this.functions[component] && this.functions[component][functionId]) {
          this.functions[component][functionId].errors++;
        }
        throw error; // Re-throw to preserve original behavior
      },
      
      // JSX tracking
      trackJSX(component, jsxId, elementType) {
        if (!this.jsx[component]) {
          this.jsx[component] = {};
        }
        if (!this.jsx[component][jsxId]) {
          this.jsx[component][jsxId] = {
            elementType,
            renders: 0
          };
        }
        
        this.jsx[component][jsxId].renders++;
      },
      
      // Try/Catch/Finally tracking
      trackTry(component, blockId, blockType) {
        if (!this.tryBlocks[component]) {
          this.tryBlocks[component] = {};
        }
        if (!this.tryBlocks[component][blockId]) {
          this.tryBlocks[component][blockId] = {
            type: blockType,
            hits: 0
          };
        }
        
        this.tryBlocks[component][blockId].hits++;
        return blockId;
      },
      
      // Get summary for reporting
      getSummary() {
        const branchCount = Object.values(this.branches)
          .reduce((count, branches) => count + Object.keys(branches).length, 0);
        
        const switchCount = Object.values(this.switches)
          .reduce((count, switches) => count + Object.keys(switches).length, 0);
        
        const caseCount = Object.values(this.cases)
          .reduce((count, cases) => count + Object.keys(cases).length, 0);
        
        const functionCount = Object.values(this.functions)
          .reduce((count, funcs) => count + Object.keys(funcs).length, 0);
        
        const jsxCount = Object.values(this.jsx)
          .reduce((count, elements) => count + Object.keys(elements).length, 0);
        
        const tryBlockCount = Object.values(this.tryBlocks)
          .reduce((count, blocks) => count + Object.keys(blocks).length, 0);
        
        return {
          branches: branchCount,
          switches: switchCount,
          cases: caseCount,
          functions: functionCount,
          jsx: jsxCount,
          tryBlocks: tryBlockCount
        };
      },
      
      // Get detailed results
      getResults() {
        return {
          branches: this.branches,
          switches: this.switches,
          cases: this.cases,
          functions: this.functions,
          jsx: this.jsx,
          tryBlocks: this.tryBlocks
        };
      },
      
      // Save coverage data to file
      saveCoverageData(testContext) {
        try {
          // Create output directory if it doesn't exist
          const outputDir = path.resolve(process.cwd(), 'coverage-instrumentation');
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }
          
          // Create a filename that includes test info if available
          const testInfo = testContext ? 
            `-${testContext.testPath.split('/').pop().replace(/\./g, '-')}` : 
            '';
          
          const outputPath = path.join(outputDir, `coverage${testInfo}-${Date.now()}.json`);
          
          // Save the coverage data
          fs.writeFileSync(outputPath, JSON.stringify(this.getResults(), null, 2));
          
          return outputPath;
        } catch (error) {
          console.error('Error saving coverage data:', error);
          return null;
        }
      }
    };
  }
  
  async teardown() {
    // Save coverage data when Jest environment tears down
    if (this.global.COVERAGE_TRACKER) {
      const outputPath = this.global.COVERAGE_TRACKER.saveCoverageData(this.context);
      if (outputPath) {
        console.log(`Coverage data saved to: ${outputPath}`);
      }
    }
    
    await super.teardown();
  }
}

module.exports = CoverageJestEnvironment; 