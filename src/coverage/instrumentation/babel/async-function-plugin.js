/**
 * Babel plugin for instrumenting async functions and promises
 */

const { declare } = require('@babel/helper-plugin-utils');
const t = require('@babel/types');

// Counter to generate unique IDs
let asyncIdCounter = 0;
let promiseIdCounter = 0;
let awaitIdCounter = 0;

/**
 * Check if a node is part of our instrumentation code
 */
function isPartOfInstrumentation(path) {
  // Check if this is part of our instrumentation code
  const node = path.node;
  
  // Check if the node is already instrumented
  if (node._asyncInstrumented) {
    return true;
  }
  
  // Check if this is a call to one of our tracking functions
  if (path.isCallExpression() && 
      path.get('callee').isMemberExpression() &&
      path.get('callee').get('object').isIdentifier({ name: 'COVERAGE_TRACKER' })) {
    return true;
  }
  
  // Check if this is a reference to COVERAGE_TRACKER
  if (path.isIdentifier() && path.node.name === 'COVERAGE_TRACKER') {
    return true;
  }
  
  // Check if this is a member expression of COVERAGE_TRACKER
  if (path.isMemberExpression() && 
      path.get('object').isIdentifier({ name: 'COVERAGE_TRACKER' })) {
    return true;
  }
  
  return false;
}

/**
 * Get component name from file path and scope
 */
