"use strict";
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
const fsSync = __importStar(require("fs"));
const path = __importStar(require("path"));
const istanbul_lib_coverage_1 = require("istanbul-lib-coverage");
const istanbul_1 = require("../../../src/analyzers/istanbul");
const child_process_1 = require("child_process");
// Path constants
const COVERAGE_DIR = path.resolve(process.cwd(), 'coverage-analysis');
const COVERAGE_JSON_PATH = path.resolve(process.cwd(), 'coverage', 'coverage-final.json');
const ANALYSIS_OUTPUT_PATH = path.resolve(COVERAGE_DIR, 'mock-component-coverage.json');
const MOCKS_DIR = path.resolve(process.cwd(), '__mocks__');
// Function to recursively get all files in a directory
async function getAllFiles(dir, fileList = []) {
    const files = await fs.readdir(dir, { withFileTypes: true });
    for (const file of files) {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
            fileList = await getAllFiles(filePath, fileList);
        }
        else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
            // Skip test files
            if (!file.name.includes('.test.') && !file.name.includes('.spec.') && !filePath.includes('__tests__')) {
                fileList.push(filePath);
            }
        }
    }
    return fileList;
}
// Helper to find tests related to a source file
async function findTestsForComponent(componentPath) {
    const allTests = [];
    // Get the name of the component (without extension)
    const componentBaseName = path.basename(componentPath, path.extname(componentPath));
    // Potential test locations
    const potentialTestPaths = [
        // Direct test file
        path.join(path.dirname(componentPath), `${componentBaseName}.test.ts`),
        path.join(path.dirname(componentPath), `${componentBaseName}.test.tsx`),
        path.join(path.dirname(componentPath), `${componentBaseName}.spec.ts`),
        path.join(path.dirname(componentPath), `${componentBaseName}.spec.tsx`),
        // Tests in __tests__ directory at same level
        path.join(path.dirname(componentPath), '__tests__', `${componentBaseName}.test.ts`),
        path.join(path.dirname(componentPath), '__tests__', `${componentBaseName}.test.tsx`),
        path.join(path.dirname(componentPath), '__tests__', `${componentBaseName}.spec.ts`),
        path.join(path.dirname(componentPath), '__tests__', `${componentBaseName}.spec.tsx`)
    ];
    // Check if each potential test path exists
    for (const testPath of potentialTestPaths) {
        try {
            await fs.access(testPath);
            allTests.push(testPath);
        }
        catch (error) {
            // File doesn't exist, continue to next
        }
    }
    return allTests;
}
// Run a single test with coverage
async function runTestWithCoverage(sourceFile) {
    const relativeSourcePath = path.relative(process.cwd(), sourceFile);
    const tests = await findTestsForComponent(sourceFile);
    // If no tests found, skip
    if (tests.length === 0) {
        console.log(`No tests found for ${relativeSourcePath}`);
        return false;
    }
    for (const testFile of tests) {
        const relativeTestPath = path.relative(process.cwd(), testFile);
        try {
            console.log(`Running test ${relativeTestPath} for ${relativeSourcePath}...`);
            const command = `jest --coverage --collectCoverageFrom="${relativeSourcePath}" "${relativeTestPath}" --testPathIgnorePatterns='' --config=jest.config.js`;
            (0, child_process_1.execSync)(command, { stdio: 'inherit' });
            return true;
        }
        catch (error) {
            console.warn(`Failed to run test ${relativeTestPath} for ${relativeSourcePath}`);
        }
    }
    return false;
}
/**
 * Create empty coverage objects for mock files that might be missing coverage
 */
