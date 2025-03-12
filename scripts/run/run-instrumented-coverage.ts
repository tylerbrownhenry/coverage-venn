/**
 * Run Instrumented Coverage
 * 
 * This script runs tests with our custom Babel coverage instrumentation
 * and generates enhanced coverage reports.
 */

import * as path from 'path';
import * as fs from 'fs/promises';
import { execSync } from 'child_process';

// Import using require since TS-Node uses CommonJS by default
// We need to use require with a special workaround for TypeScript
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pluginIntegration = require('../../src/instrumentation/babel/plugin-integration');
const { createJestConfig } = pluginIntegration;

const PROJECT_ROOT = process.cwd();
const COVERAGE_DIR = path.join(PROJECT_ROOT, 'coverage-babel');
const REPORTS_DIR = path.join(PROJECT_ROOT, 'reports');

/**
 * Main execution function
 */
async function main() {
  try {
    console.log('Starting instrumented coverage analysis...');
    
    // Create output directories
    await fs.mkdir(COVERAGE_DIR, { recursive: true });
    await fs.mkdir(REPORTS_DIR, { recursive: true });
    
    // Run Jest tests with our custom instrumentation
    console.log('Running tests with coverage instrumentation...');
    
    // Create temporary Jest config file for our instrumentation
    const jestConfigContent = `
      const baseConfig = require('../../jest.config');
      const instrumentationConfig = ${JSON.stringify(createJestConfig(), null, 2)};
      
      module.exports = {
        ...baseConfig,
        ...instrumentationConfig,
        coverageDirectory: './coverage-babel',
        coverageReporters: ['json', 'lcov', 'text', 'clover', 'html', 'json-summary'],
      };
    `;
    
    const tempConfigPath = path.join(PROJECT_ROOT, 'jest.instrumented.config.js');
    await fs.writeFile(tempConfigPath, jestConfigContent, 'utf8');
    
    // Run Jest with the temporary config
    try {
      const cmd = 'NODE_ENV=test jest --config=jest.instrumented.config.js --coverage --verbose';
      execSync(cmd, { stdio: 'inherit' });
    } catch (error) {
      console.warn('Tests completed with errors, but continuing with coverage analysis...');
    }
    
    // Process the instrumented coverage data
    await processInstrumentedCoverage();
    
    // Clean up temp file
    await fs.unlink(tempConfigPath);
    
    // Run the correlation analysis to enhance coverage data with component relationships
    console.log('Running correlation analysis on instrumented coverage data...');
    execSync('COVERAGE_SOURCE=babel ts-node scripts/correlate-coverage.ts', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        COVERAGE_SOURCE: 'babel'
      }
    });
    
    // Generate HTML report
    console.log('Generating enhanced HTML coverage report...');
    execSync('COVERAGE_SOURCE=babel ts-node scripts/generate-html-report.ts', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        COVERAGE_SOURCE: 'babel'
      }
    });
    
    console.log('Done! Enhanced coverage reports are available at:');
    console.log(`- HTML Report: ${path.join(COVERAGE_DIR, 'html/index.html')}`);
    console.log(`- Coverage Data: ${path.join(COVERAGE_DIR, 'coverage-final.json')}`);
    console.log(`- Component Coverage: ${path.join(COVERAGE_DIR, 'component-coverage.json')}`);
    
  } catch (error) {
    console.error('Error running instrumented coverage:', error);
    process.exit(1);
  }
}

/**
 * Process the instrumented coverage data and save to files
 */
async function processInstrumentedCoverage() {
  console.log('Processing instrumented coverage data...');
  
  try {
    // Check if data file exists
    const dataPath = path.join(REPORTS_DIR, 'babel-coverage-data.json');
    if (await fileExists(dataPath)) {
      // Read data file which should have been created by our instrumentation
      const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));
      
      // Save raw component coverage data
      await fs.writeFile(
        path.join(COVERAGE_DIR, 'component-coverage.json'),
        JSON.stringify(data, null, 2),
        'utf8'
      );
      
      // Convert to Istanbul format and save
      const istanbulCoverage = convertToIstanbulFormat(data);
      await fs.writeFile(
        path.join(COVERAGE_DIR, 'coverage-final.json'),
        JSON.stringify(istanbulCoverage, null, 2),
        'utf8'
      );
      
      console.log(`Processed coverage data for ${Object.keys(data.components).length} components`);
    } else {
      console.warn('No instrumented coverage data found. Make sure tests are properly instrumented.');
    }
  } catch (error) {
    console.error('Error processing instrumented coverage:', error);
  }
}

/**
 * Convert our coverage format to Istanbul format
 */
function convertToIstanbulFormat(data: any) {
  // If there's a toIstanbulFormat method, use it
  if (data.toIstanbulFormat && typeof data.toIstanbulFormat === 'function') {
    return data.toIstanbulFormat();
  }
  
  // Otherwise, manually convert simple format
  const istanbulCoverage: Record<string, any> = {};
  
  Object.entries(data.components || {}).forEach(([componentName, component]: [string, any]) => {
    if (!component.filePath) return;
    
    // Create entry for this file if it doesn't exist
    const filePath = component.filePath;
    if (!istanbulCoverage[filePath]) {
      istanbulCoverage[filePath] = {
        path: filePath,
        statementMap: {},
        fnMap: {},
        branchMap: {},
        s: {},
        f: {},
        b: {}
      };
    }
    
    // Add functions
    Object.entries(component.functions || {}).forEach(([funcId, func]: [string, any]) => {
      const id = `${componentName}_${funcId}`;
      istanbulCoverage[filePath].fnMap[id] = {
        name: func.name,
        decl: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } }
      };
      istanbulCoverage[filePath].f[id] = func.hits || 0;
    });
    
    // Add branches
    Object.entries(component.branches || {}).forEach(([branchId, branch]: [string, any]) => {
      const id = `${componentName}_${branchId}`;
      istanbulCoverage[filePath].branchMap[id] = {
        type: branch.type || 'if',
        locations: [
          { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
          { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } }
        ]
      };
      istanbulCoverage[filePath].b[id] = [branch.trueCount || 0, branch.falseCount || 0];
    });
    
    // Add statements from JSX elements
    Object.entries(component.jsx || {}).forEach(([jsxId, jsx]: [string, any]) => {
      const id = `${componentName}_jsx_${jsxId}`;
      istanbulCoverage[filePath].statementMap[id] = {
        start: { line: 1, column: 0 },
        end: { line: 1, column: 0 }
      };
      istanbulCoverage[filePath].s[id] = jsx.hits || 0;
    });
  });
  
  return istanbulCoverage;
}

/**
 * Helper to check if a file exists
 */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

// Run the main function
main().catch(console.error); 