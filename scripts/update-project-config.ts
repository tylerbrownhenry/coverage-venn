import * as fs from 'fs';
import * as path from 'path';
import { projectConfigs, ProjectConfig } from '../config/project-config';

// Get command line args
const args = process.argv.slice(2);
const [project, operation, ...rest] = args;

if (!project || !operation) {
  console.log('Usage: npm run update-config -- [project] [operation] [args]');
  console.log('Operations:');
  console.log('  exclude [pattern] - Add a pattern to exclude from test correlation');
  console.log('  unexclude [pattern] - Remove an exclude pattern');
  console.log('  map [sourceFile] [testFile] - Add a custom mapping');
  console.log('  unmap [sourceFile] - Remove custom mappings for a source file');
  console.log('  threshold [value] - Set confidence threshold (0.0-1.0)');
  console.log('  list - Show current configuration');
  process.exit(1);
}

// Create config file path
const configPath = path.join(__dirname, '..', 'config', 'project-config.ts');

// Make sure the project exists in config
if (!projectConfigs[project]) {
  projectConfigs[project] = { 
    excludeTestPatterns: [], 
    customMappings: {},
    confidenceThreshold: 0.6
  };
}

let configChanged = false;

switch (operation) {
  case 'exclude':
    const pattern = rest[0];
    if (pattern && !projectConfigs[project].excludeTestPatterns.includes(pattern)) {
      projectConfigs[project].excludeTestPatterns.push(pattern);
      console.log(`Added ${pattern} to excluded patterns for ${project}`);
      configChanged = true;
    }
    break;
    
  case 'unexclude':
    const removePattern = rest[0];
    if (removePattern) {
      const index = projectConfigs[project].excludeTestPatterns.indexOf(removePattern);
      if (index >= 0) {
        projectConfigs[project].excludeTestPatterns.splice(index, 1);
        console.log(`Removed ${removePattern} from excluded patterns for ${project}`);
        configChanged = true;
      }
    }
    break;
    
  case 'map':
    const [sourceFile, testFile] = rest;
    if (sourceFile) {
      if (!projectConfigs[project].customMappings[sourceFile]) {
        projectConfigs[project].customMappings[sourceFile] = [];
      }
      if (testFile && !projectConfigs[project].customMappings[sourceFile].includes(testFile)) {
        projectConfigs[project].customMappings[sourceFile].push(testFile);
        console.log(`Added mapping from ${sourceFile} to ${testFile}`);
        configChanged = true;
      } else if (!testFile) {
        // Empty array = explicitly no tests
        projectConfigs[project].customMappings[sourceFile] = [];
        console.log(`Set ${sourceFile} to have no test mappings`);
        configChanged = true;
      }
    }
    break;
    
  case 'unmap':
    const srcFile = rest[0];
    if (srcFile && projectConfigs[project].customMappings[srcFile] !== undefined) {
      delete projectConfigs[project].customMappings[srcFile];
      console.log(`Removed all mappings for ${srcFile}`);
      configChanged = true;
    }
    break;
    
  case 'threshold':
    const threshold = parseFloat(rest[0]);
    if (!isNaN(threshold) && threshold >= 0 && threshold <= 1) {
      projectConfigs[project].confidenceThreshold = threshold;
      console.log(`Set confidence threshold for ${project} to ${threshold}`);
      configChanged = true;
    }
    break;
    
  case 'list':
    console.log(`Configuration for ${project}:`);
    console.log(JSON.stringify(projectConfigs[project], null, 2));
    break;
    
  default:
    console.log(`Unknown operation: ${operation}`);
}

// Write updated config if changed
if (configChanged) {
  const configContent = `// Auto-generated project configuration
export interface ProjectConfig {
  excludeTestPatterns: string[];
  customMappings: Record<string, string[]>;
  confidenceThreshold: number;
}

export const projectConfigs: Record<string, ProjectConfig> = ${JSON.stringify(projectConfigs, null, 2)};

export function getProjectConfig(projectName: string): ProjectConfig {
  return projectConfigs[projectName] || projectConfigs.default;
}
`;

  fs.writeFileSync(configPath, configContent);
  console.log(`Updated configuration saved to ${configPath}`);
} 