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
const ComponentHierarchyScanner_1 = require("../ComponentHierarchyScanner");
const TestIdValidator_1 = require("../../validators/TestIdValidator");
const config_1 = require("../../utils/config");
const fs = __importStar(require("fs/promises"));
jest.mock('fs/promises');
jest.mock('../../validators/TestIdValidator');
jest.mock('../../utils/config');
describe('ComponentHierarchyScanner', () => {
    let scanner;
    const mockDirectoryStructure = {
        '/src': [
            { name: 'App.tsx', isDirectory: () => false },
            { name: 'components', isDirectory: () => true }
        ],
        '/src/components': [
            { name: 'Button.tsx', isDirectory: () => false }
        ]
    };
    const mockAppContent = {
        '/src/App.tsx': `
      import React from 'react';
      import { Button } from './components/Button';
      
      const App = () => (
        <div data-testid="root_app">
          <Button />
        </div>
      );
      
      export default App;
    `,
        '/src/components/Button.tsx': `
      import React from 'react';
      
      export const Button = () => (
        <button data-testid="root_button">
          Click me
        </button>
      );
    `
    };
    beforeEach(() => {
        config_1.getConfig.mockReturnValue({
            includes: ['*.tsx', '*.ts'],
            excludes: ['*.test.tsx', '*.spec.tsx'],
            maxDepth: 0
        });
        scanner = new ComponentHierarchyScanner_1.ComponentHierarchyScanner();
        jest.resetAllMocks();
        TestIdValidator_1.TestIdValidator.prototype.validate.mockReturnValue({
            isValid: true,
            errors: [],
            warnings: []
        });
        fs.readdir.mockImplementation((dir) => {
            const entries = mockDirectoryStructure[dir] || [];
            return Promise.resolve(entries);
        });
        fs.readFile.mockImplementation((filePath) => {
            return Promise.resolve(mockAppContent[filePath] || '');
        });
    });
    it('should analyze mock app structure correctly', async () => {
        const hierarchy = await scanner.scanDirectory('/src');
        // Verify App component
        const app = hierarchy.get('App');
        expect(app).toBeDefined();
        expect(app?.children).toContain('Button');
        expect(app?.testIds).toContain('root_app');
        expect(app?.imports).toContain('./components/Button');
        // Verify Button component
        const button = hierarchy.get('Button');
        expect(button).toBeDefined();
        expect(button?.children).toHaveLength(0);
        expect(button?.testIds).toContain('root_button');
        expect(button?.parents).toContain('App');
    });
    it('should validate test IDs in mock components', async () => {
        await scanner.scanDirectory('/src');
        expect(TestIdValidator_1.TestIdValidator.prototype.validate).toHaveBeenCalledWith('root_app', expect.objectContaining({ name: 'App' }));
        expect(TestIdValidator_1.TestIdValidator.prototype.validate).toHaveBeenCalledWith('root_button', expect.objectContaining({ name: 'Button' }));
    });
    it('should build correct relationships from mock app', async () => {
        const hierarchy = await scanner.scanDirectory('/src');
        const relationships = Array.from(hierarchy.entries()).reduce((acc, [name, component]) => {
            acc[name] = {
                parents: component.parents,
                children: component.children
            };
            return acc;
        }, {});
        expect(relationships).toEqual({
            'App': {
                parents: [],
                children: ['Button']
            },
            'Button': {
                parents: ['App'],
                children: []
            }
        });
    });
});
