"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ComponentHierarchyScanner_1 = require("../../../src/component-management/scanners/ComponentHierarchyScanner");
const path_1 = __importDefault(require("path"));
// Set mock config environment variable
process.env.SCANNER_CONFIG_PATH = path_1.default.resolve(__dirname, '../config/scanner.mock.config.js');
async function scanMockApp() {
    const scanner = new ComponentHierarchyScanner_1.ComponentHierarchyScanner();
    try {
        const mockAppPath = path_1.default.join(__dirname, '../../../__mocks__/src');
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
    }
    catch (error) {
        console.error('Error scanning mock app:', error);
        console.error('Error details:', error instanceof Error ? error.message : String(error));
    }
}
// Run the scanner
scanMockApp().catch(console.error);
