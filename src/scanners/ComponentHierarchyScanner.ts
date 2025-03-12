import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import * as fs from 'fs/promises';
import * as path from 'path';
import { TestIdValidator, ValidationError } from '../validators';
import { getConfig } from '../utils/config';

export interface ComponentNode {
  name: string;
  path: string;
  children: string[];
  parents: string[];
  imports: string[];
  testIds: string[];
}

interface ScannerConfig {
  includes: string[];
  excludes: string[];
  maxDepth: number;
}

const DEFAULT_CONFIG: ScannerConfig = {
  includes: ['**/*.tsx', '**/*.ts'],
  excludes: ['**/*.test.*', '**/*.spec.*'],
  maxDepth: 3
};

export class ComponentHierarchyScanner {
  private componentMap: Map<string, ComponentNode>;
  private validator: TestIdValidator;
  private config: ScannerConfig;

  constructor() {
    this.componentMap = new Map();
    this.validator = new TestIdValidator();
    
    try {
      const loadedConfig = getConfig('scanner', {
        required: false,
        configPath: process.env.SCANNER_CONFIG_PATH
      });
      
      this.config = {
        ...DEFAULT_CONFIG,
        ...loadedConfig
      };
    } catch (error) {
      console.warn('Failed to load scanner config, using defaults:', error);
      this.config = DEFAULT_CONFIG;
    }
    
    console.log('Scanner config:', this.config);
  }

  async scanDirectory(rootDir: string): Promise<Map<string, ComponentNode>> {
    const files = await this.findComponentFiles(rootDir);
    console.log('files:', files);
    for (const file of files) {
      await this.analyzeComponent(file);
    }

    await this.buildRelationships();
    return this.componentMap;
  }

  private async findComponentFiles(dir: string, depth = 0): Promise<string[]> {
    console.log('Scanning directory:', dir);
    if (this.config.maxDepth > 0 && depth >= this.config.maxDepth) {
      return [];
    }

    const files: string[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    console.log('Found entries:', entries.map(e => ({ name: e.name, isDir: e.isDirectory() })));

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        console.log('Entering directory:', fullPath);
        files.push(...await this.findComponentFiles(fullPath, depth + 1));
      } else {
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

  private isComponentFile(filename: string): boolean {
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

  private async analyzeComponent(filePath: string): Promise<void> {
    const content = await fs.readFile(filePath, 'utf-8');
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });

    // Update to preserve case of component name
    const componentName = path.basename(filePath, path.extname(filePath))
      .replace(/^[a-z]/, c => c.toUpperCase()); // Capitalize first letter

    const componentNode: ComponentNode = {
      name: componentName,
      path: filePath,
      children: [],
      parents: [],
      imports: [],
      testIds: []
    };

    traverse(ast, {
      ImportDeclaration: (path: NodePath<t.ImportDeclaration>) => {
        componentNode.imports.push(path.node.source.value);
      },
      JSXIdentifier: (path: NodePath<t.JSXIdentifier>) => {
        if (this.isCustomComponent(path.node.name)) {
          componentNode.children.push(path.node.name);
        }
      },
      JSXAttribute: (path: NodePath<t.JSXAttribute>) => {
        if (path.node.name.name === 'data-testid' && t.isStringLiteral(path.node.value)) {
          const testId = path.node.value.value;
          const validationResult = this.validator.validate(testId, componentNode);
          if (!validationResult.isValid) {
            validationResult.errors.forEach((error: ValidationError) => {
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

  private async buildRelationships(): Promise<void> {
    for (const [name, component] of this.componentMap.entries()) {
      for (const childName of component.children) {
        const childComponent = this.componentMap.get(childName);
        if (childComponent) {
          childComponent.parents.push(name);
        }
      }
    }
  }

  private isCustomComponent(name: string): boolean {
    return /^[A-Z]/.test(name);
  }
}
