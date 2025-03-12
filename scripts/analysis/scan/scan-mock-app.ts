import { ComponentHierarchyScanner } from '../../../src/component-management/scanners/ComponentHierarchyScanner';
import path from 'path';

// Set mock config environment variable
process.env.SCANNER_CONFIG_PATH = path.resolve(__dirname, '../config/scanner.mock.config.js');

async function scanMockApp() {
  const scanner = new ComponentHierarchyScanner();
  
  try {
    const mockAppPath = path.join(__dirname, '../../../__mocks__/src');
    console.log('Scanning mock app at:', mockAppPath);
    console.log('Using config:', process.env.SCANNER_CONFIG_PATH);
    
    const hierarchy = await scanner.scanDirectory(mockAppPath);
    
    console.log('\nComponent Hierarchy:');
    console.log('-------------------');
    for (const [name, component] of hierarchy.entries()) {
      console.log(`\nComponent: ${name}`);
      console.log('Path:', component.path);
      console.log('Children:', component.children);
      console.log('Parents:', component.parents);
      console.log('Test IDs:', component.testIds);
      console.log('Imports:', component.imports);
    }
  } catch (error) {
    console.error('Error scanning mock app:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
  }
}

// Run the scanner
scanMockApp().catch(console.error);
