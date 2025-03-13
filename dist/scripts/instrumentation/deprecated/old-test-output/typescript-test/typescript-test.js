"use strict";
/**
 * Pure TypeScript Test File (No React)
 *
 * This file tests various TypeScript features with our instrumentation plugin.
 */
// TypeScript enums
var Status;
(function (Status) {
    Status["Active"] = "ACTIVE";
    Status["Inactive"] = "INACTIVE";
    Status["Pending"] = "PENDING";
})(Status || (Status = {}));
// ====== FUNCTIONS WITH TYPE ANNOTATIONS ======
// Function with TypeScript parameter types and return type
function getUserStatus(user) {
    if (user.isActive) {
        return Status.Active;
    }
    else {
        return Status.Inactive;
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
// Async function with TypeScript annotations
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
        const activeUsers = filterItems(processedUsers, (user) => user.isActive === true);
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
// Arrow function with type assertion
const getActiveUsers = (users) => {
    return users.filter(user => user.isActive ? true : false);
};
// Function with conditional type expressions
function processUser(user) {
    // Type assertion in conditional
    return user.isActive ? user.name : null;
}
// Function with complex type manipulation
function transformUserData(user, transformer) {
    const result = {};
    Object.keys(user).forEach(key => {
        result[key] = transformer(key, user[key]);
    });
    return result;
}
// Type guards
function isActiveUser(user) {
    return user && typeof user === 'object' && 'isActive' in user && user.isActive === true;
}
// Optional chaining with nullish coalescing
function getUserDisplayName(user) {
    return user?.name ?? 'Anonymous';
}
function getPosition(alignment, vAlignment) {
    return `${alignment}-${vAlignment}`;
}
function createUserId(id) {
    return id;
}
function getUserById(id) {
    // Implementation
    return {
        id: id,
        name: `User ${id}`,
        isActive: true
    };
}
// ====== EXECUTION CODE ======
// Run the test
try {
    console.log('Testing TypeScript instrumentation...');
    // Test regular functions
    const user = { id: 1, name: 'Test User', isActive: true };
    console.log('Getting user status:', getUserStatus(user));
    // Test generic function
    const numbers = [1, 2, 3, 4, 5];
    const evenNumbers = filterItems(numbers, n => n % 2 === 0);
    console.log('Filtered even numbers:', evenNumbers);
    // Test arrow function with type assertion
    const testUsers = [
        { id: 1, name: 'User 1', isActive: true },
        { id: 2, name: 'User 2', isActive: false }
    ];
    const active = getActiveUsers(testUsers);
    console.log('Active users:', active.length);
    // Test conditional type expressions
    const processedName = processUser(user);
    console.log('Processed user name:', processedName);
    // Test type guards
    if (isActiveUser(user)) {
        console.log('User is active:', user.name);
    }
    // Test optional chaining with nullish coalescing
    const undefinedUser = undefined;
    console.log('Display name with undefined user:', getUserDisplayName(undefinedUser));
    console.log('Display name with defined user:', getUserDisplayName(user));
    // Test template literal types
    const position = getPosition('left', 'top');
    console.log('Position:', position);
    // Test branded types
    const userId = createUserId(123);
    const foundUser = getUserById(userId);
    console.log('Found user:', foundUser?.name);
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
    console.log('TypeScript instrumentation test completed successfully!');
}
catch (error) {
    console.error('Error in TypeScript test:', error);
}
