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
const project_config_1 = require("../../../config/project-config");
// Get project-specific config
const PROJECT_NAME = process.env.PROJECT_NAME || 'default';
const projectConfig = (0, project_config_1.getProjectConfig)(PROJECT_NAME);
console.log(`Using configuration for project: ${PROJECT_NAME}`);
console.log(`Exclude patterns: ${JSON.stringify(projectConfig.excludeTestPatterns)}`);
console.log(`Confidence threshold: ${projectConfig.confidenceThreshold}`);
// Determine coverage source from environment variable
const COVERAGE_SOURCE = process.env.COVERAGE_SOURCE || 'standard';
// Path constants
const COVERAGE_DIR = path.resolve(process.cwd(), 'coverage');
const BABEL_COVERAGE_DIR = path.resolve(process.cwd(), 'coverage-babel');
const MOCK_COVERAGE_DIR = path.resolve(process.cwd(), 'coverage-analysis');
const MOCKS_DIR = path.resolve(process.cwd(), '__mocks__');
// Get the project root (either from env var or default to mocks dir)
const PROJECT_ROOT_DIR = process.env.PROJECT_ROOT ? path.resolve(process.env.PROJECT_ROOT) : MOCKS_DIR;
const SRC_DIR = process.env.PROJECT_ROOT ? path.join(PROJECT_ROOT_DIR, 'src') : MOCKS_DIR;
// Define paths based on coverage source
const COMPONENT_COVERAGE_PATH = COVERAGE_SOURCE === 'babel'
    ? path.resolve(BABEL_COVERAGE_DIR, 'component-coverage.json')
    : path.resolve(MOCK_COVERAGE_DIR, 'mock-component-coverage.json');
const CORRELATION_OUTPUT_PATH = COVERAGE_SOURCE === 'babel' ? path.resolve(BABEL_COVERAGE_DIR, 'test-component-correlation.json') :
    COVERAGE_SOURCE === 'project' ? path.resolve(process.cwd(), 'coverage-analysis', 'project-test-component-correlation.json') :
        path.resolve(COVERAGE_DIR, 'test-component-correlation.json');
