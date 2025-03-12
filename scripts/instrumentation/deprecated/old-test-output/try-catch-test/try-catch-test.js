
// Simple try/catch
function simpleTryCatch(shouldThrow) {
  try {
    console.log("In try block");
    if (shouldThrow) {
      throw new Error("Test error");
    }
    return "Success";
  } catch (error) {
    console.log("In catch block:", error.message);
    return "Caught: " + error.message;
  }
}

// Try/catch/finally
function tryCatchFinally(shouldThrow) {
  let result = "";
  try {
    console.log("In try block with finally");
    if (shouldThrow) {
      throw new Error("Test error with finally");
    }
    result = "Success";
  } catch (error) {
    console.log("In catch block with finally:", error.message);
    result = "Caught: " + error.message;
  } finally {
    console.log("In finally block");
    result += " (finally executed)";
  }
  return result;
}

// Try/finally (no catch)
function tryFinally(shouldThrow) {
  let result = "";
  try {
    console.log("In try block with only finally");
    if (shouldThrow) {
      throw new Error("Uncaught error");
    }
    result = "Success";
  } finally {
    console.log("In finally block (no catch)");
    result += " (finally executed)";
  }
  return result;
}

// Nested try/catch blocks
function nestedTryCatch(level, shouldThrowInner, shouldThrowOuter) {
  try {
    console.log("Outer try block (level " + level + ")");
    if (shouldThrowOuter) {
      throw new Error("Outer error at level " + level);
    }
    
    try {
      console.log("Inner try block (level " + level + ")");
      if (shouldThrowInner) {
        throw new Error("Inner error at level " + level);
      }
      return "Inner success at level " + level;
    } catch (innerError) {
      console.log("Inner catch block:", innerError.message);
      return "Inner caught: " + innerError.message;
    }
  } catch (outerError) {
    console.log("Outer catch block:", outerError.message);
    return "Outer caught: " + outerError.message;
  }
}

// Try blocks that throw different types of errors
function typedErrors(errorType) {
  try {
    console.log("In try block with error type:", errorType);
    
    switch(errorType) {
      case "reference":
        nonExistentVariable.property; // ReferenceError
        break;
      case "type":
        null.toString(); // TypeError
        break;
      case "syntax":
        // We can't create a syntax error at runtime, so simulate it
        throw new SyntaxError("Simulated syntax error");
      case "range":
        throw new RangeError("Range error");
      case "none":
        return "No error thrown";
      default:
        throw new Error("Generic error");
    }
  } catch (error) {
    console.log("Caught", error.constructor.name + ":", error.message);
    return "Caught " + error.constructor.name;
  }
}

// Error propagation
function propagateError() {
  try {
    console.log("Trying to call a function that will throw");
    const result = innerErrorFunction();
    return "Should not reach here: " + result;
  } catch (error) {
    console.log("Caught propagated error:", error.message);
    return "Propagated error caught";
  }
}

function innerErrorFunction() {
  throw new Error("Error from inner function");
}

// Let's test these functions
try {
  // Import tracker
  const tracker = require('./coverage-tracker');
  
  // Run tests
  console.log("\n1. Testing simple try/catch:");
  console.log(simpleTryCatch(false)); // No error
  console.log(simpleTryCatch(true));  // With error
  
  console.log("\n2. Testing try/catch/finally:");
  console.log(tryCatchFinally(false)); // No error
  console.log(tryCatchFinally(true));  // With error
  
  console.log("\n3. Testing try/finally (no catch):");
  console.log(tryFinally(false)); // No error
  try {
    console.log(tryFinally(true));  // Will throw
  } catch (e) {
    console.log("Caught outside:", e.message);
  }
  
  console.log("\n4. Testing nested try/catch:");
  console.log(nestedTryCatch(1, false, false)); // No errors
  console.log(nestedTryCatch(2, true, false));  // Inner error
  console.log(nestedTryCatch(3, false, true));  // Outer error
  console.log(nestedTryCatch(4, true, true));   // Both errors (outer catches)
  
  console.log("\n5. Testing different error types:");
  console.log(typedErrors("none"));      // No error
  console.log(typedErrors("type"));      // TypeError
  console.log(typedErrors("syntax"));    // SyntaxError
  console.log(typedErrors("range"));     // RangeError
  try {
    console.log(typedErrors("reference")); // ReferenceError
  } catch (e) {
    console.log("Uncaught reference error (expected)");
  }
  
  console.log("\n6. Testing error propagation:");
  console.log(propagateError());
  
  // Report results
  console.log("\nCoverage Summary:");
  console.log(tracker.getSummary());
  
  console.log("\nDetailed Results:");
  console.dir(tracker.getResults(), { depth: null });
} catch (error) {
  console.error("Test execution error:", error);
}
