"use strict";
// ------------------------------------
// Standard function declarations
// ------------------------------------
// Named function declaration
function add(a, b) {
    return a + b;
}
// Function with multiple parameters and default values
function greet(name, greeting = "Hello") {
    return `${greeting}, ${name}!`;
}
// Function with rest parameters
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}
// Function with destructuring
function processUser({ name, age }) {
    return `${name} is ${age} years old.`;
}
// Nested function
function outer(x) {
    function inner(y) {
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
    const title = "Mr.";
    return `${title} ${first} ${last}`;
};
// Arrow function with implicit return of object
const createPerson = (name, age) => ({ name, age });
// ------------------------------------
// Function expressions
// ------------------------------------
// Named function expression
const factorial = function fact(n) {
    if (n <= 1)
        return 1;
    return n * fact(n - 1);
};
// Anonymous function expression
const divide = function (a, b) {
    if (b === 0)
        throw new Error("Cannot divide by zero");
    return a / b;
};
// IIFE (Immediately Invoked Function Expression)
const result = (function () {
    const x = 10;
    const y = 20;
    return x + y;
})();
// Function as callback
[1, 2, 3].map(function (num) {
    return num * 2;
});
// Function with internal function calls
function processData(data) {
    function validate(item) {
        return item !== null && item !== undefined;
    }
    function transform(item) {
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
console.log("processUser({ name: 'John', age: 30 }):", processUser({ name: 'John', age: 30 }));
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
