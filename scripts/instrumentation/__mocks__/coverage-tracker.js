// Common mock for coverage-tracker.js
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
    const key = `${component}:${id}:${elementType}`;
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
