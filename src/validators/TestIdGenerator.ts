import * as t from '@babel/types';
import traverse, { NodePath } from '@babel/traverse';
import { ComponentNode } from '../scanners/ComponentHierarchyScanner';
import { TestIdValidator } from './TestIdValidator';

export interface ElementType {
  type: string;
  variant?: string;
  role?: string;
}

export interface TestIdRecommendation {
  elementId: string;
  elementType: ElementType;
  elementPath: string;
  recommendedTestId: string;
  confidence: number;
  reason: string;
}

export class TestIdGenerator {
  private validator: TestIdValidator;

  constructor() {
    this.validator = new TestIdValidator();
  }

  /**
   * Generate recommended testIDs for a component
   * @param component The component to analyze
   * @param ast The AST of the component
   */
  generateRecommendations(component: ComponentNode, ast: t.File): TestIdRecommendation[] {
    const recommendations: TestIdRecommendation[] = [];
    
    // Find all JSX elements in the component
    this.traverseJsxElements(ast, (path, elementInfo) => {
      // Skip elements that already have testIDs
      if (this.hasTestId(path)) {
        return;
      }
      
      // Generate a recommended testID for the element
      const testId = this.generateTestIdForElement(component, elementInfo);
      
      recommendations.push({
        elementId: elementInfo.type + (elementInfo.variant ? `-${elementInfo.variant}` : ''),
        elementType: elementInfo,
        elementPath: this.getElementPath(path),
        recommendedTestId: testId,
        confidence: this.calculateConfidence(elementInfo),
        reason: this.generateReason(elementInfo)
      });
    });
    
    return recommendations;
  }

  /**
   * Check if an element already has a testID
   */
  private hasTestId(path: NodePath<t.JSXElement>): boolean {
    const attributes = path.node.openingElement.attributes;
    return attributes.some(attr => 
      t.isJSXAttribute(attr) && 
      (
        (t.isJSXIdentifier(attr.name) && 
         (attr.name.name === 'data-testid' || attr.name.name === 'testID'))
      )
    );
  }

  /**
   * Traverse all JSX elements in an AST
   */
  private traverseJsxElements(
    ast: t.File, 
    callback: (path: NodePath<t.JSXElement>, elementInfo: ElementType) => void
  ): void {
    const self = this;
    traverse(ast, {
      JSXElement(path: NodePath<t.JSXElement>) {
        const elementName = self.getElementName(path);
        const elementInfo = self.analyzeElement(path);
        
        callback(path, elementInfo);
      }
    });
  }

  /**
   * Get the name of a JSX element
   */
  private getElementName(path: NodePath<t.JSXElement>): string {
    const openingElement = path.node.openingElement;
    if (t.isJSXIdentifier(openingElement.name)) {
      return openingElement.name.name;
    } else if (t.isJSXMemberExpression(openingElement.name)) {
      // For expressions like Styled.Button
      let result = '';
      let current: t.JSXMemberExpression | t.JSXIdentifier = openingElement.name;
      
      while (t.isJSXMemberExpression(current)) {
        if (t.isJSXIdentifier(current.property)) {
          result = current.property.name + (result ? '.' + result : '');
        }
        current = current.object;
      }
      
      if (t.isJSXIdentifier(current)) {
        result = current.name + (result ? '.' + result : '');
      }
      
      return result;
    }
    
    return 'unknown';
  }

  /**
   * Analyze a JSX element to determine its type and properties
   */
  private analyzeElement(path: NodePath<t.JSXElement>): ElementType {
    const elementName = this.getElementName(path);
    const attributes = path.node.openingElement.attributes;
    
    // Default element type
    const elementType: ElementType = {
      type: elementName.toLowerCase()
    };
    
    // Check for role attribute
    const roleAttr = attributes.find(attr => 
      t.isJSXAttribute(attr) && 
      t.isJSXIdentifier(attr.name) && 
      attr.name.name === 'role'
    );
    
    if (roleAttr && t.isJSXAttribute(roleAttr) && roleAttr.value) {
      if (t.isStringLiteral(roleAttr.value)) {
        elementType.role = roleAttr.value.value;
      }
    }
    
    // Check for variant or type attributes
    const variantAttr = attributes.find(attr => 
      t.isJSXAttribute(attr) && 
      t.isJSXIdentifier(attr.name) && 
      (attr.name.name === 'variant' || attr.name.name === 'type')
    );
    
    if (variantAttr && t.isJSXAttribute(variantAttr) && variantAttr.value) {
      if (t.isStringLiteral(variantAttr.value)) {
        elementType.variant = variantAttr.value.value;
      }
    }
    
    return elementType;
  }

