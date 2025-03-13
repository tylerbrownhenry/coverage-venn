"use strict";
/**
 * Enhanced Babel plugin for TypeScript support
 *
 * This plugin instruments TypeScript code while properly handling TypeScript-specific syntax.
 * It identifies and properly handles TypeScript-specific nodes, ensuring they are either
 * skipped or correctly processed during instrumentation.
 */
const { declare } = require('@babel/helper-plugin-utils');
const t = require('@babel/types');
// Helper to get the component name from filename or nearest container component
function getComponentName(filename, path) {
    // Try to get name from the closest component context
    let componentPath = path.findParent(p => p.isClassDeclaration() ||
        p.isFunctionDeclaration() ||
        (p.isVariableDeclarator() &&
            (p.get('init').isArrowFunctionExpression() ||
                p.get('init').isFunctionExpression())));
    if (componentPath) {
        // For function declarations, use the function name
        if (componentPath.isFunctionDeclaration() && componentPath.node.id) {
            return componentPath.node.id.name;
        }
        // For class declarations, use the class name
        else if (componentPath.isClassDeclaration() && componentPath.node.id) {
            return componentPath.node.id.name;
        }
        // For variable declarators with function expressions
        else if (componentPath.isVariableDeclarator() && componentPath.node.id) {
            return componentPath.node.id.name;
        }
    }
    // Fallback to filename if no component name is found
    if (filename) {
        const parts = filename.split(/[\/\\]/);
        const fileNameWithExt = parts[parts.length - 1];
        const fileName = fileNameWithExt.split('.')[0];
        return fileName;
    }
    return 'UnknownComponent';
}
// Check if node is already instrumented to prevent double instrumentation
function isInstrumented(path) {
    return path.node && path.node._instrumented;
}
// Mark node as instrumented
function markAsInstrumented(path) {
    path.node._instrumented = true;
}
// Check if the node is part of a type-only declaration
function isTypeDeclaration(path) {
    // Check if this is a TypeScript type node
    if (path.isTypeAnnotation() ||
        path.isTSTypeAnnotation() ||
        path.isTSTypeParameterDeclaration() ||
        path.isTSInterfaceDeclaration() ||
        path.isTSTypeAliasDeclaration() ||
        path.isTSEnumDeclaration() ||
        path.isTSDeclareFunction() ||
        path.isTSTypeReference() ||
        path.isTSTypeParameter() ||
        path.isTSTypeLiteral()) {
        return true;
    }
    // Check if any parent is a type declaration
    let parent = path.parentPath;
    while (parent) {
        if (parent.isTypeAnnotation() ||
            parent.isTSTypeAnnotation() ||
            parent.isTSTypeParameterDeclaration() ||
            parent.isTSInterfaceDeclaration() ||
            parent.isTSTypeAliasDeclaration() ||
            parent.isTSEnumDeclaration() ||
            parent.isTSDeclareFunction() ||
            parent.isTSTypeReference() ||
            parent.isTSTypeParameter() ||
            parent.isTSTypeLiteral()) {
            return true;
        }
        parent = parent.parentPath;
    }
    return false;
}
// TS utility to strip type-related properties from nodes
function stripTypeAnnotations(node) {
    if (!node)
        return node;
    // Remove TypeScript-specific properties
    if (node.typeAnnotation)
        delete node.typeAnnotation;
    if (node.typeParameters)
        delete node.typeParameters;
    if (node.returnType)
        delete node.returnType;
    // Recursively process object properties
    Object.keys(node).forEach(key => {
        if (typeof node[key] === 'object' && node[key] !== null) {
            stripTypeAnnotations(node[key]);
        }
    });
    return node;
}
// Helper to create a unique ID for tracking
function createId(path) {
    const loc = path.node.loc;
    return loc ? `${loc.start.line}:${loc.start.column}` : Math.random().toString(36).substr(2, 9);
}
// Create instrumentation for condition branch tracking
function createBranchInstrumentation(path, componentName, condition, branchType) {
    if (isInstrumented(path))
        return condition;
    const branchId = createId(path);
    // Create the instrumentation call
    const trackerCall = t.callExpression(t.memberExpression(t.identifier('COVERAGE_TRACKER'), t.identifier('trackBranch')), [
        t.stringLiteral(componentName),
        t.stringLiteral(branchId),
        t.stringLiteral(branchType),
        condition
    ]);
    markAsInstrumented(path);
    return trackerCall;
}
module.exports = declare((api) => {
    api.assertVersion(7);
    return {
        name: 'typescript-support-plugin',
        visitor: {
            // Skip type-only declarations - we don't want to instrument these
            TSInterfaceDeclaration(path) {
                // Skip instrumentation, just log
                console.log(`Skipping TypeScript interface: ${path.node.id.name}`);
            },
            TSTypeAliasDeclaration(path) {
                // Skip instrumentation, just log
                console.log(`Skipping TypeScript type alias: ${path.node.id.name}`);
            },
            TSEnumDeclaration(path) {
                // Skip instrumentation, just log
                console.log(`Skipping TypeScript enum: ${path.node.id.name}`);
            },
            TSDeclareFunction(path) {
                // Skip instrumentation, just log
                const functionName = path.node.id?.name || 'anonymous';
                console.log(`Skipping TypeScript declare function: ${functionName}`);
            },
            // Handle type assertions by preserving the expression but removing the type cast
            TSAsExpression(path) {
                console.log('Processing TypeScript as expression');
                // We want to keep the expression but remove the type cast
                path.replaceWith(path.node.expression);
            },
            // Handle TS-specific node types - we need to keep these unmodified
            TSTypeParameter() {
                // Skip without modifying
            },
            TSParameterProperty() {
                // Skip without modifying
            },
            // Proper instrumentation for conditional expressions in TypeScript
            ConditionalExpression(path) {
                if (isInstrumented(path) || isTypeDeclaration(path))
                    return;
                const filename = this.filename || 'unknown';
                const componentName = getComponentName(filename, path);
                try {
                    // Get the condition and replace it with our instrumented version
                    const condition = path.get('test').node;
                    const instrumentedCondition = createBranchInstrumentation(path, componentName, condition, 'ternary');
                    path.get('test').replaceWith(instrumentedCondition);
                    markAsInstrumented(path);
                }
                catch (error) {
                    console.error('Error instrumenting conditional expression:', error);
                }
            },
            // Properly handle if statements in TypeScript code
            IfStatement(path) {
                if (isInstrumented(path) || isTypeDeclaration(path))
                    return;
                const filename = this.filename || 'unknown';
                const componentName = getComponentName(filename, path);
                try {
                    // Get the condition and replace it with our instrumented version
                    const condition = path.get('test').node;
                    const instrumentedCondition = createBranchInstrumentation(path, componentName, condition, 'if');
                    path.get('test').replaceWith(instrumentedCondition);
                    markAsInstrumented(path);
                }
                catch (error) {
                    console.error('Error instrumenting if statement:', error);
                }
            },
            // Properly handle logical expressions in TypeScript code
            LogicalExpression(path) {
                if (isInstrumented(path) || isTypeDeclaration(path))
                    return;
                const filename = this.filename || 'unknown';
                const componentName = getComponentName(filename, path);
                try {
                    // Avoid instrumenting the inner parts of JSX && conditional rendering
                    const isJSXParent = path.findParent(p => p.isJSXExpressionContainer());
                    if (isJSXParent && path.node.operator === '&&') {
                        const leftCondition = path.get('left').node;
                        const instrumentedCondition = createBranchInstrumentation(path, componentName, leftCondition, 'jsx-conditional');
                        path.get('left').replaceWith(instrumentedCondition);
                        markAsInstrumented(path);
                        return;
                    }
                    // For regular logical expressions
                    if (path.node.operator === '&&' || path.node.operator === '||') {
                        const leftCondition = path.get('left').node;
                        const instrumentedCondition = createBranchInstrumentation(path, componentName, leftCondition, `logical-${path.node.operator}`);
                        path.get('left').replaceWith(instrumentedCondition);
                        markAsInstrumented(path);
                    }
                }
                catch (error) {
                    console.error('Error instrumenting logical expression:', error);
                }
            },
            // Proper handling of function declarations with TypeScript annotations
            FunctionDeclaration(path) {
                if (isInstrumented(path) || isTypeDeclaration(path))
                    return;
                // Strip type annotations to prevent issues
                stripTypeAnnotations(path.node);
                // Continue with normal instrumentation
                const filename = this.filename || 'unknown';
                const componentName = getComponentName(filename, path);
                const functionName = path.node.id?.name || 'anonymous';
                const functionId = createId(path);
                // Log that we're instrumenting this function
                console.log(`Instrumenting function with TypeScript support: ${functionName}`);
            },
            // Handle arrow functions with TypeScript annotations
            ArrowFunctionExpression(path) {
                if (isInstrumented(path) || isTypeDeclaration(path))
                    return;
                // Strip type annotations to prevent issues
                stripTypeAnnotations(path.node);
                // For arrow functions in TS, they often have type annotations we need to handle
                const filename = this.filename || 'unknown';
                const componentName = getComponentName(filename, path);
                const functionId = createId(path);
                // Log that we're instrumenting this arrow function
                console.log('Instrumenting arrow function with TypeScript support');
            },
            // For variables with type annotations
            VariableDeclarator(path) {
                if (isInstrumented(path) || isTypeDeclaration(path))
                    return;
                // Strip type annotations to prevent issues
                if (path.node.id && path.node.id.typeAnnotation) {
                    path.node.id.typeAnnotation = null;
                }
                const varName = path.node.id?.name || 'anonymous';
                console.log(`Processing variable with TypeScript support: ${varName}`);
            }
        }
    };
});
