import { TestIdGenerator } from '../TestIdGenerator';
import { ComponentNode } from '../../scanners/ComponentHierarchyScanner';
import { parse } from '@babel/parser';
import * as t from '@babel/types';

describe('TestIdGenerator', () => {
  let generator: TestIdGenerator;
  let mockComponent: ComponentNode;

  beforeEach(() => {
    generator = new TestIdGenerator();
    
    // Create a mock component
    mockComponent = {
      name: 'Button',
      path: 'src/components/Button.tsx',
      children: [],
      parents: ['App'],
      imports: ['react'],
      testIds: []
    };
  });

  describe('generateRecommendations', () => {
    it('should generate recommendations for elements without testIDs', () => {
      // Create a mock AST for a component with elements that need testIDs
      const mockCode = `
        import React from 'react';
        
        export const Button = () => {
          return (
            <div>
              <button onClick={() => console.log('clicked')}>
                Click me
              </button>
              <input type="text" placeholder="Enter text" />
            </div>
          );
        };
      `;
      
      const ast = parse(mockCode, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });
      
      const recommendations = generator.generateRecommendations(mockComponent, ast);
      
      // Should have recommendations for the div, button, and input
      expect(recommendations.length).toBeGreaterThan(0);
      
      // Check if recommendations include the button and input
      const buttonRec = recommendations.find(r => r.elementType.type === 'button');
      const inputRec = recommendations.find(r => r.elementType.type === 'input');
      
      expect(buttonRec).toBeDefined();
      expect(inputRec).toBeDefined();
      
      if (buttonRec) {
        expect(buttonRec.recommendedTestId).toContain('button');
        expect(buttonRec.confidence).toBeGreaterThan(0.8); // High confidence for interactive elements
      }
      
      if (inputRec) {
        expect(inputRec.recommendedTestId).toContain('input');
        expect(inputRec.elementType.variant).toBe('text');
      }
    });

    it('should not generate recommendations for elements with existing testIDs', () => {
      // Create a mock AST for a component where elements already have testIDs
      const mockCode = `
        import React from 'react';
        
        export const Button = () => {
          return (
            <div data-testid="root_button">
              <button data-testid="root_button_action" onClick={() => console.log('clicked')}>
                Click me
              </button>
            </div>
          );
        };
      `;
      
      const ast = parse(mockCode, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });
      
      mockComponent.testIds = ['root_button', 'root_button_action'];
      
      const recommendations = generator.generateRecommendations(mockComponent, ast);
      
      // Should not have recommendations for elements that already have testIDs
      expect(recommendations.length).toBe(0);
    });
  });

  describe('detectInteractiveElements', () => {
    it('should identify interactive elements in a component', () => {
      const mockCode = `
        import React from 'react';
        
        export const Form = () => {
          return (
            <form>
              <button type="submit">Submit</button>
              <input type="text" />
              <select>
                <option value="1">Option 1</option>
              </select>
              <textarea placeholder="Enter message"></textarea>
              <div role="button" onClick={() => {}}>Click me</div>
            </form>
          );
        };
      `;
      
      const ast = parse(mockCode, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });
      
      const interactiveElements = generator.detectInteractiveElements(ast);
      
      // Should detect 6 interactive elements (button, input, select, option, textarea, div with role="button")
      expect(interactiveElements.length).toBe(6);
      
      // Check if all expected element types are found
      const types = interactiveElements.map(el => el.type);
      expect(types).toContain('button');
      expect(types).toContain('input');
      expect(types).toContain('select');
      expect(types).toContain('textarea');
      
      // Check if the div with role="button" is detected
      const buttonRole = interactiveElements.find(el => el.type === 'div' && el.role === 'button');
      expect(buttonRole).toBeDefined();
    });
  });
}); 