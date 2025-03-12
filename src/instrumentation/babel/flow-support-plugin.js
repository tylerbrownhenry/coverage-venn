/**
 * Enhanced Babel plugin for Flow support (Performance Optimized)
 * 
 * This plugin instruments Flow code while properly handling Flow-specific syntax.
 * It includes optimizations to avoid recursion issues and memory problems
 * when handling complex Flow type structures.
 */

const { declare } = require('@babel/helper-plugin-utils');
const t = require('@babel/types');

// Cache for component names to avoid recalculation
const componentNameCache = new Map();

// Cache for type declaration checks to avoid repeated traversals
const typeDeclarationCache = new Map();

// Cache for instrumented node IDs to prevent repeated checks
const instrumentedNodeCache = new Set();

// Cache for parent path checks to avoid recursion
const parentPathCache = new Map();

// Track node types that have been problematic
const heavyProcessingTypes = new Set();

// Memory management helper - clears caches when they exceed certain sizes
function manageCacheSize() {
  if (componentNameCache.size > 500) componentNameCache.clear();
  if (typeDeclarationCache.size > 1000) typeDeclarationCache.clear();
  if (instrumentedNodeCache.size > 3000) instrumentedNodeCache.clear();
  if (parentPathCache.size > 1000) parentPathCache.clear();
  
  // Force garbage collection if available in this environment
  if (global.gc) {
    try {
      global.gc();
    } catch (e) {
      // Ignore if gc is not available
    }
  }
}

// Helper to get the component name from filename or nearest container component
function getComponentName(filename, path) {
  // Check cache first
  const pathNode = path.node;
  if (pathNode && pathNode.loc) {
    const cacheKey = `${filename}:${pathNode.loc.start.line}:${pathNode.loc.start.column}`;
    if (componentNameCache.has(cacheKey)) {
      return componentNameCache.get(cacheKey);
    }
  }
  
  // Try to get name from the closest component context
  let componentPath = path.findParent(p => 
    p.isClassDeclaration() || 
    p.isFunctionDeclaration() || 
    (p.isVariableDeclarator() && 
      p.get('init') && (
      p.get('init').isArrowFunctionExpression() || 
      p.get('init').isFunctionExpression())));
  
  let componentName = 'UnknownComponent';
  
  if (componentPath) {
    // For function declarations, use the function name
    if (componentPath.isFunctionDeclaration() && componentPath.node.id) {
      componentName = componentPath.node.id.name;
    }
    // For class declarations, use the class name
    else if (componentPath.isClassDeclaration() && componentPath.node.id) {
      componentName = componentPath.node.id.name;
    }
    // For variable declarators with function expressions
    else if (componentPath.isVariableDeclarator() && componentPath.node.id) {
      componentName = componentPath.node.id.name;
    }
  } else {
    // Fallback to filename if no component name is found
    if (filename) {
      const parts = filename.split(/[\/\\]/);
      const fileNameWithExt = parts[parts.length - 1];
      const fileName = fileNameWithExt.split('.')[0];
      componentName = fileName;
    }
  }
  
  // Cache the result
  if (pathNode && pathNode.loc) {
    const cacheKey = `${filename}:${pathNode.loc.start.line}:${pathNode.loc.start.column}`;
    componentNameCache.set(cacheKey, componentName);
  }
  
  return componentName;
}

// Check if a node has already been instrumented
function isInstrumented(path) {
  const nodeId = getNodeId(path);
  return nodeId ? instrumentedNodeCache.has(nodeId) : false;
}

// Mark a node as instrumented
function markAsInstrumented(path) {
  const nodeId = getNodeId(path);
  if (nodeId) {
    instrumentedNodeCache.add(nodeId);
    return true;
  }
  return false;
}

// Get a unique ID for a node
function getNodeId(path) {
  if (!path || !path.node) return null;
  
  const node = path.node;
  if (!node.loc) return null;
  
  return `${node.type}:${node.loc.start.line}:${node.loc.start.column}`;
}

