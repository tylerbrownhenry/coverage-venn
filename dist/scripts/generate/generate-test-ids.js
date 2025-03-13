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
const path = __importStar(require("path"));
const parser_1 = require("@babel/parser");
const ComponentHierarchyScanner_1 = require("../src/scanners/ComponentHierarchyScanner");
const TestIdGenerator_1 = require("../src/validators/TestIdGenerator");
async function generateTestIds() {
    try {
        // Set the scanner config to use the mock config
        process.env.SCANNER_CONFIG_PATH = path.resolve(__dirname, '../config/scanner.mock.config.js');
        console.log('Starting TestID generation for mock app...');
        console.log('Using config:', process.env.SCANNER_CONFIG_PATH);
        // Initialize scanners
        const scanner = new ComponentHierarchyScanner_1.ComponentHierarchyScanner();
        const generator = new TestIdGenerator_1.TestIdGenerator();
        // Path to mock app
        const mockAppPath = path.join(__dirname, '../__mocks__/src');
        console.log('Scanning mock app at:', mockAppPath);
        // Scan for components
        const componentHierarchy = await scanner.scanDirectory(mockAppPath);
        console.log(`Found ${componentHierarchy.size} components. Analyzing for TestID recommendations...`);
        // Generate recommendations for each component
        const allRecommendations = {};
        for (const [name, component] of componentHierarchy.entries()) {
            console.log(`\nAnalyzing component: ${name}`);
            console.log('Path:', component.path);
            // Read the component file
            const content = await fs.readFile(component.path, 'utf-8');
            // Parse the file to an AST
            const ast = (0, parser_1.parse)(content, {
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
            }
            else {
                console.log('No TestID recommendations needed for this component.');
            }
            // Detect interactive elements
            const interactiveElements = generator.detectInteractiveElements(ast);
            console.log(`Found ${interactiveElements.length} interactive elements that could benefit from TestIDs.`);
        }
        // Save recommendations to file
        const outputPath = path.join(__dirname, '../reports/testid-recommendations.json');
        await fs.writeFile(outputPath, JSON.stringify(allRecommendations, null, 2), 'utf-8');
        console.log(`\nTestID recommendations saved to: ${outputPath}`);
    }
    catch (error) {
        console.error('Error generating TestIDs:', error);
    }
}
// Execute the script
generateTestIds().catch(console.error);
