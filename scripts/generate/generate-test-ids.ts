import * as fs from 'fs/promises';
import * as path from 'path';
import { parse } from '@babel/parser';
import { ComponentHierarchyScanner } from '../src/scanners/ComponentHierarchyScanner';
import { TestIdGenerator } from '../src/validators/TestIdGenerator';

async function generateTestIds() {
  try {
    // Set the scanner config to use the mock config
    process.env.SCANNER_CONFIG_PATH = path.resolve(__dirname, '../config/scanner.mock.config.js');
    
    console.log('Starting TestID generation for mock app...');
    console.log('Using config:', process.env.SCANNER_CONFIG_PATH);
    
    // Initialize scanners
    const scanner = new ComponentHierarchyScanner();
    const generator = new TestIdGenerator();
    
    // Path to mock app
    const mockAppPath = path.join(__dirname, '../__mocks__/src');
    console.log('Scanning mock app at:', mockAppPath);
    
    // Scan for components
    const componentHierarchy = await scanner.scanDirectory(mockAppPath);
    
    console.log(`Found ${componentHierarchy.size} components. Analyzing for TestID recommendations...`);
    
    // Generate recommendations for each component
    const allRecommendations: Record<string, any> = {};
    
    for (const [name, component] of componentHierarchy.entries()) {
      console.log(`\nAnalyzing component: ${name}`);
      console.log('Path:', component.path);
      
      // Read the component file
      const content = await fs.readFile(component.path, 'utf-8');
      
      // Parse the file to an AST
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript', 'classProperties']
      });
      
      // Generate test ID recommendations
      const recommendations = generator.generateRecommendations(component, ast);
      
      if (recommendations.length > 0) {
        console.log(`Generated ${recommendations.length} TestID recommendations:`);
        recommendations.forEach((rec, index) => {
          console.log(`  ${index + 1}. ${rec.elementPath}: ${rec.recommendedTestId} (${rec.reason})`);
        });
        
        allRecommendations[component.name] = {
          path: component.path,
          existingTestIds: component.testIds,
          recommendations
        };
      } else {
        console.log('No TestID recommendations needed for this component.');
      }
      
      // Detect interactive elements
      const interactiveElements = generator.detectInteractiveElements(ast);
      console.log(`Found ${interactiveElements.length} interactive elements that could benefit from TestIDs.`);
    }
    
    // Save recommendations to file
    const outputPath = path.join(__dirname, '../reports/testid-recommendations.json');
    await fs.writeFile(
      outputPath, 
      JSON.stringify(allRecommendations, null, 2), 
      'utf-8'
    );
    
    console.log(`\nTestID recommendations saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error generating TestIDs:', error);
  }
}

// Execute the script
generateTestIds().catch(console.error); 