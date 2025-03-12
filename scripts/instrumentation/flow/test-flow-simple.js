/**
 * Simplified test script for Flow instrumentation
 * 
 * This is a more focused test that only uses the basic Flow features
 * to verify the instrumentation plugin works correctly.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const babel = require('@babel/core');

// Constants for test configuration
const testDir = path.resolve(__dirname, 'temp');
const sourceFile = path.resolve(testDir, 'flow-simple-test.js');
const instrumentedFile = path.resolve(testDir, 'instrumented-flow-simple-test.js');
const coverageTrackerFile = path.resolve(testDir, 'coverage-tracker.js');

console.log('Setting up Flow instrumentation simple test...');
console.log(`Test directory: ${testDir}`);

// Ensure the test directory exists
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

// Create coverage tracker file
const coverageTrackerContent = `
// Simple coverage tracker
global.COVERAGE_TRACKER = {
  coverageData: {
    branches: {},
    functions: {},
    types: {}
  },
  
  trackBranch(component, id, type, condition) {
    const key = \`\${component}:\${id}:\${type}\`;
    if (!this.coverageData.branches[key]) {
      this.coverageData.branches[key] = { count: 0, conditions: [] };
    }
    
    this.coverageData.branches[key].count++;
    this.coverageData.branches[key].conditions.push(condition);
    
    console.log(\`Branch \${type} in \${component} (id: \${id}) evaluated to \${condition}\`);
    return condition;
  },
  
  trackFunction(component, id, name) {
    const key = \`\${component}:\${id}:\${name}\`;
    if (!this.coverageData.functions[key]) {
      this.coverageData.functions[key] = { count: 0 };
    }
    
    this.coverageData.functions[key].count++;
    console.log(\`Function \${name} in \${component} (id: \${id}) called\`);
    return true;
  },
  
  trackType(component, typeId, typeName) {
    const key = \`\${component}:\${typeId}:\${typeName}\`;
    if (!this.coverageData.types[key]) {
      this.coverageData.types[key] = { count: 1 };
    } else {
      this.coverageData.types[key].count++;
    }
    
    console.log(\`Type \${typeName} in \${component} (id: \${typeId}) used\`);
    return true;
  },
  
  getReport() {
    return this.coverageData;
  }
};

module.exports = global.COVERAGE_TRACKER;
`;

fs.writeFileSync(coverageTrackerFile, coverageTrackerContent);
console.log(`Created coverage tracker at: ${coverageTrackerFile}`);

// Create simple Flow test file
const flowTestContent = `
// @flow
// Simple Flow test file

// Type definitions
type User = {
  id: string,
  name: string,
  age: number,
  isActive: boolean
};

// Function with Flow types
function getUserDisplayName(user: User): string {
  if (!user.name) {
    return 'Unknown User';
  }
  
  const displayName = \`\${user.name} (\${user.age})\`;
  return user.isActive ? displayName + ' [Active]' : displayName;
}

// Generic function
function getFirstItem<T>(items: Array<T>): ?T {
  return items.length > 0 ? items[0] : null;
}

// Test data
const users: Array<User> = [
  { id: '1', name: 'Alice', age: 30, isActive: true },
  { id: '2', name: 'Bob', age: 45, isActive: false },
  { id: '3', name: 'Charlie', age: 25, isActive: true }
];

// Test function calls
console.log('Users:');
users.forEach(user => {
  console.log('- ' + getUserDisplayName(user));
});

const firstUser = getFirstItem(users);
if (firstUser) {
  console.log('\\nFirst user:', firstUser.name);
}

// Filter active users
const activeUsers = users.filter(user => user.isActive);
console.log('\\nActive users:', activeUsers.length);

console.log('\\nFlow test completed successfully!');
`;

fs.writeFileSync(sourceFile, flowTestContent);
console.log(`Created Flow test file at: ${sourceFile}`);

// Transform with Babel
try {
  console.log('Instrumenting Flow code with Babel plugin...');
  
  const result = babel.transformFileSync(sourceFile, {
    presets: [
      '@babel/preset-flow'
    ],
    plugins: [
      path.resolve(__dirname, 'flow-support-plugin.js')
    ],
    filename: path.basename(sourceFile)
  });

  if (result && result.code) {
    // Add coverage tracker import
    const instrumentedCode = `
// Import coverage tracker
require('./coverage-tracker');

${result.code}
    `;
    
    fs.writeFileSync(instrumentedFile, instrumentedCode);
    console.log(`Instrumented code written to: ${instrumentedFile}`);
  } else {
    console.error('Failed to transform Flow code');
    process.exit(1);
  }
} catch (error) {
  console.error('Error during Babel transformation:', error);
  process.exit(1);
}

// Execute the instrumented file
console.log('\nRunning instrumented Flow code...');
try {
  execSync(`node ${instrumentedFile}`, { 
    stdio: 'inherit',
    timeout: 5000 // 5 seconds timeout
  });
} catch (error) {
  console.error('Error executing instrumented code:', error);
  process.exit(1);
}

console.log('\nFlow instrumentation simple test completed successfully!'); 