async function ensureMockFilesCoverage(coverageData, mockFiles) {
    // Create a new object to avoid modifying the original
    const updatedCoverage = { ...coverageData };
    // Get all files that should have coverage
    for (const file of mockFiles) {
        // Skip if coverage already exists
        if (updatedCoverage[file])
            continue;
        try {
            // Read the file content
            const content = await fs.readFile(file, 'utf8');
            const lines = content.split('\n');
            // Create a basic coverage structure for the file
            updatedCoverage[file] = {
                path: file,
                statementMap: {},
                fnMap: {},
                branchMap: {},
                s: {},
                f: {},
                b: {}
            };
            // Add basic statement coverage for each line (will mark as uncovered)
            lines.forEach((line, index) => {
                // Skip empty lines
                if (line.trim() === '')
                    return;
                // Create statement entry
                const statementId = Object.keys(updatedCoverage[file].statementMap).length;
                updatedCoverage[file].statementMap[statementId] = {
                    start: { line: index + 1, column: 0 },
                    end: { line: index + 1, column: line.length }
                };
                // Mark as uncovered (0)
                updatedCoverage[file].s[statementId] = 0;
            });
            // Extract function declarations for function coverage
            const functionMatches = content.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g) || [];
            const arrowFunctionMatches = content.match(/const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(\([^)]*\)|[a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>/g) || [];
            // Add function coverage entries
            [...functionMatches, ...arrowFunctionMatches].forEach((fn, index) => {
                updatedCoverage[file].fnMap[index] = {
                    name: `fn${index}`,
                    line: 1, // Default to line 1
                    loc: {
                        start: { line: 1, column: 0 },
                        end: { line: 1, column: 10 }
                    }
                };
                // Mark as uncovered (0)
                updatedCoverage[file].f[index] = 0;
            });
            // Extract potential branches (if statements, ternaries)
            const branchMatches = content.match(/if\s*\([^)]*\)|[^:]+\?[^:]+:[^;]+/g) || [];
            // Add branch coverage entries
            branchMatches.forEach((branch, index) => {
                updatedCoverage[file].branchMap[index] = {
                    line: 1, // Default to line 1
                    type: branch.startsWith('if') ? 'if' : 'cond-expr',
                    locations: [
                        { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } },
                        { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } }
                    ]
                };
                // Mark all branches as uncovered ([0, 0])
                updatedCoverage[file].b[index] = [0, 0];
            });
        }
        catch (error) {
            console.warn(`Failed to create coverage entry for ${file}:`, error);
        }
    }
    return updatedCoverage;
}
// Function to merge coverage data
function mergeCoverageMaps(coverageFiles) {
    const mergedCoverage = {};
    for (const file of coverageFiles) {
        try {
            // Read in coverage file
            const coverageData = JSON.parse(fsSync.readFileSync(file, 'utf8'));
            // Merge each file's coverage
            for (const [path, coverage] of Object.entries(coverageData)) {
                // If we already have coverage for this file, merge it
                if (mergedCoverage[path]) {
                    // Merge statements
                    for (const stmtId in coverage.s) {
                        if (mergedCoverage[path].s[stmtId] !== undefined) {
                            mergedCoverage[path].s[stmtId] += coverage.s[stmtId];
                        }
                        else {
                            mergedCoverage[path].s[stmtId] = coverage.s[stmtId];
                            mergedCoverage[path].statementMap[stmtId] = coverage.statementMap[stmtId];
                        }
                    }
                    // Merge functions
                    for (const fnId in coverage.f) {
                        if (mergedCoverage[path].f[fnId] !== undefined) {
                            mergedCoverage[path].f[fnId] += coverage.f[fnId];
                        }
                        else {
                            mergedCoverage[path].f[fnId] = coverage.f[fnId];
                            mergedCoverage[path].fnMap[fnId] = coverage.fnMap[fnId];
                        }
                    }
                    // Merge branches
                    for (const branchId in coverage.b) {
                        if (mergedCoverage[path].b[branchId] !== undefined) {
                            for (let i = 0; i < coverage.b[branchId].length; i++) {
                                if (i < mergedCoverage[path].b[branchId].length) {
                                    mergedCoverage[path].b[branchId][i] += coverage.b[branchId][i];
                                }
                                else {
                                    mergedCoverage[path].b[branchId].push(coverage.b[branchId][i]);
                                }
                            }
                        }
                        else {
                            mergedCoverage[path].b[branchId] = coverage.b[branchId];
                            mergedCoverage[path].branchMap[branchId] = coverage.branchMap[branchId];
                        }
                    }
                }
                else {
                    // If no coverage for this file yet, just copy it
                    mergedCoverage[path] = coverage;
                }
            }
        }
        catch (error) {
            console.warn(`Error merging coverage from ${file}:`, error);
        }
    }
    return mergedCoverage;
}
async function main() {
    try {
        console.log('Running targeted coverage analysis on __mocks__ folder...');
        // Ensure coverage directory exists
        await fs.mkdir(COVERAGE_DIR, { recursive: true });
        // Get list of all mock files that should be covered
        const mockFiles = await getAllFiles(MOCKS_DIR);
        console.log(`Found ${mockFiles.length} files in __mocks__ to analyze.`);
        // Prepare temporary directory for coverage files
        const tempCoverageDir = path.resolve(process.cwd(), '.temp-coverage');
        await fs.mkdir(tempCoverageDir, { recursive: true });
        // Run tests for each component individually
        let testCount = 0;
        for (const mockFile of mockFiles) {
            // Create a specific coverage output for this test
            const outputFile = path.join(tempCoverageDir, `coverage-${testCount++}.json`);
            process.env.JEST_COVERAGE_OUTPUT = outputFile;
            // Run the test
            await runTestWithCoverage(mockFile);
        }
        // Now run all tests to get any coverage we might have missed
        try {
            console.log('\nRunning all tests in __mocks__ folder...');
            (0, child_process_1.execSync)('NODE_ENV=test jest --testPathPattern=__mocks__/ --coverage --collectCoverageFrom="__mocks__/src/**/*.{ts,tsx}" --no-cache --verbose', { stdio: 'inherit' });
        }
        catch (error) {
            console.warn('Tests completed with errors, but continuing with coverage analysis...');
        }
        console.log('Reading coverage report...');
        // Find all coverage files
        const coverageFiles = [
            path.resolve(process.cwd(), 'coverage', 'coverage-final.json')
        ];
        // Add any temp coverage files
        try {
            const tempFiles = await fs.readdir(tempCoverageDir);
            for (const file of tempFiles) {
                if (file.endsWith('.json')) {
                    coverageFiles.push(path.join(tempCoverageDir, file));
                }
            }
        }
        catch (error) {
            console.warn('No temporary coverage files found.');
        }
        // Merge all coverage data
        console.log(`Merging ${coverageFiles.length} coverage files...`);
        let coverageData = {};
        try {
            // Merge all coverage files
            coverageData = mergeCoverageMaps(coverageFiles);
            console.log(`Merged coverage data with ${Object.keys(coverageData).length} entries.`);
        }
        catch (error) {
            console.warn('Failed to merge coverage data, creating empty coverage data...', error);
            coverageData = {};
        }
        // Ensure all mock files have coverage entries (even if empty)
        coverageData = await ensureMockFilesCoverage(coverageData, mockFiles);
        // Create coverage map from the updated data
        const coverageMap = (0, istanbul_lib_coverage_1.createCoverageMap)(coverageData);
        // Filter to include only files from the __mocks__ directory
        const mockFilesWithCoverage = coverageMap.files().filter(file => file.includes('__mocks__'));
        console.log(`Found coverage data for ${mockFilesWithCoverage.length} files in __mocks__.`);
        if (mockFilesWithCoverage.length === 0) {
            console.warn('No coverage data found for files in __mocks__ after processing.');
            // Log the mock files for debugging
            console.log('Files that should have coverage:');
            mockFiles.forEach(file => console.log(` - ${file}`));
        }
        // Create analyzer specifically for the mock components
        const analyzer = new istanbul_1.IstanbulCoverageAnalyzer(
        // Pattern to include all files in __mocks__
        [/.*\/__mocks__\/.*/], 
        // Standard exclusions
        [
            /.*\/__tests__\/.*/,
            /.*\.test\.(tsx|jsx|ts|js)$/,
            /.*\.spec\.(tsx|jsx|ts|js)$/,
            /.*\.d\.ts$/,
            /.*\/node_modules\/.*/
        ]);
        console.log('Analyzing component coverage for mock components...');
        // Analyze coverage
        const analysis = await analyzer.analyze(coverageMap);
        console.log(`Analyzed ${analysis.length} mock components.`);
        // Write analysis to file
        await fs.writeFile(ANALYSIS_OUTPUT_PATH, JSON.stringify(analysis, null, 2), 'utf8');
        console.log(`Mock coverage analysis complete. Results saved to ${ANALYSIS_OUTPUT_PATH}`);
        // Print summary
        if (analysis.length > 0) {
            const averageCoverage = analysis.reduce((sum, item) => sum + item.coverage, 0) / analysis.length;
            console.log(`Average mock component coverage: ${averageCoverage.toFixed(2)}%`);
            // Print coverage for each component
            console.log('\nCoverage by component:');
            analysis.forEach(c => {
                const coverage = c.coverage.toFixed(2);
                const color = c.coverage >= 80 ? '\x1b[32m' : // Green for good coverage
                    c.coverage >= 50 ? '\x1b[33m' : // Yellow for medium coverage
                        '\x1b[31m'; // Red for poor coverage
                console.log(`${color}${c.path}: ${coverage}%\x1b[0m`);
                console.log(`  - Statements: ${c.statements.toFixed(2)}%`);
                console.log(`  - Branches: ${c.branches.toFixed(2)}%`);
                if (c.functions !== undefined) {
                    console.log(`  - Functions: ${c.functions.toFixed(2)}%`);
                }
                if (c.lines !== undefined) {
                    console.log(`  - Lines: ${c.lines.toFixed(2)}%`);
                }
            });
            // Clean up temp directory
            try {
                await fs.rm(tempCoverageDir, { recursive: true });
            }
            catch (error) {
                console.warn('Failed to clean up temporary coverage directory:', error);
            }
        }
        else {
            console.log('No components analyzed. Check your test coverage and component patterns.');
        }
    }
    catch (error) {
        console.error('Error analyzing mock coverage:', error);
        process.exit(1);
    }
}
// Run the main function
main().catch(console.error);
