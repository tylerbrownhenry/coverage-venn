"use strict";
// @flow
// Simple Flow example with various type annotations
// Function with object parameter and return type
function getDisplayName(user) {
    return `${user.name} (${user.status})`;
}
// Array type
function getActiveUsers(users) {
    return users.filter(user => user.status === 'active');
}
// Generic type
function getFirstItem(items) {
    return items.length > 0 ? items[0] : null;
}
// Test data
const users = [
    { id: 'user1', name: 'Alice', age: 30, status: 'active' },
    { id: 'user2', name: 'Bob', age: 25, status: 'inactive' },
    { id: 'user3', name: 'Charlie', age: 35, status: 'active' },
];
// Test function calls
console.log('Active users:', getActiveUsers(users).length);
console.log('First user name:', getDisplayName(users[0]));
console.log('First active user:', getFirstItem(getActiveUsers(users))?.name);
