
// @flow
// This is a simple Flow test file with basic types and components

// Type definitions
type User = {
  id: number,
  name: string,
  age: number,
  isActive: boolean
};

type Props = {
  user: User,
  onUpdate?: (user: User) => void
};

// Simple component with Flow types
function UserProfile(props: Props) {
  const { user, onUpdate } = props;
  
  function handleActivation() {
    if (user.isActive) {
      console.log(`${user.name} is already active`);
      return;
    }
    
    const updatedUser = {
      ...user,
      isActive: true
    };
    
    if (onUpdate) {
      onUpdate(updatedUser);
    }
  }
  
  const displayName = user.name || 'Unknown User';
  
  // Conditional rendering
  const userStatus = user.isActive 
    ? 'Active User' 
    : 'Inactive User';
  
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
const testUser: User = {
  id: 1,
  name: 'John Doe',
  age: 30,
  isActive: false
};

// Update callback
function updateUser(updatedUser: User) {
  console.log(`User updated: ${updatedUser.name} (${updatedUser.isActive ? 'active' : 'inactive'})`);
}

// Use the component
const profile = UserProfile({
  user: testUser,
  onUpdate: updateUser
});

// Call the activation method
profile.activate();

console.log(`User ${profile.name} is ${profile.status}`);
