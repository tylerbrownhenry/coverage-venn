import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import { ComponentHierarchyScanner } from '../../../src/scanners/ComponentHierarchyScanner';
import { getProjectConfig } from '../../../config/project-config';

// Get project-specific config
const PROJECT_NAME = process.env.PROJECT_NAME || 'default';
const projectConfig = getProjectConfig(PROJECT_NAME);
console.log(`Using configuration for project: ${PROJECT_NAME}`);
console.log(`Exclude patterns: ${JSON.stringify(projectConfig.excludeTestPatterns)}`);
console.log(`Confidence threshold: ${projectConfig.confidenceThreshold}`);

// Determine coverage source from environment variable
const COVERAGE_SOURCE = process.env.COVERAGE_SOURCE || 'standard';

// Path constants
const COVERAGE_DIR = path.resolve(process.cwd(), 'coverage');
const BABEL_COVERAGE_DIR = path.resolve(process.cwd(), 'coverage-babel');
const MOCK_COVERAGE_DIR = path.resolve(process.cwd(), 'coverage-analysis');

// Define paths based on coverage source
const COMPONENT_COVERAGE_PATH = COVERAGE_SOURCE === 'babel'
  ? path.resolve(BABEL_COVERAGE_DIR, 'component-coverage.json')
  : path.resolve(MOCK_COVERAGE_DIR, 'mock-component-coverage.json');

const CORRELATION_OUTPUT_PATH = 
  COVERAGE_SOURCE === 'babel' ? path.resolve(BABEL_COVERAGE_DIR, 'test-component-correlation.json') :
  COVERAGE_SOURCE === 'project' ? path.resolve(process.cwd(), 'coverage-analysis', 'project-test-component-correlation.json') :
  path.resolve(COVERAGE_DIR, 'test-component-correlation.json');

const MOCKS_DIR = path.resolve(process.cwd(), '__mocks__');

// Interface for test step correlation
interface TestStep {
  text: string;
  file: string;
  line: number;
}

// Interface for Feature
interface Feature {
  name: string;
  file: string;
  scenarios: {
    name: string;
    steps: TestStep[];
  }[];
}

// Interface for Component with correlated tests
interface ComponentWithTests {
  path: string;
  name: string;
  coverage: number;
  correlatedTests: {
    feature: string;
    scenario: string;
    step: string;
    confidence: number;
  }[];
  gapAnalysis?: {
    testingPriority: 'high' | 'medium' | 'low';
    missingCoverage: string[];
    recommendedTests: string[];
  };
}

