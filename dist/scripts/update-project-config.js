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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const project_config_1 = require("../config/project-config");
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
if (!project_config_1.projectConfigs[project]) {
    project_config_1.projectConfigs[project] = {
        excludeTestPatterns: [],
        customMappings: {},
        confidenceThreshold: 0.6
    };
}
let configChanged = false;
switch (operation) {
    case 'exclude':
        const pattern = rest[0];
        if (pattern && !project_config_1.projectConfigs[project].excludeTestPatterns.includes(pattern)) {
            project_config_1.projectConfigs[project].excludeTestPatterns.push(pattern);
            console.log(`Added ${pattern} to excluded patterns for ${project}`);
            configChanged = true;
        }
        break;
    case 'unexclude':
        const removePattern = rest[0];
        if (removePattern) {
            const index = project_config_1.projectConfigs[project].excludeTestPatterns.indexOf(removePattern);
            if (index >= 0) {
                project_config_1.projectConfigs[project].excludeTestPatterns.splice(index, 1);
                console.log(`Removed ${removePattern} from excluded patterns for ${project}`);
                configChanged = true;
            }
        }
        break;
    case 'map':
        const [sourceFile, testFile] = rest;
        if (sourceFile) {
            if (!project_config_1.projectConfigs[project].customMappings[sourceFile]) {
                project_config_1.projectConfigs[project].customMappings[sourceFile] = [];
            }
            if (testFile && !project_config_1.projectConfigs[project].customMappings[sourceFile].includes(testFile)) {
                project_config_1.projectConfigs[project].customMappings[sourceFile].push(testFile);
                console.log(`Added mapping from ${sourceFile} to ${testFile}`);
                configChanged = true;
            }
            else if (!testFile) {
                // Empty array = explicitly no tests
                project_config_1.projectConfigs[project].customMappings[sourceFile] = [];
                console.log(`Set ${sourceFile} to have no test mappings`);
                configChanged = true;
            }
        }
        break;
    case 'unmap':
        const srcFile = rest[0];
        if (srcFile && project_config_1.projectConfigs[project].customMappings[srcFile] !== undefined) {
            delete project_config_1.projectConfigs[project].customMappings[srcFile];
            console.log(`Removed all mappings for ${srcFile}`);
            configChanged = true;
        }
        break;
    case 'threshold':
        const threshold = parseFloat(rest[0]);
        if (!isNaN(threshold) && threshold >= 0 && threshold <= 1) {
            project_config_1.projectConfigs[project].confidenceThreshold = threshold;
            console.log(`Set confidence threshold for ${project} to ${threshold}`);
            configChanged = true;
        }
        break;
    case 'list':
        console.log(`Configuration for ${project}:`);
        console.log(JSON.stringify(project_config_1.projectConfigs[project], null, 2));
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

export const projectConfigs: Record<string, ProjectConfig> = ${JSON.stringify(project_config_1.projectConfigs, null, 2)};

export function getProjectConfig(projectName: string): ProjectConfig {
  return projectConfigs[projectName] || projectConfigs.default;
}
`;
    fs.writeFileSync(configPath, configContent);
    console.log(`Updated configuration saved to ${configPath}`);
}
