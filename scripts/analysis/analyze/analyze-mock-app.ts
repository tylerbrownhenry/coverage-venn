import { ComponentHierarchyManager } from '../../../src/component-management/managers/component-manager';
import { ComponentNode } from '../../../src/component-management/scanners/ComponentHierarchyScanner';
import * as fs from 'fs/promises';
import * as path from 'path';

// Update paths to config files
process.env.SCANNER_CONFIG_PATH = path.resolve(__dirname, '../../../config/scanner.config.js');
process.env.MANAGER_CONFIG_PATH = path.resolve(__dirname, '../../../config/manager.config.js');

// Override the rootDir to use the mock directory
const MOCK_DIR = path.resolve(__dirname, '../../../__mocks__/src');

interface ComponentData {
  name: string;
  path: string;
  children: string[];
  testIds: string[];
}

interface AnalysisReport {
  timestamp: string;
  components: Array<{
    name: string;
    path: string;
    children: string[];
    testIds: string[];
  }>;
}

async function analyzeMockApp() {
  const manager = new ComponentHierarchyManager();
  
  try {
    console.log('Analyzing mock app...');
    console.log('Using mock directory:', MOCK_DIR);
    
    // Override the rootDir in the scanner
    // @ts-ignore - Accessing private property for testing
    manager.config.rootDir = MOCK_DIR;
    
    // Override scanner configuration for mock components
    // @ts-ignore - Accessing private property for testing
    if (manager.scanner && manager.scanner.config) {
      console.log('Overriding scanner configuration for mock components');
      
      // @ts-ignore - Accessing private property for testing
      manager.scanner.config.includes = ['**/*.tsx', '**/*.jsx'];
      
      // @ts-ignore - Accessing private property for testing
      manager.scanner.config.componentPatterns = {
        namePatterns: [/[A-Z][a-zA-Z]*\.(tsx|jsx)$/],
        requiredImports: [] // Don't require specific imports for mock components
      };
      
      // @ts-ignore - Accessing private property for testing
      manager.scanner.config.roots = ['.'];
      
      // Override the isComponentFile method to handle mock components
      // @ts-ignore - Accessing private property for testing
      manager.scanner.isComponentFile = function(filename: string): boolean {
        console.log('Custom isComponentFile called for:', filename);
        
        // Check if the file is a component based on naming convention
        const isComponent = /[A-Z][a-zA-Z]*\.(tsx|jsx)$/.test(filename);
        
        // Exclude test files
        const isTestFile = /\.(test|spec)\.(tsx|jsx|ts|js)$/.test(filename);
        
        console.log('Is component by name convention?', isComponent);
        console.log('Is test file?', isTestFile);
        
        return isComponent && !isTestFile;
      };
    }
    
    const hierarchy = await manager.scanHierarchy();
    
    await manager.trackChanges();
    await manager.validateTags();
    
    // Save results to files
    const outputDir = path.join(__dirname, '../../../reports');
    await fs.mkdir(outputDir, { recursive: true });

    const report: AnalysisReport = {
      timestamp: new Date().toISOString(),
      components: Array.from(hierarchy.entries()).map(([name, component]) => ({
        name,
        path: component.path,
        children: component.children,
        testIds: component.testIds
      }))
    };

    await fs.writeFile(
      path.join(outputDir, 'mock-analysis.json'),
      JSON.stringify(report, null, 2)
    );

    // Display results in console
    console.log('\nAnalysis Results:');
    console.log('=================');
    
    if (report.components.length === 0) {
      console.log('\nNo components found. Check scanner configuration and mock files.');
    } else {
      report.components.forEach(comp => {
        console.log(`\n📦 ${comp.name}`);
        console.log(`   Path: ${comp.path}`);
        console.log(`   Children: ${comp.children.join(', ') || 'none'}`);
        console.log(`   Test IDs: ${comp.testIds.join(', ') || 'none'}`);
      });
    }

    console.log('\nReport saved to:', path.join(outputDir, 'mock-analysis.json'));
    console.log('Analysis complete');
  } catch (error) {
    console.error('Error analyzing mock app:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
  }
}

analyzeMockApp().catch(console.error);
