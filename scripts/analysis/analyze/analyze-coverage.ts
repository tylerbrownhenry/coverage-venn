import * as fs from 'fs/promises';
import * as path from 'path';
import { createCoverageMap } from 'istanbul-lib-coverage';
import { IstanbulCoverageAnalyzer, ComponentCoverage } from '../../../src/analyzers/istanbul';
import { execSync } from 'child_process';

// Path constants
const COVERAGE_DIR = path.resolve(process.cwd(), 'coverage');
const COVERAGE_JSON_PATH = path.resolve(COVERAGE_DIR, 'coverage-final.json');
const ANALYSIS_OUTPUT_PATH = path.resolve(COVERAGE_DIR, 'component-coverage.json');

async function main() {
  try {
    console.log('Analyzing existing coverage report...');
    
    // Check if coverage report exists
    try {
      await fs.access(COVERAGE_JSON_PATH);
    } catch (error) {
      console.error('Coverage report not found at', COVERAGE_JSON_PATH);
      console.log('You may need to run tests with coverage first using:');
      console.log('  npm run test:coverage');
      process.exit(1);
    }
    
    // Read coverage data
    const coverageData = JSON.parse(
      await fs.readFile(COVERAGE_JSON_PATH, 'utf8')
    );
    
    // Create coverage map from the data
    const coverageMap = createCoverageMap(coverageData);
    
    console.log(`Found coverage data for ${coverageMap.files().length} files.`);
    
    // Create analyzer with custom patterns to match your project structure
    // You can adjust these patterns to better match your components
    const analyzer = new IstanbulCoverageAnalyzer(
      // Include patterns - adjust these to match your project's component structure
      [
        /.*\.(tsx|jsx)$/, // All React components
        /.*\/components\/.*\.(ts|js|tsx|jsx)$/, // Components directory
        /.*\/containers\/.*\.(ts|js|tsx|jsx)$/, // Containers directory
        // Add more patterns as needed
      ],
      // Exclude patterns
      [
        /.*\/__tests__\/.*/, 
        /.*\.test\.(tsx|jsx|ts|js)$/,
        /.*\.spec\.(tsx|jsx|ts|js)$/,
        /.*\.d\.ts$/,
        /.*\/node_modules\/.*/
      ]
    );
    
    console.log('Analyzing component coverage...');
    
    // Analyze coverage
    const analysis = await analyzer.analyze(coverageMap);
    
    console.log(`Analyzed ${analysis.length} components.`);
    
    // Create output directory if it doesn't exist
    await fs.mkdir(COVERAGE_DIR, { recursive: true });
    
    // Write analysis to file
    await fs.writeFile(
      ANALYSIS_OUTPUT_PATH,
      JSON.stringify(analysis, null, 2),
      'utf8'
    );
    
    console.log(`Coverage analysis complete. Results saved to ${ANALYSIS_OUTPUT_PATH}`);
    
    // Print summary
    const averageCoverage = analysis.reduce((sum: number, item: ComponentCoverage) => sum + item.coverage, 0) / analysis.length || 0;
    console.log(`Average component coverage: ${averageCoverage.toFixed(2)}%`);
    
    // Print low coverage components
    const lowCoverageThreshold = 50;
    const lowCoverageComponents = analysis.filter((c: ComponentCoverage) => c.coverage < lowCoverageThreshold);
    
    if (lowCoverageComponents.length > 0) {
      console.log(`\nComponents with coverage below ${lowCoverageThreshold}%:`);
      lowCoverageComponents.forEach((c: ComponentCoverage) => {
        console.log(`- ${c.path}: ${c.coverage.toFixed(2)}%`);
      });
    }
  } catch (error) {
    console.error('Error analyzing coverage:', error);
    process.exit(1);
  }
}

main(); 