// Check if a node is part of our instrumentation code
// Iterative approach to avoid recursion
function isPartOfInstrumentation(path) {
  if (!path || !path.node) return false;
  
  // Check cache first
  const nodeId = getNodeId(path);
  if (nodeId && parentPathCache.has(nodeId)) {
    return parentPathCache.get(nodeId);
  }
  
  // Iterate through parent hierarchy instead of using recursion
  let currentPath = path;
  const maxDepth = 8; // Limit depth to prevent performance issues
  let depth = 0;
  
  while (currentPath && depth < maxDepth) {
    // Check if it's a member expression for COVERAGE_TRACKER
    if (currentPath.isMemberExpression() && 
        currentPath.node.object && 
        currentPath.node.object.name === 'COVERAGE_TRACKER') {
      if (nodeId) parentPathCache.set(nodeId, true);
      return true;
    }
    
    // Check if it's a call to COVERAGE_TRACKER methods
    if (currentPath.isCallExpression() && 
        currentPath.node.callee && 
        currentPath.node.callee.type === 'MemberExpression' && 
        currentPath.node.callee.object && 
        currentPath.node.callee.object.name === 'COVERAGE_TRACKER') {
      if (nodeId) parentPathCache.set(nodeId, true);
      return true;
    }
    
    // Skip heavy processing for known problematic node types
    if (currentPath.node && heavyProcessingTypes.has(currentPath.node.type)) {
      depth += 2; // Accelerate the traversal for problematic nodes
    }
    
    currentPath = currentPath.parentPath;
    depth++;
  }
  
  if (nodeId) parentPathCache.set(nodeId, false);
  return false;
}

// Optimized Flow type detection using type name lookup instead of recursion
// This is a key performance improvement
const FLOW_TYPE_NODES = new Set([
  'TypeAnnotation',
  'GenericTypeAnnotation',
  'TypeParameterDeclaration',
  'InterfaceDeclaration',
  'TypeAlias',
  'DeclareClass',
  'DeclareFunction',
  'DeclareInterface',
  'DeclareModule',
  'DeclareTypeAlias',
  'DeclareVariable',
  'TypeofTypeAnnotation',
  'UnionTypeAnnotation',
  'IntersectionTypeAnnotation',
  'ObjectTypeAnnotation',
  'ObjectTypeProperty',
  'ObjectTypeSpreadProperty',
  'FunctionTypeAnnotation',
  'FunctionTypeParam',
  'TypeParameterInstantiation',
  'TypeParameter',
  'ExistsTypeAnnotation'
]);

// Check if the node is part of a type-only declaration for Flow
// Using memoization for performance
function isFlowTypeDeclaration(path, maxDepth = 3) {
  if (!path || !path.node) return false;
  
  // Use cache if available
  const nodeId = getNodeId(path);
  if (nodeId && typeDeclarationCache.has(nodeId)) {
    return typeDeclarationCache.get(nodeId);
  }
  
  // Fast path: check if this node type is a Flow type node
  const nodeType = path.node.type;
  if (FLOW_TYPE_NODES.has(nodeType)) {
    if (nodeId) typeDeclarationCache.set(nodeId, true);
    return true;
  }
  
  // For certain node types that commonly contain type info, do deeper checks
  if (
    nodeType === 'Identifier' ||
    nodeType === 'CallExpression' ||
    nodeType === 'MemberExpression'
  ) {
    // Check if the node has typeAnnotation
    if (path.node.typeAnnotation) {
      if (nodeId) typeDeclarationCache.set(nodeId, true);
      return true;
    }
    
    // Check if the node is inside a type application
    if (path.parentPath && FLOW_TYPE_NODES.has(path.parentPath.node.type)) {
      if (nodeId) typeDeclarationCache.set(nodeId, true);
      return true;
    }
  }
  
  // Check parent path for type declarations (iteratively to avoid recursion)
  // Only if maxDepth allows it and not for types we know are problematic
  if (maxDepth > 0 && !heavyProcessingTypes.has(nodeType)) {
    let parent = path.parentPath;
    let depth = 0;
    
    while (parent && depth < maxDepth) {
      if (!parent.node) break;
      
      const parentType = parent.node.type;
      
      if (FLOW_TYPE_NODES.has(parentType)) {
        // We found a Flow type, remember this to avoid future deep checks
        if (depth > 1) {
          heavyProcessingTypes.add(nodeType);
        }
        
        if (nodeId) typeDeclarationCache.set(nodeId, true);
        return true;
      }
      
      parent = parent.parentPath;
      depth++;
    }
  }
  
  // Not a type declaration
  if (nodeId) typeDeclarationCache.set(nodeId, false);
  return false;
}

