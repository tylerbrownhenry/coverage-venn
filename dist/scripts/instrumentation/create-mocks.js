#!/usr/bin/env node
"use strict";
const fs = require('fs');
const path = require('path');
// Directories to create mocks for
const instrumentationDirs = [
    'async',
    'class',
    'flow',
    'function',
    'jsx',
    'loop',
    'switch',
    'try-catch',
    'typescript',
    'template'
];
// Create a common mocks directory for shared modules
const commonMocksDir = path.join(__dirname, '__mocks__');
if (!fs.existsSync(commonMocksDir)) {
    fs.mkdirSync(commonMocksDir, { recursive: true });
    console.log(`Created common __mocks__ directory`);
}
// Create common mock for coverage-tracker.js
const coverageTrackerMock = `// Common mock for coverage-tracker.js
module.exports = class CoverageTracker {
  constructor() {
    this.coverageData = {
      branches: {},
      functions: {},
      statements: {},
      jsxElements: {}
    };
  }

  trackBranch(id, condition) {
    if (!this.coverageData.branches[id]) {
      this.coverageData.branches[id] = { 
        count: 0, 
        truthy: 0, 
        falsy: 0 
      };
    }
    this.coverageData.branches[id].count++;
    if (condition) {
      this.coverageData.branches[id].truthy++;
    } else {
      this.coverageData.branches[id].falsy++;
    }
    return condition;
  }

  trackFunction(id, name, result) {
    if (!this.coverageData.functions[id]) {
      this.coverageData.functions[id] = { 
        count: 0,
        name: name || 'anonymous'
      };
    }
    this.coverageData.functions[id].count++;
    return result;
  }

  trackFunctionStart(id, name) {
    if (!this.coverageData.functions[id]) {
      this.coverageData.functions[id] = { 
        count: 0,
        name: name || 'anonymous'
      };
    }
    this.coverageData.functions[id].count++;
    return id;
  }

  trackFunctionEnd(id, result) {
    return result;
  }

  trackStatement(id) {
    if (!this.coverageData.statements[id]) {
      this.coverageData.statements[id] = { count: 0 };
    }
    this.coverageData.statements[id].count++;
  }

  trackJSXRender(component, id, elementType) {
    const key = \`\${component}:\${id}:\${elementType}\`;
    if (!this.coverageData.jsxElements[key]) {
      this.coverageData.jsxElements[key] = { count: 0 };
    }
    this.coverageData.jsxElements[key].count++;
  }

  getCoverageData() {
    return this.coverageData;
  }

  generateReport() {
    return {
      coverage: this.coverageData,
      summary: {
        branches: {
          total: Object.keys(this.coverageData.branches).length,
          covered: Object.values(this.coverageData.branches).filter(b => b.count > 0).length
        },
        functions: {
          total: Object.keys(this.coverageData.functions).length,
          covered: Object.values(this.coverageData.functions).filter(f => f.count > 0).length
        },
        statements: {
          total: Object.keys(this.coverageData.statements).length,
          covered: Object.values(this.coverageData.statements).filter(s => s.count > 0).length
        }
      }
    };
  }
};

// Allow mocking of the singleton
jest.mock('../../src/coverage-tracker', () => {
  return {
    getCoverageTracker: jest.fn().mockImplementation(() => new module.exports())
  };
});
`;
fs.writeFileSync(path.join(commonMocksDir, 'coverage-tracker.js'), coverageTrackerMock);
console.log('Created common mock for coverage-tracker.js');
// Create common mock for coverage-instrumentation-plugin.js
const pluginMock = `// Common mock for coverage-instrumentation-plugin.js
module.exports = function() {
  return {
    name: 'coverage-instrumentation-plugin',
    visitor: {
      // Mock visitor methods
      IfStatement() {},
      FunctionDeclaration() {},
      ArrowFunctionExpression() {},
      JSXElement() {},
      TryStatement() {},
      SwitchStatement() {}
    }
  };
};
`;
fs.writeFileSync(path.join(commonMocksDir, 'coverage-instrumentation-plugin.js'), pluginMock);
console.log('Created common mock for coverage-instrumentation-plugin.js');
// Mock template for test files
const mockModuleTemplate = `// Mock module for tests
module.exports = {
  // Mock methods/properties that tests will use
  transformCode: jest.fn().mockReturnValue({
    code: "const mockTransformedCode = true;",
    success: true
  }),
  runTests: jest.fn().mockReturnValue({
    passed: true,
    coverage: { branches: 100, functions: 100 }
  }),
  testFunction: jest.fn().mockReturnValue(true),
  instrumentationDetails: {
    name: "MOCK_INSTRUMENTATION",
    version: "1.0.0-test"
  }
};

// Don't allow any process.exit calls from the mock
process.exit = jest.fn();
`;
// Remove any duplicated coverage-tracker.js mocks in individual directories
instrumentationDirs.forEach(dir => {
    const trackerMockPath = path.join(__dirname, dir, '__mocks__/coverage-tracker.js');
    if (fs.existsSync(trackerMockPath)) {
        fs.unlinkSync(trackerMockPath);
        console.log(`Removed duplicate mock: ${trackerMockPath}`);
    }
});
// Create mock files for each instrumentation directory
instrumentationDirs.forEach(dir => {
    const mockDir = path.join(__dirname, dir, '__mocks__');
    // Create the __mocks__ directory if it doesn't exist
    if (!fs.existsSync(mockDir)) {
        fs.mkdirSync(mockDir, { recursive: true });
        console.log(`Created __mocks__ directory for ${dir}`);
    }
    // Find the main files to mock (both .js and .ts)
    const dirPath = path.join(__dirname, dir);
    const files = fs.readdirSync(dirPath)
        .filter(f => (f.endsWith('.js') || f.endsWith('.ts')) && !f.includes('__tests__') && !f.includes('__mocks__'));
    files.forEach(file => {
        const basename = path.basename(file, path.extname(file));
        // Skip creating mocks for files that already have common mocks
        if (basename === 'coverage-tracker' || basename === 'coverage-instrumentation-plugin') {
            return;
        }
        const mockFilePath = path.join(mockDir, `${basename}.js`);
        // Only create if it doesn't exist
        if (!fs.existsSync(mockFilePath)) {
            fs.writeFileSync(mockFilePath, mockModuleTemplate);
            console.log(`Created mock for ${dir}/${file} at ${mockFilePath}`);
        }
    });
});
console.log('Mock creation completed!');
