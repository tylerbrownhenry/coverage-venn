"use strict";
// @flow
number,
    name;
string,
    isActive;
boolean
    | ;
;
// ====== FUNCTIONS WITH TYPE ANNOTATIONS ======
// Function with Flow parameter types and return type
function getUserStatus(user) {
    if (user.isActive) {
        return 'Active';
    }
    else {
        return 'Inactive';
    }
}
// Function with complex return type
function fetchUserData(id) {
    return new Promise((resolve) => {
        // Simulate API call
        setTimeout(() => {
            if (id > 0) {
                resolve({
                    data: { id, name: `User ${id}`, isActive: Math.random() > 0.5 },
                    status: 'success'
                });
            }
            else {
                resolve({
                    error: 'Invalid user ID',
                    status: 'error'
                });
            }
        }, 100);
    });
}
// Function with type parameters (generics)
function filterItems(items, predicate) {
    return items.filter(predicate);
}
// Async function with Flow annotations
async function processUsers(users) {
    try {
        // Process each user with some conditional logic
        const processedUsers = users.map(user => {
            // Ternary with type annotations
            const metadata = user.metadata ? { ...user.metadata, processed: true } : { processed: true };
            return {
                ...user,
                metadata
            };
        });
        // Use filter with type parameter
        const activeUsers = filterItems < User > (processedUsers,
            (user) => user.isActive === true);
        return {
            data: activeUsers,
            status: 'success'
        };
    }
    catch (error) {
        return {
            error: error instanceof Error ? error.message : 'Unknown error',
            status: 'error'
        };
    }
}
// Arrow function with type cast
const getActiveUsers = (users) => {
    return users.filter(user => (user) => , isActive ? true : false);
};
// Function with conditional type expressions
function processUser(user) {
    // Type cast in conditional
    return (user) => ;
    isActive ? user.name : null;
}
 > (key);
K, value;
any;
any;
{
    [string];
    any;
}
{
    const result = {};
    Object.keys(user).forEach(key => {
        result[key] = transformer(key, user[key]);
    });
    return result;
}
 % checks;
{
    return !!user && typeof user === 'object' && 'isActive' in user && user.isActive === true;
}
// Optional chaining simulation with Maybe types
function getUserDisplayName(user) {
    return user && user.name ? user.name : 'Anonymous';
}
// Higher-order function with Flow types
function createLogger(prefix) {
    return (data) => {
        console.log(`${prefix}:`, data);
    };
}
// ====== EXECUTION CODE ======
// Run the test
try {
    console.log('Testing Flow instrumentation...');
    // Test regular functions
    const user = { id: 1, name: 'Test User', isActive: true };
    console.log('Getting user status:', getUserStatus(user));
    // Test generic function
    const numbers = [1, 2, 3, 4, 5];
    const evenNumbers = filterItems(numbers, n => n % 2 === 0);
    console.log('Filtered even numbers:', evenNumbers);
    // Test arrow function with type cast
    const testUsers = [
        { id: 1, name: 'User 1', isActive: true },
        { id: 2, name: 'User 2', isActive: false }
    ];
    const active = getActiveUsers(testUsers);
    console.log('Active users:', active.length);
    // Test conditional type expressions
    const processedName = processUser(user);
    console.log('Processed user name:', processedName);
    // Test type predicate
    if (isActiveUser(user)) {
        console.log('User is active:', user.name);
    }
    // Test optional chaining simulation
    const undefinedUser = undefined;
    console.log('Display name with undefined user:', getUserDisplayName(undefinedUser));
    console.log('Display name with defined user:', getUserDisplayName(user));
    // Test higher-order function
    const logUser = createLogger('USER');
    logUser(user);
    // Test async function
    console.log('Processing users (async)...');
    processUsers(testUsers)
        .then(result => {
        console.log('Processed users result:', result.status);
        if (result.data) {
            console.log('Active users after processing:', result.data.length);
        }
    })
        .catch(err => console.error('Error processing users:', err));
    console.log('Flow instrumentation test completed successfully!');
}
catch (error) {
    console.error('Error in Flow test:', error);
}
