/**
 * Babel plugin for advanced code coverage instrumentation
 * 
 * This plugin adds instrumentation to track:
 * - Conditional branches (if/else, ternary)
 * - JSX conditional rendering
 * - Function execution and completion
 * - React component rendering
 */

// Add a declaration for the module directly at the top of the file
declare module '@babel/helper-plugin-utils' {
  export function declare<T>(callback: (api: any) => T): T;
}

import { declare } from '@babel/helper-plugin-utils';
import { types as t, template, NodePath } from '@babel/core';
import { Node, Statement, Expression, Identifier, TSType } from '@babel/types';

// Add missing types
type BabelState = {
  filename: string;
  opts: Record<string, any>;
  file: {
    path: NodePath;
    opts: Record<string, any>;
  };
};

// Counter to generate unique IDs for branches
let branchIDCounter = 0;

// Create template for tracking branch execution
const trackBranchTemplate = template(`
  COVERAGE_TRACKER.trackBranch(COMPONENT_NAME, BRANCH_ID, BRANCH_TYPE, CONDITION ? 0 : 1);
`);

// Create template for tracking function execution
const trackFunctionTemplate = template(`
  try {
    COVERAGE_TRACKER.trackFunctionStart(COMPONENT_NAME, FUNCTION_NAME, FUNCTION_ID);
    const RESULT = FUNCTION_BODY;
    COVERAGE_TRACKER.trackFunctionEnd(COMPONENT_NAME, FUNCTION_NAME, FUNCTION_ID);
    return RESULT;
  } catch (error) {
    COVERAGE_TRACKER.trackFunctionError(COMPONENT_NAME, FUNCTION_NAME, FUNCTION_ID);
    throw error;
  }
`);

// Create template for tracking JSX rendering
const trackJSXTemplate = template(`
  (COVERAGE_TRACKER.trackJSXRender(COMPONENT_NAME, JSX_ID, ELEMENT_TYPE), JSX_EXPRESSION)
`);

/**
 * Get component name from file path and scope
 */
