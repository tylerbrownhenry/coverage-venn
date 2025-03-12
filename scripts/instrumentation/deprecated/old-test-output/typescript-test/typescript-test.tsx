/**
 * Pure TypeScript Test File (No React)
 * 
 * This file tests various TypeScript features with our instrumentation plugin.
 */

// ====== TYPE DECLARATIONS (should be skipped by instrumentation) ======

// TypeScript interfaces 
interface User {
  id: number;
  name: string;
  isActive: boolean;
  metadata?: Record<string, unknown>;
}

// TypeScript type aliases
type UserRole = 'admin' | 'user' | 'guest';
type UserWithRole = User & { role: UserRole };

// TypeScript enums
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING'
}

// Generic type
type Result<T> = {
  data?: T;
  error?: string;
  status: 'success' | 'error' | 'loading';
};

// Type with indexed access and mapped types
type UserKeys = keyof User;
type Optional<T> = { [K in keyof T]?: T[K] };

// Utility type with conditional types
type NonNullableFields<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

// ====== FUNCTIONS WITH TYPE ANNOTATIONS ======

// Function with TypeScript parameter types and return type
function getUserStatus(user: User): Status {
  if (user.isActive) {
    return Status.Active;
  } else {
    return Status.Inactive;
  }
}

// Function with complex return type
function fetchUserData(id: number): Promise<Result<User>> {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      if (id > 0) {
        resolve({
          data: { id, name: `User ${id}`, isActive: Math.random() > 0.5 },
          status: 'success'
        });
      } else {
        resolve({
          error: 'Invalid user ID',
          status: 'error'
        });
      }
    }, 100);
  });
}

// Function with type parameters (generics)
function filterItems<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}

// Async function with TypeScript annotations
async function processUsers(users: User[]): Promise<Result<User[]>> {
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
    const activeUsers = filterItems<User>(
      processedUsers, 
      (user: User) => user.isActive === true
    );
    
    return {
      data: activeUsers,
      status: 'success'
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    };
  }
}

// Arrow function with type assertion
const getActiveUsers = (users: User[]): User[] => {
  return users.filter(user => user.isActive ? true : false);
};

// Function with conditional type expressions
function processUser(user: User): string | null {
  // Type assertion in conditional
  return (user as User).isActive ? user.name : null;
}

// Function with complex type manipulation
function transformUserData<T extends User>(
  user: T, 
  transformer: <K extends keyof T>(key: K, value: T[K]) => any
): Record<string, any> {
  const result: Record<string, any> = {};
  
  (Object.keys(user) as Array<keyof T>).forEach(key => {
    result[key as string] = transformer(key, user[key]);
  });
  
  return result;
}

// Type guards
function isActiveUser(user: any): user is User & { isActive: true } {
  return user && typeof user === 'object' && 'isActive' in user && user.isActive === true;
}

// Optional chaining with nullish coalescing
function getUserDisplayName(user?: User): string {
  return user?.name ?? 'Anonymous';
}

// Template literal types
type Alignment = 'left' | 'right' | 'center';
type VerticalAlignment = 'top' | 'middle' | 'bottom';
type Position = `${Alignment}-${VerticalAlignment}`;

function getPosition(alignment: Alignment, vAlignment: VerticalAlignment): Position {
  return `${alignment}-${vAlignment}`;
}

// Branded types for additional type safety
type UserId = number & { readonly __brand: unique symbol };

function createUserId(id: number): UserId {
  return id as UserId;
}

function getUserById(id: UserId): User | undefined {
  // Implementation
  return {
    id: id as number,
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
} catch (error) {
  console.error('Error in TypeScript test:', error);
}
