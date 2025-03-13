"use strict";
// This is the minimal Flow test file with just basic types
// Type definition
// Function with type annotations
function greetUser(user) {
    if (COVERAGE_TRACKER.trackBranch("13:2", "greetUser", "if", user.age > 18, "13:2")) {
        return `Hello, ${user.name}!`;
    }
    else {
        return `Hi there, ${user.name}!`;
    }
}
// Simple variable with type
const defaultUser = {
    name: 'Guest',
    age: 25
};
// Call the function
const greeting = greetUser(defaultUser);
console.log(greeting);
