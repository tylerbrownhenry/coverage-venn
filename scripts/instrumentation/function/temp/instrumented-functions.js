
          // Import the coverage tracker
          const COVERAGE_TRACKER = require('./coverage-tracker');
          
          // ------------------------------------
// Standard function declarations
// ------------------------------------

// Named function declaration
function add(a, b) {
  console.log("Function Called:", "func_add_7_6");
  return a + b;
}

// Function with multiple parameters and default values
function greet(name, greeting = "Hello") {
  console.log("Function Called:", "func_greet_12_6");
  return `${greeting}, ${name}!`;
}

// Function with rest parameters
function sum(...numbers) {
  console.log("Function Called:", "func_sum_17_6");
  return numbers.reduce((total, num) => total + num, 0);
}

// Function with destructuring
function processUser({
  name,
  age
}) {
  console.log("Function Called:", "func_processUser_22_6");
  return `${name} is ${age} years old.`;
}

// Nested function
function outer(x) {
  console.log("Function Called:", "func_outer_27_6");
  function inner(y) {
    console.log("Function Called:", "func_inner_28_8");
    return x + y;
  }
  return inner(10);
}

// ------------------------------------
// Arrow functions
// ------------------------------------

// Basic arrow function
const multiply = (a, b) => a * b;

// Arrow function with block body
const getFullName = (first, last) => {
  console.log("Function Called:", "func_anonymous_42_26");
  const title = "Mr.";
  return `${title} ${first} ${last}`;
};

// Arrow function with implicit return of object
const createPerson = (name, age) => ({
  name,
  age
});

// ------------------------------------
// Function expressions
// ------------------------------------

// Named function expression
const factorial = function fact(n) {
  console.log("Function Called:", "func_fact_55_24");
  if (function () {
    console.log("Function Called:", "szx4pbnu6");
    const result = n <= 1;
    console.log("Branch:", "branch_56_8", result ? "truthy" : "falsy");
    return result;
  }()) return 1;
  return n * fact(n - 1);
};

// Anonymous function expression
const divide = function (a, b) {
  console.log("Function Called:", "func_anonymous_61_21");
  if (function () {
    console.log("Function Called:", "28gka1euh");
    const result = b === 0;
    console.log("Branch:", "branch_62_8", result ? "truthy" : "falsy");
    return result;
  }()) throw new Error("Cannot divide by zero");
  return a / b;
};

// IIFE (Immediately Invoked Function Expression)
const result = function () {
  console.log("Function Called:", "func_anonymous_67_22");
  const x = 10;
  const y = 20;
  return x + y;
}();

// Function as callback
[1, 2, 3].map(function (num) {
  console.log("Function Called:", "func_anonymous_74_20");
  return num * 2;
});

// Function with internal function calls
function processData(data) {
  console.log("Function Called:", "func_processData_79_6");
  function validate(item) {
    console.log("Function Called:", "func_validate_80_8");
    return item !== null && item !== undefined;
  }
  function transform(item) {
    console.log("Function Called:", "func_transform_84_8");
    return item * 2;
  }
  return data.filter(validate).map(transform);
}

// ------------------------------------
// Test calls
// ------------------------------------

console.log("Testing function instrumentation:");
console.log("---------------------------------");
console.log("add(5, 3):", add(5, 3));
console.log("greet('World'):", greet('World'));
console.log("greet('Universe', 'Greetings'):", greet('Universe', 'Greetings'));
console.log("sum(1, 2, 3, 4, 5):", sum(1, 2, 3, 4, 5));
console.log("processUser({ name: 'John', age: 30 }):", processUser({
  name: 'John',
  age: 30
}));
console.log("outer(5):", outer(5));
console.log("multiply(4, 6):", multiply(4, 6));
console.log("getFullName('John', 'Doe'):", getFullName('John', 'Doe'));
console.log("createPerson('Alice', 25):", createPerson('Alice', 25));
console.log("factorial(5):", factorial(5));
console.log("divide(10, 2):", divide(10, 2));
console.log("result:", result);
console.log("processData([1, 2, null, 3]):", processData([1, 2, null, 3]));
console.log("---------------------------------");
console.log("Function instrumentation test completed");
        