"use strict";
// This is a simple Flow test file with basic types and components
// Type definitions
// Simple component with Flow types
function UserProfile(props) {
    const { user, onUpdate } = props;
    function handleActivation() {
        if (COVERAGE_TRACKER.trackBranch("23:4", "handleActivation", "if", user.isActive, "23:4")) {
            console.log(`${user.name} is already active`);
            return;
        }
        const updatedUser = {
            ...user,
            isActive: true
        };
        if (COVERAGE_TRACKER.trackBranch("33:4", "handleActivation", "if", onUpdate, "33:4")) {
            onUpdate(updatedUser);
        }
    }
    const displayName = user.name || 'Unknown User';
    // Conditional rendering
    const userStatus = COVERAGE_TRACKER.trackBranch("41:21", "UserProfile", "ternary", user.isActive, "41:21") ? 'Active User' : 'Inactive User';
    // Logical expressions
    const showAdminControls = user.age >= 18 && user.isActive;
    // Return JSX-like structure (simplified for the test)
    return {
        name: displayName,
        age: user.age,
        status: userStatus,
        adminControls: showAdminControls,
        activate: handleActivation
    };
}
// Test data
const testUser = {
    id: 1,
    name: 'John Doe',
    age: 30,
    isActive: false
};
// Update callback
function updateUser(updatedUser) {
    console.log(`User updated: ${updatedUser.name} (${COVERAGE_TRACKER.trackBranch("68:52", "updateUser", "ternary", updatedUser.isActive, "68:52") ? 'active' : 'inactive'})`);
}
// Use the component
const profile = UserProfile({
    user: testUser,
    onUpdate: updateUser
});
// Call the activation method
profile.activate();
console.log(`User ${profile.name} is ${profile.status}`);
