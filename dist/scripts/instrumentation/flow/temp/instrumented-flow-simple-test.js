"use strict";
// Import coverage tracker
require('./coverage-tracker');
// Simple Flow test file
// Type definitions
// Function with Flow types
function getUserDisplayName(user) {
    if (COVERAGE_TRACKER.trackBranch("15:2", "getUserDisplayName", "if", !user.name, "15:2")) {
        return 'Unknown User';
    }
    const displayName = `${user.name} (${user.age})`;
    return COVERAGE_TRACKER.trackBranch("20:9", "getUserDisplayName", "ternary", user.isActive, "20:9") ? displayName + ' [Active]' : displayName;
}
// Generic function
function getFirstItem(items) {
    return COVERAGE_TRACKER.trackBranch("25:9", "getFirstItem", "ternary", items.length > 0, "25:9") ? items[0] : null;
}
// Test data
const users = [{
        id: '1',
        name: 'Alice',
        age: 30,
        isActive: true
    }, {
        id: '2',
        name: 'Bob',
        age: 45,
        isActive: false
    }, {
        id: '3',
        name: 'Charlie',
        age: 25,
        isActive: true
    }];
// Test function calls
console.log('Users:');
users.forEach(user => {
    console.log('- ' + getUserDisplayName(user));
});
const firstUser = getFirstItem(users);
if (COVERAGE_TRACKER.trackBranch("42:0", "flow-simple-test", "if", firstUser, "42:0")) {
    console.log('\nFirst user:', firstUser.name);
}
// Filter active users
const activeUsers = users.filter(user => user.isActive);
console.log('\nActive users:', activeUsers.length);
console.log('\nFlow test completed successfully!');