function getComponentName(filename, path) {
  // Try to get from function name or variable declaration
  const scope = path.scope;
  
  // Check if scope.block is a function declaration with an id
  if (t.isFunctionDeclaration(scope.block) && scope.block.id?.name) {
    return scope.block.id.name;
  }
  
  // Try to get from containing variable declaration
  const variableDeclarator = path.findParent((p) => p.isVariableDeclarator());
  
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
 * Create instrumentation for async function
 */
function createAsyncFunctionWrapper(path, functionName, functionId, componentName) {
  // Get original body
  const originalBody = path.node.body;
  
  // Create tracking start call
  const startTrackingCall = t.expressionStatement(
    t.callExpression(
      t.memberExpression(
        t.identifier('COVERAGE_TRACKER'),
        t.identifier('trackAsyncFunctionStart')
      ),
      [
        t.stringLiteral(componentName),
        t.stringLiteral(functionName),
        t.numericLiteral(functionId)
      ]
    )
  );
  
  // If the original body is not a block statement, we need to wrap it
  let bodyBlock;
  if (t.isBlockStatement(originalBody)) {
    bodyBlock = originalBody;
  } else {
    // For arrow functions with expression bodies
    bodyBlock = t.blockStatement([
      t.returnStatement(originalBody)
    ]);
  }
  
  // Create result variable name
  const resultId = path.scope.generateUidIdentifier('asyncResult');
  
  // Create new body with promise resolution/rejection tracking
  const newBody = t.blockStatement([
    // Start tracking
    startTrackingCall,
    
    // Create return statement that wraps the original function execution with tracking
    t.returnStatement(
      t.callExpression(
        t.memberExpression(
          t.callExpression(
            t.memberExpression(
              t.functionExpression(
                null, // Anonymous function
                [], // No params
                bodyBlock, // Original function body in a block
                path.node.generator, // Preserve generator flag 
                true // Make it async (always true for this wrapper)
              ),
              t.identifier('call') // Using Function.prototype.call
            ),
            [t.thisExpression()] // Preserve 'this' context
          ),
          t.identifier('then') // Chain .then handler
        ),
        [
          // Success handler
          t.arrowFunctionExpression(
            [resultId], // Function param - the resolved value
            t.callExpression(
              t.memberExpression(
                t.identifier('COVERAGE_TRACKER'),
                t.identifier('trackAsyncFunctionResolved')
              ),
              [
                t.stringLiteral(componentName),
                t.stringLiteral(functionName),
                t.numericLiteral(functionId),
                resultId // Pass the result
              ]
            )
          ),
          // Error handler
          t.arrowFunctionExpression(
            [t.identifier('error')], // Function param - the error
            t.callExpression(
              t.memberExpression(
                t.identifier('COVERAGE_TRACKER'),
                t.identifier('trackAsyncFunctionRejected')
              ),
              [
                t.stringLiteral(componentName),
                t.stringLiteral(functionName),
                t.numericLiteral(functionId),
                t.identifier('error')
              ]
            )
          )
        ]
      )
    )
  ]);
  
  // Mark as instrumented
  newBody._asyncInstrumented = true;
  
  return newBody;
}

/**
 * Create instrumentation for tracking await expressions
 */
function instrumentAwaitExpression(path, state) {
  if (path.node._asyncInstrumented || isPartOfInstrumentation(path)) {
    return;
  }
  
  const awaitId = awaitIdCounter++;
  const componentName = getComponentName(state.filename, path);
  
  // Find the closest function to get its name
  const closestFunction = path.findParent((p) => 
    p.isFunction() && (p.node.async || p.node.id?.name?.includes('async'))
  );
  
  if (!closestFunction) return; // Not inside an async function
  
  // Get function name
  let functionName = 'anonymous';
  let functionId = 0;
  
  if (closestFunction.node._asyncFunctionId) {
    functionId = closestFunction.node._asyncFunctionId;
  }
  
  if (closestFunction.node.id && closestFunction.node.id.name) {
    functionName = closestFunction.node.id.name;
  } else {
    // Try to get name from variable declarator
    const variableDeclarator = closestFunction.findParent((p) => p.isVariableDeclarator());
    if (variableDeclarator && 
        variableDeclarator.node && 
        variableDeclarator.node.id && 
        t.isIdentifier(variableDeclarator.node.id)) {
      functionName = variableDeclarator.node.id.name;
    }
  }
  
  // Get location in the source code
  const location = `line${path.node.loc?.start.line || 'unknown'}`;
  
  // Get the original expression being awaited
  const originalExpression = path.node.argument;
  
  // Create the instrumented expression
  const trackerCall = t.callExpression(
    t.memberExpression(
      t.identifier('COVERAGE_TRACKER'),
      t.identifier('trackAwaitPoint')
    ),
    [
      t.stringLiteral(componentName),
      t.stringLiteral(functionName),
      t.numericLiteral(functionId),
      t.stringLiteral(location)
    ]
  );
  
  // Replace the await expression with a sequence that tracks then awaits
  const newNode = t.awaitExpression(
    t.sequenceExpression([
      trackerCall,
      originalExpression
    ])
  );
  
  // Mark as instrumented
  newNode._asyncInstrumented = true;
  
  path.replaceWith(newNode);
  path.skip(); // Skip to prevent infinite recursion
}

/**
 * Create instrumentation for Promise methods
 */
function instrumentPromiseMethod(path, state, methodName) {
  if (path.node._asyncInstrumented || isPartOfInstrumentation(path)) {
    return;
  }
  
  // Check if it's an actual promise method call
  const callee = path.node.callee;
  if (!t.isMemberExpression(callee) || 
      !t.isIdentifier(callee.property, { name: methodName })) {
    return;
  }
  
  // Verify it's a Promise or something with then/catch
  const objectPath = path.get('callee').get('object');
  
  // Common promise-like patterns:
  // 1. Direct Promise.X call (like Promise.all)
  // 2. Something.then() chaining
  // 3. new Promise()
  const isPromiseLike = 
    (objectPath.isIdentifier({ name: 'Promise' })) ||
    (objectPath.isMemberExpression() && objectPath.get('property').isIdentifier({ name: methodName })) ||
    (objectPath.isCallExpression() && 
     objectPath.get('callee').isMemberExpression() && 
     objectPath.get('callee').get('property').isIdentifier({ name: methodName })) ||
    (objectPath.isNewExpression() && objectPath.get('callee').isIdentifier({ name: 'Promise' }));
  
  if (!isPromiseLike) {
    return;
  }
  
  const promiseId = promiseIdCounter++;
  const componentName = getComponentName(state.filename, path);
  
  // Create the tracker call
  const trackerCall = t.callExpression(
    t.memberExpression(
      t.identifier('COVERAGE_TRACKER'),
      t.identifier(`trackPromise${methodName.charAt(0).toUpperCase() + methodName.slice(1)}`)
    ),
    [
      t.stringLiteral(componentName),
      t.numericLiteral(promiseId),
      t.stringLiteral(methodName)
    ]
  );
  
  // Create a sequence expression to track and then call the original method
  const newCallExpression = t.callExpression(
    callee,
    path.node.arguments
  );
  
  // Create a sequence that first tracks, then calls the original
  const sequence = t.sequenceExpression([
    trackerCall,
    newCallExpression
  ]);
  
  // Mark as instrumented
  sequence._asyncInstrumented = true;
  
  // Replace the original call with our sequence
  path.replaceWith(sequence);
  path.skip(); // Skip to prevent recursion
}

/**
 * Instrument Promise creation
 */
function instrumentPromiseCreation(path, state) {
  if (path.node._asyncInstrumented || isPartOfInstrumentation(path)) {
    return;
  }
  
  // Check if it's a Promise constructor call
  if (!t.isNewExpression(path.node) || 
      !t.isIdentifier(path.node.callee, { name: 'Promise' })) {
    return;
  }
  
  const promiseId = promiseIdCounter++;
  const componentName = getComponentName(state.filename, path);
  
  // Create tracker function call
  const trackerCall = t.callExpression(
    t.memberExpression(
      t.identifier('COVERAGE_TRACKER'),
      t.identifier('trackPromiseCreation')
    ),
    [
      t.stringLiteral(componentName),
      t.numericLiteral(promiseId),
      t.stringLiteral('creation')
    ]
  );
  
  // We'll use the returned promise wrapper function to track this promise
  const promiseTrackerId = path.scope.generateUidIdentifier('promiseTracker');
  
  // Initialize the tracker 
  const trackerInit = t.variableDeclaration(
    'const',
    [
      t.variableDeclarator(
        promiseTrackerId,
        trackerCall
      )
    ]
  );
  
  // Create a new Promise constructor call with the same arguments
  const newPromiseCall = t.newExpression(
    t.identifier('Promise'),
    path.node.arguments
  );
  
  // Use the tracker to wrap and track the promise
  const trackedPromise = t.callExpression(
    promiseTrackerId,
    [newPromiseCall]
  );
  
  // Create an IIFE to handle the tracking
  const iife = t.callExpression(
    t.arrowFunctionExpression(
      [],
      t.blockStatement([
        trackerInit,
        t.returnStatement(trackedPromise)
      ])
    ),
    []
  );
  
  // Mark as instrumented
  iife._asyncInstrumented = true;
  
  // Replace with our tracked promise
  path.replaceWith(iife);
  path.skip(); // Skip to prevent recursion
}

/**
 * Babel plugin for async function instrumentation
 */
module.exports = declare((api) => {
  api.assertVersion(7);
  
  return {
    name: 'async-function-instrumentation-plugin',
    visitor: {
      // Handle async function declarations
      FunctionDeclaration(path, state) {
        // Only instrument async functions
        if (!path.node.async) return;
        
        // Skip if it's a test function
        const functionName = path.node.id?.name || 'anonymous';
        if (functionName.includes('test') || functionName.includes('Test') || functionName.includes('mock')) {
          return;
        }
        
        // Skip if already instrumented or inside node_modules
        if (path.node._asyncInstrumented || 
            (state.filename && state.filename.includes('node_modules'))) {
          return;
        }
        
        // Skip if it's part of our instrumentation
        if (isPartOfInstrumentation(path)) {
          return;
        }
        
        const functionId = asyncIdCounter++;
        const componentName = getComponentName(state.filename, path);
        
        // Store the ID on the node for reference by await expressions
        path.node._asyncFunctionId = functionId;
        
        // Create new body with async function tracking
        const newBody = createAsyncFunctionWrapper(
          path,
          functionName,
          functionId,
          componentName
        );
        
        // Replace the function body
        path.get('body').replaceWith(newBody);
        
        // Mark as instrumented
        path.node._asyncInstrumented = true;
      },
      
      // Handle async arrow functions
      ArrowFunctionExpression(path, state) {
        // Only instrument async arrow functions
        if (!path.node.async) return;
        
        // Skip if inside test files
        if (state.filename.includes('test') || state.filename.includes('__tests__')) {
          return;
        }
        
        // Skip if already instrumented or inside node_modules
        if (path.node._asyncInstrumented || 
            (state.filename && state.filename.includes('node_modules'))) {
          return;
        }
        
        // Skip if it's part of our instrumentation
        if (isPartOfInstrumentation(path)) {
          return;
        }
        
        const functionId = asyncIdCounter++;
        const componentName = getComponentName(state.filename, path);
        
        // Get function name from parent if possible
        let functionName = 'anonymous';
        const variableDeclarator = path.findParent((p) => p.isVariableDeclarator());
        
        // Safely check and access id property with type guards
        if (variableDeclarator && variableDeclarator.node && 
            'id' in variableDeclarator.node && 
            variableDeclarator.node.id &&
            t.isIdentifier(variableDeclarator.node.id)) {
          functionName = variableDeclarator.node.id.name;
        }
        
        // Store the ID on the node for reference by await expressions
        path.node._asyncFunctionId = functionId;
        
        // Create new body with async function tracking
        const newBody = createAsyncFunctionWrapper(
          path,
          functionName,
          functionId,
          componentName
        );
        
        // Replace the function body
        path.get('body').replaceWith(newBody);
        
        // Mark as instrumented
        path.node._asyncInstrumented = true;
      },
      
      // Track await expressions
      AwaitExpression(path, state) {
        instrumentAwaitExpression(path, state);
      },
      
      // Track promise creation
      NewExpression(path, state) {
        instrumentPromiseCreation(path, state);
      },
      
      // Track promise methods (then, catch, finally)
      CallExpression(path, state) {
        // Check for common Promise methods
        if (path.node.callee && t.isMemberExpression(path.node.callee)) {
          const methodName = path.node.callee.property?.name;
          
          if (methodName === 'then') {
            instrumentPromiseMethod(path, state, 'then');
          } else if (methodName === 'catch') {
            instrumentPromiseMethod(path, state, 'catch');
          } else if (methodName === 'finally') {
            instrumentPromiseMethod(path, state, 'finally');
          }
        }
      }
    }
  };
}); 