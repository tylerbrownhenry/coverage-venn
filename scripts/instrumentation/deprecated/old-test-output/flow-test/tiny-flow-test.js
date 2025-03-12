
// @flow
// This is the minimal Flow test file with just basic types

// Type definition
type User = {
  name: string,
  age: number
};

// Function with type annotations
function greetUser(user: User): string {
  if (user.age > 18) {
    return `Hello, ${user.name}!`;
  } else {
    return `Hi there, ${user.name}!`;
  }
}

// Simple variable with type
const defaultUser: User = {
  name: 'Guest',
  age: 25
};

// Call the function
const greeting = greetUser(defaultUser);
console.log(greeting);