// Flow utility to strip type-related properties from nodes
// Non-recursive and more targeted approach
function stripFlowTypeAnnotations(node) {
  if (!node) return node;
  
  // Remove Flow-specific properties
  if (node.typeAnnotation) node.typeAnnotation = null;
  if (node.typeParameters) node.typeParameters = null;
  if (node.returnType) node.returnType = null;
  if (node.predicate) node.predicate = null;
  
  return node;
}

// Helper to create a unique ID for tracking
function createId(path) {
  if (!path.node || !path.node.loc) {
    return Math.random().toString(36).substr(2, 9);
  }
  
  const loc = path.node.loc;
  const filename = this.filename || 'unknown';
  
  return `${filename.split('/').pop()}:${loc.start.line}:${loc.start.column}`;
}

// Create a branch instrumentation call
function createBranchInstrumentation(path, componentName, condition, branchType) {
  if (!path || !path.node) {
    console.warn('createBranchInstrumentation called with invalid path');
    return condition; // Return the original condition as a fallback
  }
  
  // Guard against circular structures or too complex objects
  try {
    // Simple check to avoid recursion by just using string representation
    JSON.stringify(condition);
  } catch (e) {
    console.warn('Cannot serialize condition, skipping instrumentation');
    return condition;
  }
  
  const id = path.node.loc 
    ? `${path.node.loc.start.line}:${path.node.loc.start.column}`
    : Math.random().toString(36).substr(2, 9);
    
  const location = path.node.loc 
    ? `${path.node.loc.start.line}:${path.node.loc.start.column}` 
    : 'unknown';
  
  // Create safer, simplified call to avoid recursion
  const trackerCall = {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      object: { type: 'Identifier', name: 'COVERAGE_TRACKER' },
      property: { type: 'Identifier', name: 'trackBranch' },
      computed: false
    },
    arguments: [
      { type: 'StringLiteral', value: id },
      { type: 'StringLiteral', value: componentName },
      { type: 'StringLiteral', value: branchType },
      condition,
      { type: 'StringLiteral', value: location }
    ]
  };
  
  return trackerCall;
}

// Check if file has Flow annotation
function hasFlowAnnotation(path) {
  // Fast check for @flow comment at the top of the file
  const comments = path.parent.comments;
  
  if (comments && comments.length > 0) {
    for (let i = 0; i < Math.min(5, comments.length); i++) {
      const comment = comments[i];
      if (comment.value.includes('@flow')) {
        return true;
      }
    }
  }
  
  // Quick check for flow pragma
  const firstDirective = path.node.directives && path.node.directives[0];
  if (firstDirective && firstDirective.value && firstDirective.value.value === 'use flow') {
    return true;
  }
  
  // Check for common Flow imports
  for (const node of path.node.body) {
    if (node.type === 'ImportDeclaration' && 
        node.importKind === 'type') {
      return true;
    }
    
    // Only check the first few nodes for performance
    if (node.type === 'ImportDeclaration' && 
        node.source && 
        node.source.value === 'flow-typed') {
      return true;
    }
  }
  
  return false;
}