  /**
   * Generate a testID for an element based on component and element type
   */
  private generateTestIdForElement(component: ComponentNode, elementInfo: ElementType): string {
    const componentName = component.name.toLowerCase();
    const elementType = elementInfo.type.toLowerCase();
    const variant = elementInfo.variant ? elementInfo.variant.toLowerCase() : '';
    const role = elementInfo.role ? elementInfo.role.toLowerCase() : '';
    
    // Determine prefix based on component path
    const isShared = component.path.includes('shared');
    const prefix = isShared ? 'shared' : 'root';
    
    // Generate testID based on naming convention
    let testId = `${prefix}_${componentName}`;
    
    // Add element type if it's not the root element
    if (elementType !== 'div' && elementType !== 'component') {
      testId += `_${elementType}`;
    }
    
    // Add variant if available
    if (variant) {
      testId += `_${variant}`;
    }
    
    // Add role if available
    if (role) {
      testId += `_${role}`;
    }
    
    return testId;
  }

  /**
   * Calculate confidence score for a recommendation
   */
  private calculateConfidence(elementInfo: ElementType): number {
    // Base confidence
    let confidence = 0.7;
    
    // Adjust based on element type
    if (this.isInteractiveElement(elementInfo)) {
      confidence += 0.2; // Higher confidence for interactive elements
    }
    
    // Adjust based on role
    if (elementInfo.role) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Check if an element is interactive
   */
  private isInteractiveElement(elementInfo: ElementType): boolean {
    const interactiveTypes = ['button', 'input', 'a', 'select', 'textarea', 'option'];
    const interactiveRoles = ['button', 'link', 'checkbox', 'radio', 'tab', 'menuitem'];
    
    const typeMatch = interactiveTypes.includes(elementInfo.type.toLowerCase());
    const roleMatch = elementInfo.role ? interactiveRoles.includes(elementInfo.role.toLowerCase()) : false;
    
    return typeMatch || roleMatch;
  }

  /**
   * Generate a reason for the recommendation
   */
  private generateReason(elementInfo: ElementType): string {
    if (this.isInteractiveElement(elementInfo)) {
      return `Interactive ${elementInfo.type} elements should have testIDs for testing user interactions`;
    }
    
    if (elementInfo.role) {
      return `Elements with role '${elementInfo.role}' should have testIDs for accessibility testing`;
    }
    
    return `Adding testID improves component testability`;
  }

  /**
   * Get a string representation of the element's path in the component
   */
  private getElementPath(path: NodePath<t.JSXElement>): string {
    const elements: string[] = [];
    let current: NodePath | null = path;
    
    while (current) {
      if (current.isJSXElement()) {
        const element = current.node as t.JSXElement;
        const openingElement = element.openingElement;
        
        if (t.isJSXIdentifier(openingElement.name)) {
          elements.unshift(openingElement.name.name);
        }
      }
      
      current = current.parentPath;
      
      // Stop if we reach the function/component declaration
      if (current && (current.isFunction() || current.isVariableDeclaration())) {
        break;
      }
    }
    
    return elements.join(' > ') || 'component';
  }

  /**
   * Detect interactive elements in a component
   */
  detectInteractiveElements(ast: t.File): ElementType[] {
    const interactiveElements: ElementType[] = [];
    const self = this;
    
    traverse(ast, {
      JSXElement: (path: NodePath<t.JSXElement>) => {
        const elementInfo = self.analyzeElement(path);
        
        if (self.isInteractiveElement(elementInfo) && !self.hasTestId(path)) {
          interactiveElements.push(elementInfo);
        }
      }
    });
    
    return interactiveElements;
  }
} 