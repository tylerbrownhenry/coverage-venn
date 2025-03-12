import { ComponentHierarchyScanner } from '../ComponentHierarchyScanner';
import { TestIdValidator } from '../../validators/TestIdValidator';
import { getConfig } from '../../utils/config';
import * as fs from 'fs/promises';
import * as path from 'path';

jest.mock('fs/promises');
jest.mock('../../validators/TestIdValidator');
jest.mock('../../utils/config');

type MockDirectoryStructure = {
  [key: string]: Array<{ name: string; isDirectory: () => boolean }>;
};

type MockFileContent = {
  [key: string]: string;
};

describe('ComponentHierarchyScanner', () => {
  let scanner: ComponentHierarchyScanner;
  
  const mockDirectoryStructure: MockDirectoryStructure = {
    '/src': [
      { name: 'App.tsx', isDirectory: () => false },
      { name: 'components', isDirectory: () => true }
    ],
    '/src/components': [
      { name: 'Button.tsx', isDirectory: () => false }
    ]
  };

  const mockAppContent: MockFileContent = {
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
    (getConfig as jest.Mock).mockReturnValue({
      includes: ['*.tsx', '*.ts'],
      excludes: ['*.test.tsx', '*.spec.tsx'],
      maxDepth: 0
    });

    scanner = new ComponentHierarchyScanner();
    jest.resetAllMocks();

    (TestIdValidator.prototype.validate as jest.Mock).mockReturnValue({
      isValid: true,
      errors: [],
      warnings: []
    });

    (fs.readdir as jest.Mock).mockImplementation((dir: string) => {
      const entries = mockDirectoryStructure[dir] || [];
      return Promise.resolve(entries);
    });

    (fs.readFile as jest.Mock).mockImplementation((filePath: string) => {
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
    
    expect(TestIdValidator.prototype.validate).toHaveBeenCalledWith(
      'root_app',
      expect.objectContaining({ name: 'App' })
    );
    
    expect(TestIdValidator.prototype.validate).toHaveBeenCalledWith(
      'root_button',
      expect.objectContaining({ name: 'Button' })
    );
  });

  it('should build correct relationships from mock app', async () => {
    const hierarchy = await scanner.scanDirectory('/src');
    
    const relationships = Array.from(hierarchy.entries()).reduce((acc, [name, component]) => {
      acc[name] = {
        parents: component.parents,
        children: component.children
      };
      return acc;
    }, {} as Record<string, { parents: string[], children: string[] }>);

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