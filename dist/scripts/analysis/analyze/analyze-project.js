"use strict";
/**
 * Analyze Project Coverage
 *
 * This script analyzes coverage data from a real project
 * and generates a coverage analysis report.
 *
 * Environment variables:
 * - PROJECT_ROOT: Root directory of the project to analyze
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
const fsSync = __importStar(require("fs"));
const istanbul_lib_coverage_1 = require("istanbul-lib-coverage");
const istanbul_1 = require("../../../src/analyzers/istanbul");
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
        }
        catch (error) {
            console.error(`Coverage report not found at: ${coverageJsonPath}`);
            console.log('You may need to run tests with coverage in your project first.');
            process.exit(1);
        }
        // Read coverage data
        const coverageData = JSON.parse(await fs.readFile(coverageJsonPath, 'utf8'));
        // Create coverage map
        const coverageMap = (0, istanbul_lib_coverage_1.createCoverageMap)(coverageData);
        console.log(`Found coverage data for ${coverageMap.files().length} files.`);
        // Check if component-coverage.json already exists
        const componentCoverageJsonPath = path.resolve(coverageDir, 'component-coverage.json');
        let componentAnalysis = [];
        if (fsSync.existsSync(componentCoverageJsonPath)) {
            console.log(`Found existing component coverage data at: ${componentCoverageJsonPath}`);
            try {
                // Use that data directly instead of analyzing again
                const componentData = JSON.parse(await fs.readFile(componentCoverageJsonPath, 'utf8'));
                componentAnalysis = componentData;
            }
            catch (error) {
                console.error(`Error reading component coverage data: ${error}`);
                // Fall back to analyzer if there's an error
                componentAnalysis = await analyzeWithIstanbul(coverageMap);
            }
        }
        else {
            // Use the Istanbul analyzer
            componentAnalysis = await analyzeWithIstanbul(coverageMap);
        }
        console.log(`Analyzed ${componentAnalysis.length} components.`);
        // Create output directory
        await fs.mkdir(outputDir, { recursive: true });
        // Write analysis to file
        await fs.writeFile(componentCoveragePath, JSON.stringify(componentAnalysis, null, 2), 'utf8');
        console.log(`Coverage analysis complete. Results saved to: ${componentCoveragePath}`);
        // Print summary
        const averageCoverage = componentAnalysis.reduce((sum, item) => sum + item.coverage, 0) / componentAnalysis.length || 0;
        console.log(`Average component coverage: ${averageCoverage.toFixed(2)}%`);
        // Print low coverage components
        const lowCoverageThreshold = 50;
        const lowCoverageComponents = componentAnalysis.filter((c) => c.coverage < lowCoverageThreshold);
        if (lowCoverageComponents.length > 0) {
            console.log(`\nComponents with coverage below ${lowCoverageThreshold}%:`);
            lowCoverageComponents.forEach((c) => {
                console.log(`- ${c.path}: ${c.coverage.toFixed(2)}%`);
            });
        }
    }
    catch (error) {
        console.error('Error analyzing project coverage:', error);
        process.exit(1);
    }
}
// Function to analyze with Istanbul
async function analyzeWithIstanbul(coverageMap) {
    // Create analyzer with expanded patterns to match more project structures
    const analyzer = new istanbul_1.IstanbulCoverageAnalyzer(
    // Include patterns for components - adding more patterns to catch different project structures
    [
        // React component files with any extension in any directory
        /.*\.(tsx|jsx|ts|js)$/,
        // Standard component directories
        /.*\/components\/.*\.(ts|js|tsx|jsx)$/,
        /.*\/features\/.*\.(ts|js|tsx|jsx)$/,
        /.*\/pages\/.*\.(ts|js|tsx|jsx)$/,
        /.*\/screens\/.*\.(ts|js|tsx|jsx)$/,
        /.*\/views\/.*\.(ts|js|tsx|jsx)$/,
        // Utility files and other common patterns
        /.*\/utils\/.*\.(ts|js)$/,
        /.*\/hooks\/.*\.(ts|js)$/,
        /.*\/contexts\/.*\.(tsx|ts)$/,
        /.*\/providers\/.*\.(tsx|ts)$/,
        // Any source file that might be a component
        /.*\/src\/.*\.(tsx|jsx|ts|js)$/
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
    ]);
    console.log('Analyzing component coverage with expanded patterns...');
    // Analyze coverage
    return await analyzer.analyze(coverageMap);
}
main();
