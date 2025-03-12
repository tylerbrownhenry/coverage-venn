/**
 * Scan Real Project for Components
 * 
 * This script scans a real project for React/React Native components
 * and generates a component hierarchy structure.
 * 
 * Environment variables:
 * - PROJECT_ROOT: Root directory of the project to scan
 * - SOURCE_DIR: Source directory within the project (default: src)
 */

import * as fs from 'fs';
import * as path from 'path';
import { ComponentHierarchyScanner } from '../../../src/scanners/ComponentHierarchyScanner';

// Get environment variables
const PROJECT_ROOT = process.env.PROJECT_ROOT || '.';
const SOURCE_DIR = process.env.SOURCE_DIR || 'src';

// Standalone function to scan project directories and find component files
async function scanProjectDirectories() {
  try {
    const projectRoot = path.resolve(process.cwd(), PROJECT_ROOT);
    const sourceDir = path.join(projectRoot, SOURCE_DIR);
    
    console.log(`Scanning project at: ${projectRoot}`);
    console.log(`Using source directory: ${sourceDir}`);
    
    // Load configuration
    const configPath = path.resolve(process.cwd(), 'config/scanner.config.js');
    
    // Use built-in scanner
    const scanner = new ComponentHierarchyScanner();
    
    // Customize patterns for project
    const filesToInclude = [
      path.join(sourceDir, '**/*.tsx'),
      path.join(sourceDir, '**/*.jsx'),
      path.join(sourceDir, '**/*.ts'),
      path.join(sourceDir, '**/*.js'),
      path.join(sourceDir, 'components/**/*.tsx'),
      path.join(sourceDir, 'components/**/*.jsx'),
      path.join(sourceDir, 'components/**/*.ts'),
      path.join(sourceDir, 'components/**/*.js'),
      path.join(sourceDir, 'views/**/*.tsx'),
      path.join(sourceDir, 'views/**/*.jsx'),
      path.join(sourceDir, 'contexts/**/*.tsx'),
      path.join(sourceDir, 'contexts/**/*.ts'),
      path.join(sourceDir, 'features/**/*.tsx'),
      path.join(sourceDir, 'features/**/*.jsx'),
      path.join(sourceDir, 'utils/**/*.ts'),
      path.join(sourceDir, 'utils/**/*.js')
    ];
    
    console.log('Looking for component files with patterns:', filesToInclude);
    
    // Manually find component files
    const componentFiles: string[] = [];
    
    // Helper to scan directories recursively
    const scanDir = (dirPath: string) => {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        // Skip node_modules, dist, etc.
        if (entry.name === 'node_modules' || entry.name === 'dist' || 
            entry.name === 'build' || entry.name === 'coverage') {
          continue;
        }
        
        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          scanDir(fullPath);
        } else if (entry.isFile()) {
          // Check if file is likely a component or utility file
          if (
            // Check the file extensions
            (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx') || 
             fullPath.endsWith('.ts') || fullPath.endsWith('.js')) &&
            // Skip test files and type declaration files
            !fullPath.includes('.test.') && 
            !fullPath.includes('.spec.') &&
            !fullPath.includes('.d.ts') &&
            !fullPath.includes('__tests__')
          ) {
            // Check if it's in one of the common component directories
            if (
              fullPath.includes('/components/') || 
              fullPath.includes('/views/') ||
              fullPath.includes('/features/') ||
              fullPath.includes('/contexts/') ||
              fullPath.includes('/hooks/') ||
              fullPath.includes('/utils/')
            ) {
              componentFiles.push(fullPath);
              console.log(`Adding component file: ${fullPath}`);
            }
            // Or check if it follows React component naming (PascalCase)
            else if (/\/[A-Z][a-zA-Z]*\.(tsx|jsx|ts|js)$/.test(fullPath)) {
              componentFiles.push(fullPath);
              console.log(`Adding component file: ${fullPath}`);
            }
            // Include other potential source files that are not in node_modules
            else if (fullPath.includes('/src/')) {
              componentFiles.push(fullPath);
              console.log(`Adding source file: ${fullPath}`);
            }
          }
        }
      }
    };
    
    // Start scanning from source directory
    scanDir(sourceDir);
    
    console.log(`Found ${componentFiles.length} component files`);
    
    // Create output directory if it doesn't exist
    const reportDir = path.resolve(process.cwd(), 'reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    // Write results to file
    const reportPath = path.join(reportDir, 'project-component-hierarchy.json');
    fs.writeFileSync(
      reportPath,
      JSON.stringify({ files: componentFiles }, null, 2)
    );
    
    console.log(`Report saved to: ${reportPath}`);
    
    return { files: componentFiles };
  } catch (error) {
    console.error('Error scanning project:', error);
    return { files: [] };
  }
}

// Main function
async function main() {
  try {
    const result = await scanProjectDirectories();
    console.log(`Scan complete. Found ${result.files.length} components.`);
  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
}

main(); 