// Efficient check helper function that applies multiple validations in one go
// This reduces duplicate checks and improves performance
function shouldInstrument(path, state) {
  if (!state.hasFlow || !path.node) {
    return false;
  }
  
  if (isInstrumented(path)) {
    return false;
  }
  
  // Use minimal depth for type checking on the first pass
  if (isFlowTypeDeclaration(path, 1)) {
    return false;
  }
  
  if (isPartOfInstrumentation(path)) {
    return false;
  }
  
  // Additional filter for heavy node types
  const nodeType = path.node.type;
  if (heavyProcessingTypes.has(nodeType)) {
    // For known heavy types, apply more aggressive filtering
    if (!path.node.loc || path.scope.path.isProgram()) {
      return false;
    }
  }
  
  return true;
}

module.exports = declare((api) => {
  api.assertVersion(7);
  
  return {
    name: 'flow-support-plugin',
    pre() {
      // Reset state for new files to prevent memory issues
      if (componentNameCache.size > 500) componentNameCache.clear();
      if (typeDeclarationCache.size > 1000) typeDeclarationCache.clear();
      if (instrumentedNodeCache.size > 3000) instrumentedNodeCache.clear();
      if (parentPathCache.size > 1000) parentPathCache.clear();
      heavyProcessingTypes.clear();
    },
    visitor: {
      Program: {
        enter(path, state) {
          // Check if file has Flow annotation
          state.hasFlow = hasFlowAnnotation(path);
          
          if (state.hasFlow) {
            console.log(`Flow annotations detected in file: ${this.filename || 'unknown'}`);
          }
        },
        exit() {
          // Clean up caches periodically
          manageCacheSize();
        }
      },
      
      // Skip type-only declarations - we don't want to instrument these
      InterfaceDeclaration(path) {
        // Mark as instrumented to skip further processing
        markAsInstrumented(path);
      },
      
      TypeAlias(path) {
        // Mark as instrumented to skip further processing
        markAsInstrumented(path);
      },
      
      DeclareClass(path) {
        // Mark as instrumented to skip further processing
        markAsInstrumented(path);
      },
      
      DeclareFunction(path) {
        // Mark as instrumented to skip further processing
        markAsInstrumented(path);
      },
      
      DeclareInterface(path) {
        // Mark as instrumented to skip further processing
        markAsInstrumented(path);
      },
      
      DeclareModule(path) {
        // Mark as instrumented to skip further processing
        markAsInstrumented(path);
      },
      
      DeclareTypeAlias(path) {
        // Mark as instrumented to skip further processing
        markAsInstrumented(path);
      },
      
      DeclareVariable(path) {
        // Mark as instrumented to skip further processing
        markAsInstrumented(path);
      },
      
      TypeCastExpression(path) {
        // Replace with the inner expression to remove Flow type cast
        path.replaceWith(path.node.expression);
        
        // Mark as instrumented
        markAsInstrumented(path);
      },
      
      TypeParameterDeclaration(path) {
        // Mark as instrumented to skip further processing
        markAsInstrumented(path);
      },
      
      ConditionalExpression(path, state) {
        if (!shouldInstrument(path, state)) return;
        
        // Get component name for tracking
        const componentName = getComponentName(this.filename, path);
        
        // Create a unique ID for the ternary operator
        const id = createId.call(this, path);
        
        // Save original test, consequent, and alternate
        const test = path.node.test;
        const consequent = path.node.consequent;
        const alternate = path.node.alternate;
        
        // Instrument ternary operator test
        path.node.test = createBranchInstrumentation(
          path, 
          componentName, 
          test, 
          'ternary'
        );
        
        // Mark as instrumented
        markAsInstrumented(path);
      },
      
      IfStatement(path, state) {
        if (!shouldInstrument(path, state)) return;
        
        // Get component name for tracking
        const componentName = getComponentName(this.filename, path);
        
        // Create instrumentation call for the if condition
        const test = path.node.test;
        
        // Replace the test with instrumented version
        path.node.test = createBranchInstrumentation(
          path, 
          componentName, 
          test, 
          'if'
        );
        
        // Mark as instrumented
        markAsInstrumented(path);
      },
      
      LogicalExpression(path, state) {
        if (!shouldInstrument(path, state)) return;
        
        // Get component name for tracking
        const componentName = getComponentName(this.filename, path);
        
        // Use a more defensive approach for logical operators to avoid recursion
        try {
          // Create a unique ID for this logical expression
          const id = path.node.loc 
            ? `${path.node.loc.start.line}:${path.node.loc.start.column}`
            : Math.random().toString(36).substr(2, 9);
          
          const operator = path.node.operator;
          
          // Don't transform deeply nested logical expressions
          if (path.isAncestor || path.parentPath && path.parentPath.isLogicalExpression()) {
            // Only mark as instrumented to prevent further processing
            markAsInstrumented(path);
            return;
          }
          
          // For simple logical expressions, just wrap the whole expression
          // This avoids recursive transformations that can cause stack overflow
          const wrapper = {
            type: 'CallExpression',
            callee: {
              type: 'MemberExpression',
              object: { type: 'Identifier', name: 'COVERAGE_TRACKER' },
              property: { type: 'Identifier', name: 'trackBranch' },
              computed: false
            },
            arguments: [
              { type: 'StringLiteral', value: id },
              { type: 'StringLiteral', value: componentName },
              { type: 'StringLiteral', value: `logical-${operator}` },
              path.node, // Use the entire original node
              { type: 'StringLiteral', value: path.node.loc 
                ? `${path.node.loc.start.line}:${path.node.loc.start.column}` 
                : 'unknown' 
              }
            ]
          };
          
          // Replace the original node with our wrapper
          path.replaceWith(wrapper);
          
          // Mark as instrumented
          markAsInstrumented(path);
        } catch (error) {
          console.error("Error instrumenting logical expression:", error);
          // Skip instrumentation on error
        }
      },
      
      FunctionDeclaration(path, state) {
        if (!shouldInstrument(path, state)) return;
        
        // Remove Flow type annotations from function params
        if (path.node.params) {
          path.node.params.forEach(param => {
            stripFlowTypeAnnotations(param);
          });
        }
        
        // Remove return type annotation
        if (path.node.returnType) {
          path.node.returnType = null;
        }
        
        // Mark as instrumented
        markAsInstrumented(path);
      },
      
      ArrowFunctionExpression(path, state) {
        if (!shouldInstrument(path, state)) return;
        
        // Remove Flow type annotations from arrow function params
        if (path.node.params) {
          path.node.params.forEach(param => {
            stripFlowTypeAnnotations(param);
          });
        }
        
        // Remove return type annotation
        if (path.node.returnType) {
          path.node.returnType = null;
        }
        
        // Mark as instrumented
        markAsInstrumented(path);
      },
      
      VariableDeclarator(path, state) {
        if (!shouldInstrument(path, state)) return;
        
        // Remove type annotation from variable declarator
        if (path.node.id && path.node.id.typeAnnotation) {
          path.node.id.typeAnnotation = null;
        }
        
        // Mark as instrumented
        markAsInstrumented(path);
      },
      
      ObjectProperty(path, state) {
        if (!shouldInstrument(path, state)) return;
        
        // Check if this is a Flow property with type annotation
        if (path.node.value && path.node.value.typeAnnotation) {
          // Remove the type annotation
          path.node.value.typeAnnotation = null;
        }
        
        // Mark as instrumented
        markAsInstrumented(path);
      },
      
      ClassMethod(path, state) {
        if (!shouldInstrument(path, state)) return;
        
        // Remove type annotations from method params
        if (path.node.params) {
          path.node.params.forEach(param => {
            stripFlowTypeAnnotations(param);
          });
        }
        
        // Remove return type
        if (path.node.returnType) {
          path.node.returnType = null;
        }
        
        // Mark as instrumented
        markAsInstrumented(path);
      },
    }
  };
}); 