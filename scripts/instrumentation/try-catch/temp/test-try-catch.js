
// Test functions to be used with try-catch

// Function that works normally
function divide(a, b) {
  return a / b;
}

// Function that throws an error
function validatePositive(num) {
  if (num <= 0) {
    throw new Error('Number must be positive');
  }
  return num;
}

// Function that might throw different errors
function processData(data) {
  if (!data) {
    throw new TypeError('Data is required');
  }
  
  if (!Array.isArray(data)) {
    throw new Error('Data must be an array');
  }
  
  if (data.length === 0) {
    throw new RangeError('Data array cannot be empty');
  }
  
  return data.map(item => item * 2);
}

// Function with nested try-catch
function nestedTryCatch(value) {
  try {
    console.log('Outer try block');
    try {
      console.log('Inner try block');
      if (value < 0) {
        throw new Error('Negative value in inner block');
      }
      return 'Inner success';
    } catch (innerError) {
      console.log('Inner catch block');
      throw new Error(`Inner error caught: ${innerError.message}`);
    } finally {
      console.log('Inner finally block');
    }
  } catch (outerError) {
    console.log('Outer catch block');
    return `Outer error caught: ${outerError.message}`;
  } finally {
    console.log('Outer finally block');
  }
}

// Function where finally returns
function finallyReturn() {
  try {
    console.log('Try block in finallyReturn');
    return 'Return from try';
  } catch (error) {
    console.log('Catch block in finallyReturn');
    return 'Return from catch';
  } finally {
    console.log('Finally block in finallyReturn');
    // Note: This return will override any returns from try or catch
    return 'Return from finally';
  }
}

// Function with try without catch (only finally)
function tryWithoutCatch() {
  try {
    console.log('Try block without catch');
    return 'Success';
  } finally {
    console.log('Finally block without catch');
  }
}

// Function that rethrows an error
function rethrowError(shouldThrow) {
  try {
    if (shouldThrow) {
      throw new Error('Original error');
    }
    return 'No error';
  } catch (error) {
    console.log('Caught error, but rethrowing');
    throw new Error(`Rethrown: ${error.message}`);
  }
}

// Function with catch that does conditional handling
function conditionalCatch(input) {
  try {
    if (typeof input !== 'number') {
      throw new TypeError('Input must be a number');
    }
    if (input < 0) {
      throw new RangeError('Input must be non-negative');
    }
    return Math.sqrt(input);
  } catch (error) {
    if (error instanceof TypeError) {
      console.log('Type error handled specifically');
      return 'Invalid type';
    } else if (error instanceof RangeError) {
      console.log('Range error handled specifically');
      return 'Invalid range';
    } else {
      console.log('Unknown error');
      throw error; // Rethrow unknown errors
    }
  }
}

// Async function with try-catch
async function asyncTryCatch() {
  try {
    console.log('Async try block');
    const result = await Promise.resolve(42);
    return result;
  } catch (error) {
    console.log('Async catch block');
    return 0;
  } finally {
    console.log('Async finally block');
  }
}

// Testing success cases
console.log('\nTesting successful operations:');
try {
  console.log('Division result:', divide(10, 2));
} catch (error) {
  console.log('Error caught:', error.message);
}

try {
  console.log('Validation result:', validatePositive(5));
} catch (error) {
  console.log('Error caught:', error.message);
}

try {
  console.log('Process data result:', processData([1, 2, 3]));
} catch (error) {
  console.log('Error caught:', error.message);
}

// Testing error cases
console.log('\nTesting error conditions:');
try {
  console.log('Division by zero:', divide(10, 0));
} catch (error) {
  console.log('Error caught:', error.message);
}

try {
  console.log('Validation of negative:', validatePositive(-5));
} catch (error) {
  console.log('Error caught:', error.message);
}

try {
  console.log('Process null data:', processData(null));
} catch (error) {
  console.log('Error caught:', error.message);
}

try {
  console.log('Process non-array data:', processData('string'));
} catch (error) {
  console.log('Error caught:', error.message);
}

try {
  console.log('Process empty array:', processData([]));
} catch (error) {
  console.log('Error caught:', error.message);
}

// Testing nested try-catch
console.log('\nTesting nested try-catch:');
console.log('Nested try-catch with positive value:', nestedTryCatch(5));
console.log('Nested try-catch with negative value:', nestedTryCatch(-5));

// Testing finally behavior
console.log('\nTesting finally behavior:');
console.log('Finally return result:', finallyReturn());
console.log('Try without catch result:', tryWithoutCatch());

// Testing rethrow
console.log('\nTesting error rethrowing:');
try {
  console.log('Should not throw:', rethrowError(false));
} catch (error) {
  console.log('Caught rethrown error:', error.message);
}

try {
  console.log('Should throw:', rethrowError(true));
} catch (error) {
  console.log('Caught rethrown error:', error.message);
}

// Testing conditional catch
console.log('\nTesting conditional catch:');
console.log('Conditional catch with valid input:', conditionalCatch(16));
console.log('Conditional catch with negative input:', conditionalCatch(-4));
console.log('Conditional catch with string input:', conditionalCatch('test'));

// Testing async try-catch
console.log('\nTesting async try-catch:');
asyncTryCatch().then(result => console.log('Async result:', result));

// Get the coverage report
const coverageTracker = require('./coverage-tracker');
setTimeout(() => {
  coverageTracker.printReport();
}, 100); // Short delay to ensure async operations complete
