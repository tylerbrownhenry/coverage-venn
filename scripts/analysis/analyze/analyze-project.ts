/**
 * Analyze Project Coverage
 * 
 * This script analyzes coverage data from a real project
 * and generates a coverage analysis report.
 * 
 * Environment variables:
 * - PROJECT_ROOT: Root directory of the project to analyze
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as fsSync from 'fs';
import { createCoverageMap } from 'istanbul-lib-coverage';
import { IstanbulCoverageAnalyzer, ComponentCoverage } from '../../../src/analyzers/istanbul';

// Configuration
const projectRoot = process.env.PROJECT_ROOT || process.cwd();
const coverageDir = path.resolve(projectRoot, 'coverage');
const coverageJsonPath = path.resolve(coverageDir, 'coverage-final.json');
const outputDir = path.resolve(process.cwd(), 'coverage-analysis');
const componentCoveragePath = path.resolve(outputDir, 'project-component-coverage.json');

async function main() {
  try {
    console.log(`Analyzing project coverage from: ${coverageJsonPath}`);
    
    // Check if coverage report exists
    try {
      await fs.access(coverageJsonPath);
    } catch (error) {
      console.error(`Coverage report not found at: ${coverageJsonPath}`);
      console.log('You may need to run tests with coverage in your project first.');
      process.exit(1);
    }
    
    // Read coverage data
    const coverageData = JSON.parse(await fs.readFile(coverageJsonPath, 'utf8'));
    
    // Create coverage map
    const coverageMap = createCoverageMap(coverageData);
    
    console.log(`Found coverage data for ${coverageMap.files().length} files.`);
    
    // Check if component-coverage.json already exists
    const componentCoverageJsonPath = path.resolve(coverageDir, 'component-coverage.json');
    let componentAnalysis: ComponentCoverage[] = [];
    
    if (fsSync.existsSync(componentCoverageJsonPath)) {
      console.log(`Found existing component coverage data at: ${componentCoverageJsonPath}`);
      
      try {
        // Use that data directly instead of analyzing again
        const componentData = JSON.parse(await fs.readFile(componentCoverageJsonPath, 'utf8'));
        componentAnalysis = componentData;
      } catch (error) {
        console.error(`Error reading component coverage data: ${error}`);
        // Fall back to analyzer if there's an error
        componentAnalysis = await analyzeWithIstanbul(coverageMap);
      }
    } else {
      // Use the Istanbul analyzer
      componentAnalysis = await analyzeWithIstanbul(coverageMap);
    }
    
    console.log(`Analyzed ${componentAnalysis.length} components.`);
    
    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });
    
    // Write analysis to file
    await fs.writeFile(
      componentCoveragePath,
      JSON.stringify(componentAnalysis, null, 2),
      'utf8'
    );
    
    console.log(`Coverage analysis complete. Results saved to: ${componentCoveragePath}`);
    
    // Print summary
    const averageCoverage = componentAnalysis.reduce((sum: number, item: ComponentCoverage) => sum + item.coverage, 0) / componentAnalysis.length || 0;
    console.log(`Average component coverage: ${averageCoverage.toFixed(2)}%`);
    
    // Print low coverage components
    const lowCoverageThreshold = 50;
    const lowCoverageComponents = componentAnalysis.filter((c: ComponentCoverage) => c.coverage < lowCoverageThreshold);
    
    if (lowCoverageComponents.length > 0) {
      console.log(`\nComponents with coverage below ${lowCoverageThreshold}%:`);
      lowCoverageComponents.forEach((c: ComponentCoverage) => {
        console.log(`- ${c.path}: ${c.coverage.toFixed(2)}%`);
      });
    }
  } catch (error) {
    console.error('Error analyzing project coverage:', error);
    process.exit(1);
  }
}

// Function to analyze with Istanbul
async function analyzeWithIstanbul(coverageMap: any): Promise<ComponentCoverage[]> {
  // Create analyzer with custom patterns to match project structure
  const analyzer = new IstanbulCoverageAnalyzer(
    // Include patterns for components
    [
      /.*\.(tsx|jsx)$/, // All React components
      /.*\/components\/.*\.(ts|js|tsx|jsx)$/, // Components directory
      /.*\/features\/.*\.(ts|js|tsx|jsx)$/, // Features directory
      /.*\/pages\/.*\.(ts|js|tsx|jsx)$/, // Pages directory
      /.*\/screens\/.*\.(ts|js|tsx|jsx)$/, // Screens directory
    ],
    // Exclude patterns
    [
      /.*\/__tests__\/.*/, 
      /.*\.test\.(tsx|jsx|ts|js)$/,
      /.*\.spec\.(tsx|jsx|ts|js)$/,
      /.*\.d\.ts$/,
      /.*\/node_modules\/.*/,
      /.*\/dist\/.*/,
      /.*\/build\/.*/
    ]
  );
  
  console.log('Analyzing component coverage...');
  
  // Analyze coverage
  return await analyzer.analyze(coverageMap);
}

main(); 