// Function to extract component name from path
function getComponentName(componentPath: string): string {
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
async function findComponentFiles(dir: string): Promise<string[]> {
  const componentFiles: string[] = [];
  
  async function search(directory: string): Promise<void> {
    const files = await fs.readdir(directory, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = path.join(directory, file.name);
      
      if (file.isDirectory()) {
        await search(filePath);
      } else if (
        (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) &&
        !file.name.includes('.test.') && 
        !file.name.includes('.spec.') && 
        !filePath.includes('__tests__')
      ) {
        componentFiles.push(filePath);
      }
    }
  }
  
  await search(dir);
  return componentFiles;
}

// Function to find all test files
async function findTestFiles(dir: string): Promise<string[]> {
  const testFiles: string[] = [];
  
  // Helper to check if a file should be excluded
  function shouldExcludeTestFile(filePath: string): boolean {
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
  
  async function search(directory: string): Promise<void> {
    const files = await fs.readdir(directory, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = path.join(directory, file.name);
      
      if (file.isDirectory()) {
        await search(filePath);
      } else if (
        (file.name.endsWith('.test.tsx') || 
        file.name.endsWith('.test.ts') || 
        file.name.endsWith('.spec.tsx') || 
        file.name.endsWith('.spec.ts') ||
        file.name.endsWith('.feature'))
      ) {
        if (shouldExcludeTestFile(filePath)) {
          console.log(`Excluding test file based on pattern: ${filePath}`);
        } else {
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
async function extractTestSteps(testFiles: string[]): Promise<Feature[]> {
  const features: Feature[] = [];
  
  for (const file of testFiles) {
    const content = await fs.readFile(file, 'utf8');
    const lines = content.split('\n');
    
    // Simple feature file detection (Cucumber)
    if (file.endsWith('.feature')) {
      let currentFeature: Feature | null = null;
      let currentScenario: { name: string; steps: TestStep[] } | null = null;
      
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
        } else if (line.startsWith('Scenario:') && currentFeature) {
          const scenarioName = line.substring('Scenario:'.length).trim();
          currentScenario = {
            name: scenarioName,
            steps: []
          };
          currentFeature.scenarios.push(currentScenario);
        } else if (/^(Given|When|Then|And|But)/.test(line) && currentScenario) {
          const stepText = line.trim();
          currentScenario.steps.push({
            text: stepText,
            file,
            line: i + 1
          });
        }
      }
    } else {
      // Jest/Enzyme/RTL test file
      let currentDescribe = '';
      let currentIt = '';
      
      const feature: Feature = {
        name: path.basename(file).replace(/\.(test|spec)\.(tsx|ts)$/, ''),
        file,
        scenarios: []
      };
      
      let currentScenario: { name: string; steps: TestStep[] } | null = null;
      
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
        } else if (line.includes('it(') || line.includes('test(')) {
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
        } else if (
          line.includes('render(') || 
          line.includes('screen.getBy') ||
          line.includes('expect(') ||
          line.includes('fireEvent')
        ) {
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
async function scanComponents(componentPaths: string[]): Promise<Record<string, string>> {
  const componentContents: Record<string, string> = {};
  
  for (const componentPath of componentPaths) {
    try {
      const content = await fs.readFile(componentPath, 'utf8');
      componentContents[componentPath] = content;
    } catch (error) {
      console.warn(`Could not read component file ${componentPath}: ${error}`);
      componentContents[componentPath] = '';
    }
  }
  
  return componentContents;
}

// Function to correlate test steps with components
function correlateTestsWithComponents(
  features: Feature[],
  componentFiles: string[],
  componentContents: Record<string, string>,
  coverageData: any[]
): ComponentWithTests[] {
  const result: ComponentWithTests[] = [];
  const coverageMap = new Map<string, any>();
  
  // Create coverage map for quicker lookups
  coverageData.forEach(coverage => {
    coverageMap.set(coverage.path, coverage);
  });
  
  // First handle custom mappings from config
  const customMappedComponents: string[] = [];
  for (const componentPath of componentFiles) {
    if (projectConfig.customMappings[componentPath] !== undefined) {
      const componentName = getComponentName(componentPath);
      const componentContent = componentContents[componentPath] || '';
      
      // Get coverage data for this component
      const coverage = coverageMap.get(componentPath);
      const coveragePercentage = coverage ? coverage.coverage : 0;
      
      console.log(`Using custom mapping for ${componentPath}`);
      
      // If custom mapping is explicitly empty, it means no tests
      const correlatedTests: {
        feature: string;
        scenario: string;
        step: string;
        confidence: number;
      }[] = [];
      
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
    const correlatedTests: {
      feature: string;
      scenario: string;
      step: string;
      confidence: number;
    }[] = [];
    
    // Get component imports to help with correlation
    const componentImports = extractImports(componentContent);
    
    // Extract test IDs from the component
    const testIds = extractTestIds(componentContent);
    
    // For each feature (test file)
    for (const feature of features) {
      const featureContent = fsSync.readFileSync(feature.file, 'utf8').toLowerCase();
      
      // Extract imports from the test file to see if it directly imports the component
      const testImports = extractImports(featureContent);
      const directlyImportsComponent = testImports.some(imp => {
        // Check if the test imports the component directly
        const importPathNoExt = imp.replace(/\.(tsx|ts|jsx|js)$/, '');
        const componentPathNoExt = componentPath.replace(/\.(tsx|ts|jsx|js)$/, '');
        
        if (importPathNoExt.endsWith(componentPathNoExt)) return true;
        
        const importParts = importPathNoExt.split('/');
        const componentParts = componentPathNoExt.split('/');
        
        // Check if the last part (file name) matches
        return importParts[importParts.length - 1] === componentParts[componentParts.length - 1];
      });
      
      // Check if the test file explicitly mentions the component name
      const mentionsComponent = featureContent.includes(componentName.toLowerCase());
      
      // Check if the test uses any testIDs from this component
      const usesTestIds = testIds.some(id => featureContent.includes(id.toLowerCase()));
      
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
          
          // Factors that increase confidence
          if (directlyImportsComponent) confidence += 0.3;
          if (usesTestIds || stepUsesTestIds) confidence += 0.3;
          if (mentionsComponent) confidence += 0.1;
          if (scenarioMentionsComponent) confidence += 0.1;
          if (stepMentionsComponent) confidence += 0.1;
          
          // If we have coverage data and it shows coverage, this is a strong indicator
          if (coverage && coverage.coverage > 0) confidence += 0.2;
          
          // Cap confidence at 1.0
          confidence = Math.min(confidence, 1.0);
          
          // Only add test correlations with confidence above project-specific threshold
          if (confidence > projectConfig.confidenceThreshold) {
            correlatedTests.push({
              feature: feature.name,
              scenario: scenario.name,
              step: step.text,
              confidence: parseFloat(confidence.toFixed(2))
            });
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
function extractTestIds(content: string): string[] {
  const testIds: string[] = [];
  
  // Match data-testid attributes in JSX
  const dataTestIdMatches = content.match(/data-testid=["']([^"']+)["']/g);
  if (dataTestIdMatches) {
    dataTestIdMatches.forEach(match => {
      const id = match.match(/data-testid=["']([^"']+)["']/)?.[1];
      if (id) testIds.push(id);
    });
  }
  
  // Match testID props in React Native
  const testIdMatches = content.match(/testID=["']([^"']+)["']/g);
  if (testIdMatches) {
    testIdMatches.forEach(match => {
      const id = match.match(/testID=["']([^"']+)["']/)?.[1];
      if (id) testIds.push(id);
    });
  }
  
  return testIds;
}

// Helper function to extract import statements
function extractImports(content: string): string[] {
  const imports: string[] = [];
  
  // Match ES6 imports
  const importMatches = content.matchAll(/import\s+(?:[\w\s{},*]+\s+from\s+)?["']([^"']+)["']/g);
  for (const match of importMatches) {
    if (match[1]) imports.push(match[1]);
  }
  
  // Match require statements
  const requireMatches = content.matchAll(/require\s*\(\s*["']([^"']+)["']\s*\)/g);
  for (const match of requireMatches) {
    if (match[1]) imports.push(match[1]);
  }
  
  return imports;
}

// Function to perform gap analysis on components
function performGapAnalysis(components: ComponentWithTests[]): void {
  for (const component of components) {
    // Initialize gap analysis object
    const gapAnalysis = {
      testingPriority: 'low' as 'high' | 'medium' | 'low',
      missingCoverage: [] as string[],
      recommendedTests: [] as string[]
    };
    
    // Determine testing priority
    if (component.coverage < 40) {
      gapAnalysis.testingPriority = 'high';
    } else if (component.coverage < 70) {
      gapAnalysis.testingPriority = 'medium';
    } else if (component.correlatedTests.length === 0) {
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
        } else {
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
          const propsInterfaceName = propsMatch![1];
          gapAnalysis.recommendedTests.push(`Test ${component.name} with different ${propsInterfaceName}Props combinations`);
        }
        
        for (const handler of eventHandlers.slice(0, 3)) { // Limit to 3 suggestions
          gapAnalysis.recommendedTests.push(`Test ${handler} interaction`);
        }
        
        if (componentContent.includes('useState')) {
          gapAnalysis.recommendedTests.push(`Test state changes in ${component.name}`);
        }
      } else {
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
      
    } catch (error) {
      console.warn(`Could not perform full gap analysis for ${component.name}: ${error}`);
    }
    
    // Add gap analysis to component
    component.gapAnalysis = gapAnalysis;
  }
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
    } catch (error) {
      console.warn('No coverage data found. Run analyze-mock-coverage.ts first.');
      coverageData = [];
    }
    
    // This ensures we use the most up-to-date coverage data
    const coverageMap = new Map<string, any>();
    for (const component of coverageData) {
      coverageMap.set(component.path, component);
    }
    
    // Step 2: Find all component files in __mocks__ directory
    const componentFiles = await findComponentFiles(MOCKS_DIR);
    console.log(`Found ${componentFiles.length} component files in __mocks__.`);
    
    // Step 3: Find all test files
    const testFiles = await findTestFiles(MOCKS_DIR);
    console.log(`Found ${testFiles.length} test files.`);
    
    // Step 4: Extract test steps
    const features = await extractTestSteps(testFiles);
    console.log(`Extracted ${features.length} features with steps.`);
    
    // Step 5: Read component contents
    const componentContents = await scanComponents(componentFiles);
    
    // Step 6: Correlate test steps with components
    const correlations = correlateTestsWithComponents(
      features,
      componentFiles,
      componentContents,
      coverageData
    );
    
    // Step 7: Perform gap analysis
    performGapAnalysis(correlations);
    
    // Step 8: Output correlation data
    await fs.mkdir(COVERAGE_DIR, { recursive: true });
    await fs.writeFile(
      CORRELATION_OUTPUT_PATH,
      JSON.stringify(correlations, null, 2),
      'utf8'
    );
    
    // Step 9: Print summary
    console.log(`\nCorrelation analysis complete. Results saved to ${CORRELATION_OUTPUT_PATH}`);
    
    for (const component of correlations) {
      // Get the latest coverage info if available
      const coverage = coverageMap.get(component.path);
      if (coverage) {
        component.coverage = coverage.coverage;
      }
      
      console.log(`\nComponent: ${component.name} (${component.path})`);
      console.log(`Coverage: ${component.coverage.toFixed(2)}%`);
      
      if (component.correlatedTests && component.correlatedTests.length > 0) {
        console.log('Related Tests:');
        
        // Display top 5 most confident correlations
        for (let i = 0; i < Math.min(5, component.correlatedTests.length); i++) {
          const test = component.correlatedTests[i];
          const confidenceLabel = 
            test.confidence >= 0.7 ? 'High' :
            test.confidence >= 0.4 ? 'Medium' : 'Low';
          
          console.log(`  - ${test.feature} > ${test.scenario}`);
          console.log(`    Step: ${test.step}`);
          console.log(`    Confidence: ${confidenceLabel} (${test.confidence.toFixed(2)})`);
        }
        
        if (component.correlatedTests.length > 5) {
          console.log(`  ... and ${component.correlatedTests.length - 5} more`);
        }
      } else {
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
  } catch (error) {
    console.error('Error in correlation analysis:', error);
    process.exit(1);
  }
}

main(); 