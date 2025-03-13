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
const component_manager_1 = require("../../../src/component-management/managers/component-manager");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
// Update paths to config files
process.env.SCANNER_CONFIG_PATH = path.resolve(__dirname, '../../../config/scanner.config.js');
process.env.MANAGER_CONFIG_PATH = path.resolve(__dirname, '../../../config/manager.config.js');
// Override the rootDir to use the mock directory
const MOCK_DIR = path.resolve(__dirname, '../../../__mocks__/src');
async function analyzeMockApp() {
    const manager = new component_manager_1.ComponentHierarchyManager();
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
            manager.scanner.isComponentFile = function (filename) {
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
        const report = {
            timestamp: new Date().toISOString(),
            components: Array.from(hierarchy.entries()).map(([name, component]) => ({
                name,
                path: component.path,
                children: component.children,
                testIds: component.testIds
            }))
        };
        await fs.writeFile(path.join(outputDir, 'mock-analysis.json'), JSON.stringify(report, null, 2));
        // Display results in console
        console.log('\nAnalysis Results:');
        console.log('=================');
        if (report.components.length === 0) {
            console.log('\nNo components found. Check scanner configuration and mock files.');
        }
        else {
            report.components.forEach(comp => {
                console.log(`\n📦 ${comp.name}`);
                console.log(`   Path: ${comp.path}`);
                console.log(`   Children: ${comp.children.join(', ') || 'none'}`);
                console.log(`   Test IDs: ${comp.testIds.join(', ') || 'none'}`);
            });
        }
        console.log('\nReport saved to:', path.join(outputDir, 'mock-analysis.json'));
        console.log('Analysis complete');
    }
    catch (error) {
        console.error('Error analyzing mock app:', error);
        console.error('Error details:', error instanceof Error ? error.message : String(error));
    }
}
analyzeMockApp().catch(console.error);