// Function to extract component name from path
function getComponentName(componentPath) {
    const baseName = path.basename(componentPath);
    const nameWithoutExt = baseName.replace(/\.(tsx|ts)$/, '');
    // Convert kebab/snake case to PascalCase if it's not already
    if (!/^[A-Z]/.test(nameWithoutExt)) {
        return nameWithoutExt
            .split(/[-_]/)
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('');
    }
    return nameWithoutExt;
}
// Function to find all component files in a directory
async function findComponentFiles(dir) {
    const componentFiles = [];
    async function search(directory) {
        const files = await fs.readdir(directory, { withFileTypes: true });
        for (const file of files) {
            const filePath = path.join(directory, file.name);
            if (file.isDirectory()) {
                await search(filePath);
            }
            else if ((file.name.endsWith('.tsx') || file.name.endsWith('.ts')) &&
                !file.name.includes('.test.') &&
                !file.name.includes('.spec.') &&
                !filePath.includes('__tests__')) {
                componentFiles.push(filePath);
            }
        }
    }
    await search(dir);
    return componentFiles;
}
// Function to find all test files
async function findTestFiles(dir) {
    const testFiles = [];
    // Helper to check if a file should be excluded
    function shouldExcludeTestFile(filePath) {
        return projectConfig.excludeTestPatterns.some(pattern => {
            // Handle glob patterns
            if (pattern.includes('*')) {
                const regexPattern = pattern
                    .replace(/\./g, '\\.')
                    .replace(/\*\*/g, '.*')
                    .replace(/\*/g, '[^/]*');
                const regex = new RegExp(regexPattern);
                return regex.test(filePath);
            }
            return filePath.includes(pattern);
        });
    }
    async function search(directory) {
        const files = await fs.readdir(directory, { withFileTypes: true });
        for (const file of files) {
            const filePath = path.join(directory, file.name);
            if (file.isDirectory()) {
                await search(filePath);
            }
            else if ((file.name.endsWith('.test.tsx') ||
                file.name.endsWith('.test.ts') ||
                file.name.endsWith('.spec.tsx') ||
                file.name.endsWith('.spec.ts') ||
                file.name.endsWith('.feature'))) {
                if (shouldExcludeTestFile(filePath)) {
                    console.log(`Excluding test file based on pattern: ${filePath}`);
                }
                else {
                    console.log(`Including test file: ${filePath}`);
                    testFiles.push(filePath);
                }
            }
        }
    }
    await search(dir);
    return testFiles;
}
// Function to extract test steps from test files
async function extractTestSteps(testFiles) {
    const features = [];
    for (const file of testFiles) {
        const content = await fs.readFile(file, 'utf8');
        const lines = content.split('\n');
        // Simple feature file detection (Cucumber)
        if (file.endsWith('.feature')) {
            let currentFeature = null;
            let currentScenario = null;
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line.startsWith('Feature:')) {
                    const featureName = line.substring('Feature:'.length).trim();
                    currentFeature = {
                        name: featureName,
                        file,
                        scenarios: []
                    };
                    features.push(currentFeature);
                }
                else if (line.startsWith('Scenario:') && currentFeature) {
                    const scenarioName = line.substring('Scenario:'.length).trim();
                    currentScenario = {
                        name: scenarioName,
                        steps: []
                    };
                    currentFeature.scenarios.push(currentScenario);
                }
                else if (/^(Given|When|Then|And|But)/.test(line) && currentScenario) {
                    const stepText = line.trim();
                    currentScenario.steps.push({
                        text: stepText,
                        file,
                        line: i + 1
                    });
                }
            }
        }
        else {
            // Jest/Enzyme/RTL test file
            let currentDescribe = '';
            let currentIt = '';
            const feature = {
                name: path.basename(file).replace(/\.(test|spec)\.(tsx|ts)$/, ''),
                file,
                scenarios: []
            };
            let currentScenario = null;
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line.includes('describe(')) {
                    const match = line.match(/describe\(['"](.*?)['"]/);
                    if (match) {
                        currentDescribe = match[1];
                        if (!currentScenario) {
                            currentScenario = {
                                name: currentDescribe,
                                steps: []
                            };
                            feature.scenarios.push(currentScenario);
                        }
                    }
                }
                else if (line.includes('it(') || line.includes('test(')) {
                    const match = line.match(/(it|test)\(['"](.*?)['"]/);
                    if (match) {
                        currentIt = match[2];
                        if (currentScenario) {
                            currentScenario.steps.push({
                                text: currentIt,
                                file,
                                line: i + 1
                            });
                        }
                    }
                }
                else if (line.includes('render(') ||
                    line.includes('screen.getBy') ||
                    line.includes('expect(') ||
                    line.includes('fireEvent')) {
                    // These are likely test steps/assertions
                    if (currentScenario) {
                        currentScenario.steps.push({
                            text: line,
                            file,
                            line: i + 1
                        });
                    }
                }
            }
            if (feature.scenarios.length > 0) {
                features.push(feature);
            }
        }
    }
    return features;
}
// Function to scan component files to get their content
async function scanComponents(componentPaths) {
    const componentContents = {};
    for (const componentPath of componentPaths) {
        try {
            const content = await fs.readFile(componentPath, 'utf8');
            componentContents[componentPath] = content;
        }
        catch (error) {
            console.warn(`Could not read component file ${componentPath}: ${error}`);
            componentContents[componentPath] = '';
        }
    }
    return componentContents;
}
// Function to correlate test steps with components
function correlateTestsWithComponents(features, componentFiles, componentContents, coverageData) {
    const result = [];
    const coverageMap = new Map();
    // Create coverage map for quicker lookups
    coverageData.forEach(coverage => {
        coverageMap.set(coverage.path, coverage);
    });
    // First handle custom mappings from config
    const customMappedComponents = [];
    for (const componentPath of componentFiles) {
        if (projectConfig.customMappings[componentPath] !== undefined) {
            const componentName = getComponentName(componentPath);
            const componentContent = componentContents[componentPath] || '';
            // Get coverage data for this component
            const coverage = coverageMap.get(componentPath);
            const coveragePercentage = coverage ? coverage.coverage : 0;
            console.log(`Using custom mapping for ${componentPath}`);
            // If custom mapping is explicitly empty, it means no tests
            const correlatedTests = [];
            // Add component with its custom correlated tests to the result
            result.push({
                path: componentPath,
                name: componentName,
                coverage: coveragePercentage,
                correlatedTests
            });
            // Mark this component as already processed
            customMappedComponents.push(componentPath);
        }
    }
    // Then process remaining components
    for (const componentPath of componentFiles) {
        // Skip components we've already processed via custom mappings
        if (customMappedComponents.includes(componentPath)) {
            continue;
        }
        const componentName = getComponentName(componentPath);
        const componentContent = componentContents[componentPath] || '';
        // Get coverage data for this component
        const coverage = coverageMap.get(componentPath);
        const coveragePercentage = coverage ? coverage.coverage : 0;
        // Store all correlated tests for this component
        const correlatedTests = [];
        // Get component imports to help with correlation
        const componentImports = extractImports(componentContent);
        // Extract test IDs from the component
        const testIds = extractTestIds(componentContent);
        console.log(`Component ${componentName} has test IDs: ${JSON.stringify(testIds)}`);
        // For each feature (test file)
        for (const feature of features) {
            const featureContent = fsSync.readFileSync(feature.file, 'utf8').toLowerCase();
            // Extract imports from the test file to see if it directly imports the component
            const testImports = extractImports(featureContent);
            const directlyImportsComponent = testImports.some(imp => {
                // Check if the test imports the component directly
                const importPathNoExt = imp.replace(/\.(tsx|ts|jsx|js)$/, '');
                const componentPathNoExt = componentPath.replace(/\.(tsx|ts|jsx|js)$/, '');
                if (importPathNoExt.endsWith(componentPathNoExt))
                    return true;
                const importParts = importPathNoExt.split('/');
                const componentParts = componentPathNoExt.split('/');
                // Check if the last part (file name) matches
                return importParts[importParts.length - 1] === componentParts[componentParts.length - 1];
            });
            // Check if the test file explicitly mentions the component name
            const mentionsComponent = featureContent.includes(componentName.toLowerCase());
            // Check if the test uses any testIDs from this component
            const usesTestIds = testIds.some(id => featureContent.includes(id.toLowerCase()));
            // Check if this is an E2E test (feature file)
            const isE2ETest = feature.file.endsWith('.feature');
            // For E2E tests, check if any tags match the component's test IDs
            let hasMatchingTag = false;
            let matchingTags = [];
            if (isE2ETest) {
                // Look for @tag annotations in the feature file
                const tagMatches = featureContent.match(/@([a-zA-Z0-9_-]+)/g) || [];
                const tags = tagMatches.map(tag => tag.substring(1).toLowerCase()); // Remove @ prefix
                // Enhanced tag matching logic
                // 1. Direct test ID matches
                const directTagMatches = testIds.filter(id => tags.includes(id.toLowerCase()));
                if (directTagMatches.length > 0) {
                    hasMatchingTag = true;
                    matchingTags.push(...directTagMatches);
                }
                // 2. Component name variations in tags
                const componentNameVariations = [
                    componentName.toLowerCase(),
                    componentName.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''), // PascalCase to snake_case
                    componentName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '') // PascalCase to kebab-case
                ];
                const componentNameMatches = componentNameVariations.filter(name => tags.some(tag => tag.includes(name) || name.includes(tag)));
                if (componentNameMatches.length > 0) {
                    hasMatchingTag = true;
                    matchingTags.push(...componentNameMatches);
                }
                if (hasMatchingTag) {
                    console.log(`Found matching tags ${matchingTags.join(', ')} in E2E feature file ${feature.file} for component ${componentName}`);
                }
            }
            // Process each scenario in the feature
            for (const scenario of feature.scenarios) {
                // Check if scenario name mentions component
                const scenarioMentionsComponent = scenario.name.toLowerCase().includes(componentName.toLowerCase());
                // Process each step in the scenario
                for (const step of scenario.steps) {
                    // Check if step mentions component
                    const stepMentionsComponent = step.text.toLowerCase().includes(componentName.toLowerCase());
                    // Check if step uses testIDs
                    const stepUsesTestIds = testIds.some(id => step.text.toLowerCase().includes(id.toLowerCase()));
                    // Calculate confidence score based on multiple factors
                    let confidence = 0.5; // Base confidence
                    // Different confidence calculation for E2E vs unit tests
                    if (isE2ETest) {
                        confidence = 0.3; // Lower base confidence for E2E tests
                        // Factors that increase confidence for E2E tests
                        if (hasMatchingTag) {
                            confidence += 0.5; // Significant boost for tag matches (increased from 0.4)
                            console.log(`Tag match boosting confidence for ${componentName} in E2E test: ${feature.file}`);
                        }
                        if (stepUsesTestIds) {
                            confidence += 0.4; // Significant boost for test ID mentions in step
                            console.log(`Step uses test IDs for ${componentName} in E2E test: ${feature.file}`);
                        }
                        if (scenarioMentionsComponent) {
                            confidence += 0.3; // Higher boost for component mentions in scenario (E2E)
                            console.log(`Scenario mentions ${componentName} in E2E test: ${feature.file}`);
                        }
                        if (stepMentionsComponent) {
                            confidence += 0.3; // Higher boost for component mentions in step (E2E)
                            console.log(`Step mentions ${componentName} in E2E test: ${feature.file}`);
                        }
                        // If feature name or file path includes component name
                        if (feature.name.toLowerCase().includes(componentName.toLowerCase()) ||
                            feature.file.toLowerCase().includes(componentName.toLowerCase())) {
                            confidence += 0.3;
                            console.log(`Feature name/path contains ${componentName}`);
                        }
                    }
                    else {
                        // Original confidence calculation for unit tests
                        // Factors that increase confidence
                        if (directlyImportsComponent)
                            confidence += 0.3;
                        if (usesTestIds || stepUsesTestIds)
                            confidence += 0.3;
                        if (mentionsComponent)
                            confidence += 0.1;
                        if (scenarioMentionsComponent)
                            confidence += 0.1;
                        if (stepMentionsComponent)
                            confidence += 0.1;
                        // If we have coverage data and it shows coverage, this is a strong indicator
                        if (coverage && coverage.coverage > 0)
                            confidence += 0.2;
                    }
                    // Cap confidence at 1.0
                    confidence = Math.min(confidence, 1.0);
                    // Use a lower threshold for E2E tests
                    const confidenceThreshold = isE2ETest
                        ? Math.max(0.3, projectConfig.confidenceThreshold - 0.1) // Use 0.3 minimum or 0.1 less than project threshold
                        : projectConfig.confidenceThreshold;
                    // Only add test correlations with confidence above threshold
                    if (confidence > confidenceThreshold) {
                        const correlatedTest = {
                            feature: feature.name,
                            scenario: scenario.name,
                            step: step.text,
                            confidence: parseFloat(confidence.toFixed(2)),
                            isE2E: isE2ETest
                        };
                        correlatedTests.push(correlatedTest);
                        if (isE2ETest) {
                            console.log(`Added E2E correlation for ${componentName}: ${feature.name} > ${scenario.name} with confidence ${confidence.toFixed(2)}`);
                        }
                    }
                    else if (isE2ETest && confidence > 0.2) {
                        // Log near-miss E2E correlations for debugging
                        console.log(`Near-miss E2E correlation for ${componentName}: ${feature.name} > ${scenario.name} with confidence ${confidence.toFixed(2)} (threshold: ${confidenceThreshold})`);
                    }
                }
            }
        }
        // Sort correlated tests by confidence (highest first)
        correlatedTests.sort((a, b) => b.confidence - a.confidence);
        // Add component with its correlated tests to the result
        result.push({
            path: componentPath,
            name: componentName,
            coverage: coveragePercentage,
            correlatedTests
        });
    }
    return result;
}
// Helper function to extract test IDs from component content
function extractTestIds(content) {
    const testIds = [];
    // Match data-testid attributes in JSX
    const dataTestIdMatches = content.match(/data-testid=["']([^"']+)["']/g);
    if (dataTestIdMatches) {
        dataTestIdMatches.forEach(match => {
            const id = match.match(/data-testid=["']([^"']+)["']/)?.[1];
            if (id)
                testIds.push(id);
        });
    }
    // Match testID props in React Native
    const testIdMatches = content.match(/testID=["']([^"']+)["']/g);
    if (testIdMatches) {
        testIdMatches.forEach(match => {
            const id = match.match(/testID=["']([^"']+)["']/)?.[1];
            if (id)
                testIds.push(id);
        });
    }
    return testIds;
}
// Helper function to extract import statements
function extractImports(content) {
    const imports = [];
    // Match ES6 imports
    const importMatches = content.matchAll(/import\s+(?:[\w\s{},*]+\s+from\s+)?["']([^"']+)["']/g);
    for (const match of importMatches) {
        if (match[1])
            imports.push(match[1]);
    }
    // Match require statements
    const requireMatches = content.matchAll(/require\s*\(\s*["']([^"']+)["']\s*\)/g);
    for (const match of requireMatches) {
        if (match[1])
            imports.push(match[1]);
    }
    return imports;
}
// Function to perform gap analysis on components
function performGapAnalysis(components) {
    for (const component of components) {
        // Initialize gap analysis object
        const gapAnalysis = {
            testingPriority: 'low',
            missingCoverage: [],
            recommendedTests: []
        };
        // Determine testing priority
        if (component.coverage < 40) {
            gapAnalysis.testingPriority = 'high';
        }
        else if (component.coverage < 70) {
            gapAnalysis.testingPriority = 'medium';
        }
        else if (component.correlatedTests.length === 0) {
            // High coverage but no direct tests is medium priority
            gapAnalysis.testingPriority = 'medium';
        }
        try {
            // Read component file to analyze uncovered code paths
            const componentContent = fsSync.readFileSync(component.path, 'utf8');
            const lines = componentContent.split('\n');
            // Look for functions that might need testing
            const functionMatches = componentContent.match(/function\s+(\w+)\s*\(.*?\)/g);
            const methodMatches = componentContent.match(/(\w+)\s*\(.*?\)\s*{/g);
            const allFunctions = [
                ...(functionMatches || []).map(f => f.match(/function\s+(\w+)/)?.[1] || ''),
                ...(methodMatches || []).map(m => m.match(/(\w+)\s*\(/)?.[1] || '')
            ].filter(f => f && !f.match(/^(if|for|while|switch|catch)$/));
            // Check if component is React component
            const isReactComponent = componentContent.includes('React') ||
                componentContent.includes('react') ||
                componentContent.includes('jsx') ||
                componentContent.includes('tsx');
            // Check for props interface or type
            const propsMatch = componentContent.match(/interface\s+(\w+)Props/);
            const hasProps = !!propsMatch;
            // Look for hooks
            const hooksMatches = [...componentContent.matchAll(/use\w+\(/g)];
            const hooks = hooksMatches.map(m => m[0].replace('(', ''));
            // Check for event handlers
            const eventHandlerMatches = [...componentContent.matchAll(/on\w+\s*[=:]/g)];
            const eventHandlers = eventHandlerMatches.map(m => m[0].replace(/[=:\s]/g, ''));
            // Check for conditionals that might need different test cases
            const conditionalCount = (componentContent.match(/if\s*\(/g) || []).length;
            // Generate missing coverage analysis
            if (component.coverage < 100) {
                if (isReactComponent) {
                    if (component.correlatedTests.length === 0) {
                        gapAnalysis.missingCoverage.push('Basic component rendering');
                    }
                    if (hasProps && !componentContent.includes('defaultProps')) {
                        gapAnalysis.missingCoverage.push('Testing with different prop values');
                    }
                    if (eventHandlers.length > 0) {
                        gapAnalysis.missingCoverage.push('Event handler interactions');
                    }
                    if (hooks.length > 0) {
                        gapAnalysis.missingCoverage.push('Hook lifecycle testing');
                    }
                    if (conditionalCount > 0) {
                        gapAnalysis.missingCoverage.push('Conditional rendering paths');
                    }
                }
                else {
                    // Non-React component (likely utility)
                    if (allFunctions.length > 0) {
                        gapAnalysis.missingCoverage.push('Function call testing');
                    }
                    if (conditionalCount > 0) {
                        gapAnalysis.missingCoverage.push('Conditional branch testing');
                    }
                    if (componentContent.includes('try') && componentContent.includes('catch')) {
                        gapAnalysis.missingCoverage.push('Error handling testing');
                    }
                }
            }
            // Generate recommended tests
            if (isReactComponent) {
                if (component.correlatedTests.length === 0) {
                    gapAnalysis.recommendedTests.push(`Basic render test for ${component.name}`);
                }
                if (hasProps) {
                    const propsInterfaceName = propsMatch[1];
                    gapAnalysis.recommendedTests.push(`Test ${component.name} with different ${propsInterfaceName}Props combinations`);
                }
                for (const handler of eventHandlers.slice(0, 3)) { // Limit to 3 suggestions
                    gapAnalysis.recommendedTests.push(`Test ${handler} interaction`);
                }
                if (componentContent.includes('useState')) {
                    gapAnalysis.recommendedTests.push(`Test state changes in ${component.name}`);
                }
            }
            else {
                // For utility functions
                for (const func of allFunctions.slice(0, 3)) { // Limit to 3 suggestions
                    gapAnalysis.recommendedTests.push(`Unit test for ${func}() function`);
                }
                if (conditionalCount > 0) {
                    gapAnalysis.recommendedTests.push(`Test different conditional branches`);
                }
                if (componentContent.includes('throw')) {
                    gapAnalysis.recommendedTests.push(`Test error handling scenarios`);
                }
            }
            // If we have direct tests but low confidence, suggest improving existing tests
            const lowConfidenceTests = component.correlatedTests.filter(t => t.confidence < 0.5);
            if (lowConfidenceTests.length > 0 && component.correlatedTests.length > 0) {
                gapAnalysis.recommendedTests.push(`Improve test correlation by using direct component references`);
            }
        }
        catch (error) {
            console.warn(`Could not perform full gap analysis for ${component.name}: ${error}`);
        }
        // Add gap analysis to component
        component.gapAnalysis = gapAnalysis;
    }
}
// Add a new function to find E2E feature files
async function findE2EFeatureFiles(dir) {
    const e2eFiles = [];
    const excludePatterns = projectConfig.excludeTestPatterns || [];
    console.log(`Finding E2E feature files in directory: ${dir}`);
    function shouldExcludeE2EFile(filePath) {
        return excludePatterns.some(pattern => {
            // Handle glob patterns
            if (pattern.includes('*')) {
                const regexPattern = pattern
                    .replace(/\./g, '\\.')
                    .replace(/\*\*/g, '.*')
                    .replace(/\*/g, '[^/]*');
                const regex = new RegExp(regexPattern);
                return regex.test(filePath);
            }
            return filePath.includes(pattern);
        });
    }
    async function search(directory) {
        try {
            const entries = await fs.readdir(directory, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(directory, entry.name);
                if (entry.isDirectory() && !fullPath.includes('node_modules') && !fullPath.includes('.git')) {
                    await search(fullPath);
                }
                else if (entry.isFile() && entry.name.endsWith('.feature') && !shouldExcludeE2EFile(fullPath)) {
                    console.log(`Found E2E feature file: ${fullPath}`);
                    e2eFiles.push(fullPath);
                }
            }
        }
        catch (error) {
            console.error(`Error searching directory ${directory}: ${error}`);
        }
    }
    // First do a targeted search in common locations
    const potentialE2ePaths = [
        path.join(dir, 'e2e'),
        path.join(dir, 'features'),
        path.join(dir, 'e2e', 'features'),
        path.join(dir, 'cypress'),
        path.join(dir, 'cypress', 'integration'),
        path.join(dir, 'cypress', 'e2e'),
        path.join(dir, 'test', 'e2e'),
        path.join(dir, 'tests', 'e2e'),
        path.join(dir, 'specs'),
        path.join(dir, 'src', 'e2e'),
        path.join(dir, '__tests__', 'e2e'),
        dir // Also search the root directory
    ];
    for (const potentialPath of potentialE2ePaths) {
        try {
            const stats = await fs.stat(potentialPath);
            if (stats.isDirectory()) {
                console.log(`Searching for feature files in: ${potentialPath}`);
                await search(potentialPath);
            }
        }
        catch (error) {
            // Directory doesn't exist, skip
        }
    }
    // If targeted search didn't find anything, try a broader search
    if (e2eFiles.length === 0) {
        console.log("No feature files found in common locations. Performing broader search...");
        try {
            await search(dir);
        }
        catch (error) {
            console.error(`Error during broader search: ${error}`);
        }
    }
    console.log(`Total E2E feature files found: ${e2eFiles.length}`);
    return e2eFiles;
}
// Add a function to extract scenarios and steps from feature files
async function extractE2EScenarios(featureFiles) {
    const features = [];
    for (const file of featureFiles) {
        try {
            const content = await fs.readFile(file, 'utf8');
            const lines = content.split('\n');
            let featureName = '';
            let inFeature = false;
            let currentScenario = null;
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line.startsWith('Feature:')) {
                    inFeature = true;
                    featureName = line.substring('Feature:'.length).trim();
                }
                else if (inFeature && line.startsWith('Scenario:')) {
                    // If we already have a scenario, add it to our list
                    if (currentScenario) {
                        if (!features.find(f => f.file === file)) {
                            features.push({
                                name: featureName,
                                file,
                                scenarios: []
                            });
                        }
                        features.find(f => f.file === file)?.scenarios.push(currentScenario);
                    }
                    // Start a new scenario
                    currentScenario = {
                        name: line.substring('Scenario:'.length).trim(),
                        steps: []
                    };
                }
                else if (currentScenario && (line.startsWith('Given ') || line.startsWith('When ') ||
                    line.startsWith('Then ') || line.startsWith('And ') ||
                    line.startsWith('But '))) {
                    // Add step to current scenario
                    currentScenario.steps.push({
                        text: line,
                        file,
                        line: i + 1
                    });
                }
            }
            // Add the last scenario if we have one
            if (currentScenario && inFeature) {
                if (!features.find(f => f.file === file)) {
                    features.push({
                        name: featureName,
                        file,
                        scenarios: []
                    });
                }
                features.find(f => f.file === file)?.scenarios.push(currentScenario);
            }
        }
        catch (error) {
            console.error(`Error processing feature file ${file}: ${error}`);
        }
    }
    return features;
}
async function main() {
    try {
        console.log('Starting test-component correlation analysis...');
        // Step 1: Get component coverage data
        let coverageData = [];
        try {
            const coverageContent = await fs.readFile(COMPONENT_COVERAGE_PATH, 'utf8');
            coverageData = JSON.parse(coverageContent);
            console.log(`Loaded coverage data for ${coverageData.length} components.`);
        }
        catch (error) {
            console.warn('No coverage data found. Run analyze-mock-coverage.ts first.');
            coverageData = [];
        }
        // This ensures we use the most up-to-date coverage data
        const coverageMap = new Map();
        for (const component of coverageData) {
            coverageMap.set(component.path, component);
        }
        // Use PROJECT_ROOT_DIR for components if available, otherwise fall back to MOCKS_DIR
        console.log(`Looking for component files in: ${SRC_DIR}`);
        const componentFiles = await findComponentFiles(SRC_DIR);
        console.log(`Found ${componentFiles.length} component files.`);
        // For test files, also prioritize PROJECT_ROOT if available
        const testDir = process.env.PROJECT_ROOT ? PROJECT_ROOT_DIR : MOCKS_DIR;
        console.log(`Looking for test files in: ${testDir}`);
        const testFiles = await findTestFiles(testDir);
        console.log(`Found ${testFiles.length} test files.`);
        // Step 4: Find E2E feature files
        // Look in multiple potential locations for E2E tests
        let e2eFiles = [];
        if (PROJECT_ROOT_DIR) {
            console.log(`Searching for E2E feature files in project root: ${PROJECT_ROOT_DIR}`);
            e2eFiles = await findE2EFeatureFiles(PROJECT_ROOT_DIR);
        }
        console.log(`Found ${e2eFiles.length} E2E feature files.`);
        // Step 5: Extract test steps
        const features = await extractTestSteps(testFiles);
        console.log(`Extracted ${features.length} features with steps.`);
        // Step 6: Extract E2E scenarios
        const e2eFeatures = await extractE2EScenarios(e2eFiles);
        console.log(`Extracted ${e2eFeatures.length} E2E features with scenarios.`);
        // Add debugging for E2E features
        if (e2eFeatures.length > 0) {
            console.log(`E2E Feature example: ${e2eFeatures[0].name} from ${e2eFeatures[0].file}`);
            console.log(`E2E Feature has ${e2eFeatures[0].scenarios.length} scenarios`);
            if (e2eFeatures[0].scenarios.length > 0) {
                console.log(`First scenario: ${e2eFeatures[0].scenarios[0].name}`);
                console.log(`First scenario has ${e2eFeatures[0].scenarios[0].steps.length} steps`);
            }
        }
        else {
            console.log('E2E features array is empty. Possible reasons:');
            console.log('1. No .feature files were found in any of the searched directories');
            console.log('2. Feature files exist but could not be parsed correctly');
            console.log('3. Feature files exist but were excluded by pattern');
            // Search for feature files in the entire project as a fallback
            console.log('Attempting to find any .feature files in the project as a diagnostic step...');
            const allFeatureFiles = [];
            async function searchAllFeatures(dir) {
                try {
                    const entries = await fs.readdir(dir, { withFileTypes: true });
                    for (const entry of entries) {
                        const fullPath = path.join(dir, entry.name);
                        if (entry.isDirectory() && !fullPath.includes('node_modules') && !fullPath.includes('.git')) {
                            await searchAllFeatures(fullPath);
                        }
                        else if (entry.isFile() && entry.name.endsWith('.feature')) {
                            allFeatureFiles.push(fullPath);
                        }
                    }
                }
                catch (error) {
                    // Skip directories we can't read
                }
            }
            await searchAllFeatures(process.cwd());
            if (allFeatureFiles.length > 0) {
                console.log(`Found ${allFeatureFiles.length} feature files in the project that were not processed:`);
                allFeatureFiles.forEach(file => console.log(`  - ${file}`));
                console.log('These files were not processed. Attempting to process them now...');
                // Try to process these files
                const fallbackFeatures = await extractE2EScenarios(allFeatureFiles);
                console.log(`Extracted ${fallbackFeatures.length} fallback E2E features with scenarios.`);
                if (fallbackFeatures.length > 0) {
                    e2eFeatures.push(...fallbackFeatures);
                    console.log(`Added ${fallbackFeatures.length} fallback features to E2E features.`);
                }
            }
            else {
                console.log('No feature files found in the entire project. E2E tests may not exist or may be in a different format.');
            }
        }
        // Step 7: Read component contents
        const componentContents = await scanComponents(componentFiles);
        // Step 8: Combine unit test features and E2E features
        const allFeatures = [...features, ...e2eFeatures];
        // Step 9: Correlate test steps with components
        const correlations = correlateTestsWithComponents(allFeatures, componentFiles, componentContents, coverageData);
        // If we're in project mode, make sure we use the correct component paths
        if (COVERAGE_SOURCE === 'project') {
            try {
                // Load the project component coverage data
                const projectComponentCoveragePath = path.resolve(process.cwd(), 'coverage-analysis', 'project-component-coverage.json');
                const projectComponentCoverage = JSON.parse(await fs.readFile(projectComponentCoveragePath, 'utf8'));
                console.log(`Loaded ${projectComponentCoverage.length} components from project coverage data`);
                // Update the component paths in the correlated components
                for (const component of correlations) {
                    // Get the basename and the component name for more robust matching
                    const componentBasename = path.basename(component.path);
                    const componentName = component.name.toLowerCase();
                    // Try several matching strategies in order of preference
                    let matchingComponent = null;
                    // 1. Direct path basename match
                    matchingComponent = projectComponentCoverage.find((c) => path.basename(c.path) === componentBasename);
                    // 2. If no match, try matching by component name in the path
                    if (!matchingComponent) {
                        matchingComponent = projectComponentCoverage.find((c) => {
                            const projPath = c.path.toLowerCase();
                            return projPath.includes(`/${componentName}.`) ||
                                projPath.includes(`/${componentName}/`) ||
                                projPath.endsWith(`/${componentName}`);
                        });
                    }
                    // 3. Try matching by similar basename (ignoring case and file extension)
                    if (!matchingComponent) {
                        const baseWithoutExt = componentBasename.replace(/\.(tsx|ts|jsx|js)$/, '').toLowerCase();
                        matchingComponent = projectComponentCoverage.find((c) => {
                            const projBasename = path.basename(c.path).replace(/\.(tsx|ts|jsx|js)$/, '').toLowerCase();
                            return projBasename === baseWithoutExt;
                        });
                    }
                    if (matchingComponent) {
                        console.log(`Updating component path for ${component.name} from ${component.path} to ${matchingComponent.path}`);
                        component.path = matchingComponent.path;
                    }
                    else {
                        console.log(`Could not find matching project path for component: ${component.name} (${componentBasename})`);
                        // If path contains __mocks__ and we have PROJECT_ROOT, try to create a plausible path
                        if (component.path.includes('__mocks__') && process.env.PROJECT_ROOT) {
                            // Extract the relative path after __mocks__/src
                            const mockPathRegex = /__mocks__\/src\/(.+)$/;
                            const match = component.path.match(mockPathRegex);
                            if (match && match[1]) {
                                const relativePath = match[1];
                                const projectedPath = path.join(PROJECT_ROOT_DIR, 'src', relativePath);
                                console.log(`Attempting to create projected path: ${projectedPath}`);
                                // Check if the projected path exists
                                try {
                                    if (fsSync.existsSync(projectedPath)) {
                                        console.log(`Projected path exists, updating component path to: ${projectedPath}`);
                                        component.path = projectedPath;
                                    }
                                }
                                catch (err) {
                                    console.error(`Error checking projected path: ${err}`);
                                }
                            }
                            else {
                                console.log(`Could not extract relative path from ${component.path}`);
                            }
                        }
                    }
                }
            }
            catch (error) {
                console.error('Error updating component paths:', error);
            }
        }
        // Step 10: Perform gap analysis
        performGapAnalysis(correlations);
        // Step 11: Output correlation data
        await fs.mkdir(COVERAGE_DIR, { recursive: true });
        await fs.writeFile(CORRELATION_OUTPUT_PATH, JSON.stringify(correlations, null, 2), 'utf8');
        // Step 12: Print summary
        console.log(`\nCorrelation analysis complete. Results saved to ${CORRELATION_OUTPUT_PATH}`);
        // Count E2E tests for reporting
        let totalE2ECorrelations = 0;
        for (const component of correlations) {
            // Get the latest coverage info if available
            const coverage = coverageMap.get(component.path);
            if (coverage) {
                component.coverage = coverage.coverage;
            }
            // Count E2E tests for this component
            const e2eTests = component.correlatedTests.filter(test => test.isE2E);
            totalE2ECorrelations += e2eTests.length;
            console.log(`\nComponent: ${component.name} (${component.path})`);
            console.log(`Coverage: ${component.coverage.toFixed(2)}%`);
            if (component.correlatedTests && component.correlatedTests.length > 0) {
                console.log('Related Tests:');
                // Display unit tests
                const unitTests = component.correlatedTests.filter(test => !test.isE2E);
                if (unitTests.length > 0) {
                    console.log('Unit Tests:');
                    // Display top 5 most confident unit test correlations
                    for (let i = 0; i < Math.min(5, unitTests.length); i++) {
                        const test = unitTests[i];
                        const confidenceLabel = test.confidence >= 0.7 ? 'High' :
                            test.confidence >= 0.4 ? 'Medium' : 'Low';
                        console.log(`  - ${test.feature} > ${test.scenario}`);
                        console.log(`    Step: ${test.step}`);
                        console.log(`    Confidence: ${confidenceLabel} (${test.confidence.toFixed(2)})`);
                    }
                    if (unitTests.length > 5) {
                        console.log(`  ... and ${unitTests.length - 5} more unit tests`);
                    }
                }
                // Display E2E tests separately
                if (e2eTests.length > 0) {
                    console.log('E2E Tests:');
                    // Display all E2E test correlations
                    for (let i = 0; i < e2eTests.length; i++) {
                        const test = e2eTests[i];
                        const confidenceLabel = test.confidence >= 0.7 ? 'High' :
                            test.confidence >= 0.4 ? 'Medium' : 'Low';
                        console.log(`  - ${test.feature} > ${test.scenario}`);
                        console.log(`    Step: ${test.step}`);
                        console.log(`    Confidence: ${confidenceLabel} (${test.confidence.toFixed(2)})`);
                    }
                }
                else {
                    console.log('No E2E tests found for this component.');
                }
            }
            else {
                console.log('No related tests found.');
            }
            // Print gap analysis
            if (component.gapAnalysis) {
                console.log(`Testing Priority: ${component.gapAnalysis.testingPriority}`);
                if (component.gapAnalysis.missingCoverage.length > 0) {
                    console.log('Missing Coverage:');
                    component.gapAnalysis.missingCoverage.forEach(gap => {
                        console.log(`  - ${gap}`);
                    });
                }
                if (component.gapAnalysis.recommendedTests.length > 0) {
                    console.log('Recommended Tests:');
                    component.gapAnalysis.recommendedTests.forEach(recommendation => {
                        console.log(`  - ${recommendation}`);
                    });
                }
            }
        }
        console.log(`\nFound ${totalE2ECorrelations} E2E test correlations across all components.`);
    }
    catch (error) {
        console.error('Error in correlation analysis:', error);
        process.exit(1);
    }
}
main();