function getComponentName(filename: string, path: NodePath<Node>): string {
  // Try to get from function name or variable declaration
  const scope = path.scope;
  
  // Check if scope.block is a function declaration with an id
  if (t.isFunctionDeclaration(scope.block) && scope.block.id?.name) {
    return scope.block.id.name;
  }
  
  // Try to get from containing variable declaration
  const variableDeclarator = path.findParent((p): p is NodePath<t.VariableDeclarator> => p.isVariableDeclarator());
  
  // Safely check and access id property with type guards
  if (variableDeclarator && variableDeclarator.node && 
      'id' in variableDeclarator.node && 
      variableDeclarator.node.id && 
      t.isIdentifier(variableDeclarator.node.id)) {
    return variableDeclarator.node.id.name;
  }
  
  // Fallback to filename-based guess
  const parts = filename.split('/');
  const fileNameWithExt = parts[parts.length - 1];
  const fileName = fileNameWithExt.split('.')[0];
  
  // Convert kebab-case or snake_case to PascalCase
  if (fileName.includes('-') || fileName.includes('_')) {
    return fileName
      .split(/[-_]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  }
  
  // Default to PascalCase filename
  return fileName.charAt(0).toUpperCase() + fileName.slice(1);
}

/**
 * The main Babel plugin
 */
export default declare((api: any) => {
  api.assertVersion(7);
  
  return {
    name: 'coverage-instrumentation-plugin',
    visitor: {
      // Handle if statements and track condition branches
      IfStatement(path: NodePath<t.IfStatement>, state: BabelState) {
        const branchId = branchIDCounter++;
        const componentName = getComponentName(state.filename, path);
        
        // Create tracking expression for condition
        const trackerNode = trackBranchTemplate({
          COVERAGE_TRACKER: t.identifier('COVERAGE_TRACKER'),
          COMPONENT_NAME: t.stringLiteral(componentName),
          BRANCH_ID: t.numericLiteral(branchId),
          BRANCH_TYPE: t.stringLiteral('if'),
          CONDITION: path.node.test
        }) as t.Statement;
        
        // Add tracking before the if statement
        path.insertBefore(trackerNode);
      },
      
      // Handle ternary operators
      ConditionalExpression(path: NodePath<t.ConditionalExpression>, state: BabelState) {
        const branchId = branchIDCounter++;
        const componentName = getComponentName(state.filename, path);
        
        // Get parent to determine context (JSX or regular code)
        const isInsideJSX = path.findParent((p) => p.isJSXElement() || p.isJSXFragment());
        const branchType = isInsideJSX ? 'jsx-conditional' : 'ternary';
        
        // Create tracking expression for condition
        const trackerNode = trackBranchTemplate({
          COVERAGE_TRACKER: t.identifier('COVERAGE_TRACKER'),
          COMPONENT_NAME: t.stringLiteral(componentName),
          BRANCH_ID: t.numericLiteral(branchId),
          BRANCH_TYPE: t.stringLiteral(branchType),
          CONDITION: path.node.test
        }) as t.Statement;
        
        // For JSX we need to wrap the entire expression
        if (isInsideJSX) {
          // Replace the expression with our instrumented version
          const trackerResult = trackerNode as any;
          const expr = trackerResult.expression || trackerNode;
          
          path.replaceWith(
            t.sequenceExpression([
              expr as t.Expression,
              path.node
            ])
          );
        } else {
          // For regular code, insert before
          path.insertBefore(trackerNode);
        }
      },
      
      // Handle logical expressions like condition && <Component />
      LogicalExpression(path: NodePath<t.LogicalExpression>, state: BabelState) {
        // Only instrument && and || operators used for conditional rendering
        if (path.node.operator !== '&&' && path.node.operator !== '||') {
          return;
        }
        
        // Only instrument if inside JSX
        const isInsideJSX = path.findParent((p) => p.isJSXElement() || p.isJSXFragment());
        if (!isInsideJSX) {
          return;
        }
        
        const branchId = branchIDCounter++;
        const componentName = getComponentName(state.filename, path);
        
        // Create tracking expression for condition
        const trackerNode = trackBranchTemplate({
          COVERAGE_TRACKER: t.identifier('COVERAGE_TRACKER'),
          COMPONENT_NAME: t.stringLiteral(componentName),
          BRANCH_ID: t.numericLiteral(branchId),
          BRANCH_TYPE: t.stringLiteral('jsx-logical'),
          CONDITION: path.node.left // Track the left side of && or ||
        }) as t.Statement;
        
        // Replace the expression with our instrumented version
        const trackerResult = trackerNode as any;
        const expr = trackerResult.expression || trackerNode;
        
        path.replaceWith(
          t.sequenceExpression([
            expr as t.Expression,
            path.node
          ])
        );
      },
      
      // Handle JSX elements
      JSXElement(path: NodePath<t.JSXElement>, state: BabelState) {
        const jsxId = branchIDCounter++;
        const componentName = getComponentName(state.filename, path);
        
        // Get element type (component name)
        let elementType = 'unknown';
        const openingElement = path.node.openingElement;
        if (t.isJSXIdentifier(openingElement.name)) {
          elementType = openingElement.name.name;
        }
        
        // Create tracking for JSX rendering
        const trackerNode = trackJSXTemplate({
          COVERAGE_TRACKER: t.identifier('COVERAGE_TRACKER'),
          COMPONENT_NAME: t.stringLiteral(componentName),
          JSX_ID: t.numericLiteral(jsxId),
          ELEMENT_TYPE: t.stringLiteral(elementType),
          JSX_EXPRESSION: path.node
        });
        
        // Replace with instrumented version
        const trackerResult = trackerNode as any;
        const expr = trackerResult.expression || trackerNode;
        path.replaceWith(expr as t.Expression);
      },
      
      // Track function declarations and component functions
      FunctionDeclaration(path: NodePath<t.FunctionDeclaration>, state: BabelState) {
        // Skip if it's a test function
        const functionName = path.node.id?.name || 'anonymous';
        if (functionName.includes('test') || functionName.includes('Test') || functionName.includes('mock')) {
          return;
        }
        
        const functionId = branchIDCounter++;
        const componentName = getComponentName(state.filename, path);
        
        // Instrument function body to track execution
        const bodyBlockStatement = path.node.body;
        const newBody = trackFunctionTemplate({
          COVERAGE_TRACKER: t.identifier('COVERAGE_TRACKER'),
          COMPONENT_NAME: t.stringLiteral(componentName),
          FUNCTION_NAME: t.stringLiteral(functionName),
          FUNCTION_ID: t.numericLiteral(functionId),
          FUNCTION_BODY: bodyBlockStatement,
          RESULT: t.identifier('__coverage_result')
        }) as t.BlockStatement;
        
        // Replace the function body with instrumented version
        path.get('body').replaceWith(newBody);
      },
      
      // Track arrow functions (often used for components)
      ArrowFunctionExpression(path: NodePath<t.ArrowFunctionExpression>, state: BabelState) {
        // Skip if inside test files
        if (state.filename.includes('test') || state.filename.includes('__tests__')) {
          return;
        }
        
        const functionId = branchIDCounter++;
        const componentName = getComponentName(state.filename, path);
        
        // Get function name from parent if possible
        let functionName = 'anonymous';
        const variableDeclarator = path.findParent((p): p is NodePath<t.VariableDeclarator> => p.isVariableDeclarator());
        
        // Safely check and access id property with type guards
        if (variableDeclarator && variableDeclarator.node && 
            'id' in variableDeclarator.node && 
            variableDeclarator.node.id &&
            t.isIdentifier(variableDeclarator.node.id)) {
          functionName = variableDeclarator.node.id.name;
        }
        
        // Need to handle both block body and expression body arrow functions
        let newBody: t.BlockStatement;
        if (t.isBlockStatement(path.node.body)) {
          // Arrow with block body: () => { return x; }
          newBody = trackFunctionTemplate({
            COVERAGE_TRACKER: t.identifier('COVERAGE_TRACKER'),
            COMPONENT_NAME: t.stringLiteral(componentName),
            FUNCTION_NAME: t.stringLiteral(functionName),
            FUNCTION_ID: t.numericLiteral(functionId),
            FUNCTION_BODY: path.node.body,
            RESULT: t.identifier('__coverage_result')
          }) as t.BlockStatement;
        } else {
          // Arrow with expression body: () => x
          // First convert to block body with return
          const blockBody = t.blockStatement([
            t.returnStatement(path.node.body)
          ]);
          
          newBody = trackFunctionTemplate({
            COVERAGE_TRACKER: t.identifier('COVERAGE_TRACKER'),
            COMPONENT_NAME: t.stringLiteral(componentName),
            FUNCTION_NAME: t.stringLiteral(functionName),
            FUNCTION_ID: t.numericLiteral(functionId),
            FUNCTION_BODY: blockBody,
            RESULT: t.identifier('__coverage_result')
          }) as t.BlockStatement;
        }
        
        // Replace the function body with instrumented version
        path.get('body').replaceWith(newBody);
      },
      
      // Handle TypeScript interfaces, types, and enums (skip instrumentation)
      TSInterfaceDeclaration() {
        // Skip instrumentation for TypeScript interfaces
      },
      
      TSTypeAliasDeclaration() {
        // Skip instrumentation for TypeScript types
      },
      
      TSEnumDeclaration() {
        // Skip instrumentation for TypeScript enums
      },
      
      // Handle TypeScript-specific function declarations
      TSDeclareFunction() {
        // Skip instrumentation for TypeScript ambient function declarations
      },
      
      // Skip type assertions but process their expressions
      TSAsExpression(path: NodePath<t.TSAsExpression>, state: BabelState) {
        // Process the underlying expression but ignore the type assertion
        const expressionPath = path.get('expression');
        if (expressionPath.isConditionalExpression()) {
          this.ConditionalExpression(expressionPath, state);
        } else if (expressionPath.isLogicalExpression()) {
          this.LogicalExpression(expressionPath, state);
        }
      },
      
      // Handle type checked expressions in conditionals
      TSTypeParameter() {
        // Skip instrumentation for TypeScript type parameters
      },
    }
  };
}); 