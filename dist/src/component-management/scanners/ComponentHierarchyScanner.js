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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentHierarchyScanner = void 0;
const parser_1 = require("@babel/parser");
const traverse_1 = __importDefault(require("@babel/traverse"));
const t = __importStar(require("@babel/types"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const index_1 = require("../validators/index");
const config_1 = require("../../core/config");
const DEFAULT_CONFIG = {
    includes: ['**/*.tsx', '**/*.ts'],
    excludes: ['**/*.test.*', '**/*.spec.*'],
    maxDepth: 3
};
class ComponentHierarchyScanner {
    constructor() {
        this.componentMap = new Map();
        this.validator = new index_1.TestIdValidator();
        try {
            const loadedConfig = (0, config_1.getConfig)('scanner', {
                required: false,
                configPath: process.env.SCANNER_CONFIG_PATH
            });
            this.config = {
                ...DEFAULT_CONFIG,
                ...loadedConfig
            };
        }
        catch (error) {
            console.warn('Failed to load scanner config, using defaults:', error);
            this.config = DEFAULT_CONFIG;
        }
        console.log('Scanner config:', this.config);
    }
    async scanDirectory(rootDir) {
        const files = await this.findComponentFiles(rootDir);
        console.log('files:', files);
        for (const file of files) {
            await this.analyzeComponent(file);
        }
        await this.buildRelationships();
        return this.componentMap;
    }
    async findComponentFiles(dir, depth = 0) {
        console.log('Scanning directory:', dir);
        if (this.config.maxDepth > 0 && depth >= this.config.maxDepth) {
            return [];
        }
        const files = [];
        const entries = await fs.readdir(dir, { withFileTypes: true });
        console.log('Found entries:', entries.map(e => ({ name: e.name, isDir: e.isDirectory() })));
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                console.log('Entering directory:', fullPath);
                files.push(...await this.findComponentFiles(fullPath, depth + 1));
            }
            else {
                console.log('Checking file:', fullPath);
                const isComponent = this.isComponentFile(entry.name);
                console.log('Is component file?', isComponent, entry.name);
                if (isComponent) {
                    console.log('Adding component file:', fullPath);
                    files.push(fullPath);
                }
            }
        }
        return files;
    }
    isComponentFile(filename) {
        const matchesInclude = this.config.includes.some(pattern => {
            const globPattern = pattern
                .replace(/\*\*/g, '.*')
                .replace(/\*/g, '[^/]*')
                .replace(/\./g, '\\.');
            const regex = new RegExp(globPattern);
            const matches = regex.test(filename);
            console.log('Testing include pattern:', pattern, 'against:', filename, 'Result:', matches);
            return matches;
        });
        const matchesExclude = this.config.excludes.some(pattern => {
            const globPattern = pattern
                .replace(/\*\*/g, '.*')
                .replace(/\*/g, '[^/]*')
                .replace(/\./g, '\\.');
            const regex = new RegExp(globPattern);
            const matches = regex.test(filename);
            console.log('Testing exclude pattern:', pattern, 'against:', filename, 'Result:', matches);
            return matches;
        });
        return matchesInclude && !matchesExclude;
    }
    async analyzeComponent(filePath) {
        const content = await fs.readFile(filePath, 'utf-8');
        const ast = (0, parser_1.parse)(content, {
            sourceType: 'module',
            plugins: ['typescript', 'jsx']
        });
        // Update to preserve case of component name
        const componentName = path.basename(filePath, path.extname(filePath))
            .replace(/^[a-z]/, c => c.toUpperCase()); // Capitalize first letter
        const componentNode = {
            name: componentName,
            path: filePath,
            children: [],
            parents: [],
            imports: [],
            testIds: []
        };
        (0, traverse_1.default)(ast, {
            ImportDeclaration: (path) => {
                componentNode.imports.push(path.node.source.value);
            },
            JSXIdentifier: (path) => {
                if (this.isCustomComponent(path.node.name)) {
                    componentNode.children.push(path.node.name);
                }
            },
            JSXAttribute: (path) => {
                if (path.node.name.name === 'data-testid' && t.isStringLiteral(path.node.value)) {
                    const testId = path.node.value.value;
                    const validationResult = this.validator.validate(testId, componentNode);
                    if (!validationResult.isValid) {
                        validationResult.errors.forEach((error) => {
                            console.error(`Invalid test ID "${testId}": ${error.message}`);
                            console.error(`Suggestion: ${error.suggestion}`);
                        });
                    }
                    componentNode.testIds.push(testId);
                }
            }
        });
        this.componentMap.set(componentNode.name, componentNode);
    }
    async buildRelationships() {
        for (const [name, component] of this.componentMap.entries()) {
            for (const childName of component.children) {
                const childComponent = this.componentMap.get(childName);
                if (childComponent) {
                    childComponent.parents.push(name);
                }
            }
        }
    }
    isCustomComponent(name) {
        return /^[A-Z]/.test(name);
    }
}
exports.ComponentHierarchyScanner = ComponentHierarchyScanner;
