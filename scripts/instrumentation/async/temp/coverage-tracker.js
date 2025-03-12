// Global coverage tracker for async function instrumentation
const fs = require('fs');
const path = require('path');

// File to store coverage data
const COVERAGE_FILE = path.resolve(__dirname, 'async-coverage-data.json');

// Create or load initial coverage data
let initialData = {
  branches: {},
  jsxElements: {},
  functions: {},
  asyncFunctions: {},
  promises: {},
  tryCatch: {}
};

// Try to load existing data
try {
  if (fs.existsSync(COVERAGE_FILE)) {
    initialData = JSON.parse(fs.readFileSync(COVERAGE_FILE, 'utf8'));
    console.log('Loaded existing coverage data');
  }
} catch (error) {
  console.error('Error loading coverage data:', error);
}

global.COVERAGE_TRACKER = {
  coverageData: initialData,
  
  _activePromises: new Map(),
  
  // Save coverage data to file
  _saveCoverageData() {
    try {
      fs.writeFileSync(COVERAGE_FILE, JSON.stringify(this.coverageData, null, 2));
    } catch (error) {
      console.error('Error saving coverage data:', error);
    }
  },
  
  // Debugging helper
  _logStorage(method, key, data) {
    console.log(`[STORAGE] ${method} storing data for key: ${key}`);
    console.log(`[STORAGE] Before: ${JSON.stringify(Object.keys(data))}`);
    
    // Save after update
    setTimeout(() => {
      console.log(`[STORAGE] After: ${JSON.stringify(Object.keys(data))}`);
      this._saveCoverageData();
    }, 0);
  },
  
  trackBranch(component, id, type, outcome) {
    const key = `${component}:${id}:${type}`;
    if (!this.coverageData.branches[key]) {
      this.coverageData.branches[key] = { count: 0, outcomes: {} };
    }
    
    this.coverageData.branches[key].count++;
    
    const outcomeKey = outcome.toString();
    if (!this.coverageData.branches[key].outcomes[outcomeKey]) {
      this.coverageData.branches[key].outcomes[outcomeKey] = 0;
    }
    
    this.coverageData.branches[key].outcomes[outcomeKey]++;
    this._saveCoverageData();
    
    console.log(`Branch ${id} in ${component} (${type}) took path ${outcome}`);
    return outcome; // Return to not interfere with code logic
  },
  
  trackJSXRender(component, id, elementType) {
    const key = `${component}:${id}:${elementType}`;
    if (!this.coverageData.jsxElements[key]) {
      this.coverageData.jsxElements[key] = { count: 0 };
    }
    
    this.coverageData.jsxElements[key].count++;
    this._saveCoverageData();
    
    console.log(`JSX ${elementType} (${id}) in ${component} rendered`);
    return true; // Return a value to not break the code flow
  },
  
  trackFunctionStart(component, name, id) {
    const key = `${component}:${name}:${id}`;
    if (!this.coverageData.functions[key]) {
      this.coverageData.functions[key] = { 
        count: 0,
        completed: 0,
        errors: 0,
        isAsync: false
      };
    }
    
    this.coverageData.functions[key].count++;
    this._saveCoverageData();
    
    console.log(`Function ${name} (${id}) in ${component} started`);
  },
  
  trackFunctionEnd(component, name, id) {
    const key = `${component}:${name}:${id}`;
    if (this.coverageData.functions[key]) {
      this.coverageData.functions[key].completed++;
      this._saveCoverageData();
    }
    console.log(`Function ${name} (${id}) in ${component} ended`);
  },
  
  trackFunctionError(component, name, id) {
    const key = `${component}:${name}:${id}`;
    if (this.coverageData.functions[key]) {
      this.coverageData.functions[key].errors++;
      this._saveCoverageData();
    }
    console.log(`Function ${name} (${id}) in ${component} threw error`);
  },
  
  // New methods for async tracking
  
  trackAsyncFunctionStart(component, name, id) {
    const key = `${component}:${name}:${id}`;
    console.log(`[TRACKING] trackAsyncFunctionStart for ${key}`);
    
    if (!this.coverageData.asyncFunctions[key]) {
      this.coverageData.asyncFunctions[key] = { 
        started: 0,
        resolved: 0,
        rejected: 0,
        awaitPoints: 0
      };
      this._logStorage('trackAsyncFunctionStart', key, this.coverageData.asyncFunctions);
    } else {
      this.coverageData.asyncFunctions[key].started++;
      this._saveCoverageData();
    }
    
    console.log(`Async function ${name} (${id}) in ${component} started`);
    
    // Mark regular function as async too
    if (this.coverageData.functions[key]) {
      this.coverageData.functions[key].isAsync = true;
      this._saveCoverageData();
    }
  },
  
  trackAsyncFunctionResolved(component, name, id, result) {
    const key = `${component}:${name}:${id}`;
    console.log(`[TRACKING] trackAsyncFunctionResolved for ${key}`);
    
    if (!this.coverageData.asyncFunctions[key]) {
      this.coverageData.asyncFunctions[key] = { 
        started: 1,
        resolved: 0,
        rejected: 0,
        awaitPoints: 0
      };
      this._logStorage('trackAsyncFunctionResolved', key, this.coverageData.asyncFunctions);
    } else {
      this.coverageData.asyncFunctions[key].resolved++;
      this._saveCoverageData();
    }
    
    console.log(`Async function ${name} (${id}) in ${component} resolved`);
    return result; // Return the result to not interfere with the normal flow
  },
  
  trackAsyncFunctionRejected(component, name, id, error) {
    const key = `${component}:${name}:${id}`;
    console.log(`[TRACKING] trackAsyncFunctionRejected for ${key}`);
    
    if (!this.coverageData.asyncFunctions[key]) {
      this.coverageData.asyncFunctions[key] = { 
        started: 1,
        resolved: 0,
        rejected: 0,
        awaitPoints: 0
      };
      this._logStorage('trackAsyncFunctionRejected', key, this.coverageData.asyncFunctions);
    } else {
      this.coverageData.asyncFunctions[key].rejected++;
      this._saveCoverageData();
    }
    
    console.log(`Async function ${name} (${id}) in ${component} rejected with error`);
    throw error; // Re-throw the error to maintain normal error propagation
  },
  
  trackAwaitPoint(component, name, id, location) {
    const key = `${component}:${name}:${id}`;
    console.log(`[TRACKING] trackAwaitPoint for ${key} at ${location}`);
    
    if (!this.coverageData.asyncFunctions[key]) {
      this.coverageData.asyncFunctions[key] = { 
        started: 1,
        resolved: 0,
        rejected: 0,
        awaitPoints: 0
      };
      this._logStorage('trackAwaitPoint', key, this.coverageData.asyncFunctions);
    } else {
      this.coverageData.asyncFunctions[key].awaitPoints++;
      this._saveCoverageData();
    }
    
    console.log(`Await point at ${location} in async function ${name} (${id}) in ${component}`);
  },
  
  trackPromiseCreation(component, id, type) {
    const key = `${component}:${id}:${type}`;
    console.log(`[TRACKING] trackPromiseCreation for ${key}`);
    
    if (!this.coverageData.promises[key]) {
      this.coverageData.promises[key] = { 
        created: 0,
        resolved: 0,
        rejected: 0,
        thenCalls: 0,
        catchCalls: 0,
        finallyCalls: 0
      };
      this._logStorage('trackPromiseCreation', key, this.coverageData.promises);
    } else {
      this.coverageData.promises[key].created++;
      this._saveCoverageData();
    }
    
    console.log(`Promise ${id} (${type}) in ${component} created`);
    
    // Return a function to track this specific promise
    return (promise) => {
      // Generate a unique ID for this promise instance
      const promiseId = Symbol(`promise-${id}`);
      this._activePromises.set(promiseId, { key, type: 'pending' });
      
      // Wrap the promise to track its resolution or rejection
      return promise
        .then(result => {
          const state = this._activePromises.get(promiseId);
          if (state) {
            this._activePromises.set(promiseId, { ...state, type: 'resolved' });
            
            if (!this.coverageData.promises[key]) {
              this.coverageData.promises[key] = { 
                created: 1,
                resolved: 0,
                rejected: 0,
                thenCalls: 0,
                catchCalls: 0,
                finallyCalls: 0
              };
              this._saveCoverageData();
            }
            
            this.coverageData.promises[key].resolved++;
            this._saveCoverageData();
            
            console.log(`Promise ${id} (${type}) in ${component} resolved`);
          }
          return result;
        })
        .catch(error => {
          const state = this._activePromises.get(promiseId);
          if (state) {
            this._activePromises.set(promiseId, { ...state, type: 'rejected' });
            
            if (!this.coverageData.promises[key]) {
              this.coverageData.promises[key] = { 
                created: 1,
                resolved: 0,
                rejected: 0,
                thenCalls: 0,
                catchCalls: 0,
                finallyCalls: 0
              };
              this._saveCoverageData();
            }
            
            this.coverageData.promises[key].rejected++;
            this._saveCoverageData();
            
            console.log(`Promise ${id} (${type}) in ${component} rejected`);
          }
          throw error;
        });
    };
  },
  
  trackPromiseThen(component, id, type) {
    const key = `${component}:${id}:${type}`;
    console.log(`[TRACKING] trackPromiseThen for ${key}`);
    
    if (!this.coverageData.promises[key]) {
      this.coverageData.promises[key] = { 
        created: 1,
        resolved: 0,
        rejected: 0,
        thenCalls: 0,
        catchCalls: 0,
        finallyCalls: 0
      };
      this._logStorage('trackPromiseThen', key, this.coverageData.promises);
    } else {
      this.coverageData.promises[key].thenCalls++;
      this._saveCoverageData();
    }
    
    console.log(`Promise ${id} (${type}) in ${component} .then() called`);
  },
  
  trackPromiseCatch(component, id, type) {
    const key = `${component}:${id}:${type}`;
    console.log(`[TRACKING] trackPromiseCatch for ${key}`);
    
    if (!this.coverageData.promises[key]) {
      this.coverageData.promises[key] = { 
        created: 1,
        resolved: 0,
        rejected: 0,
        thenCalls: 0,
        catchCalls: 0,
        finallyCalls: 0
      };
      this._logStorage('trackPromiseCatch', key, this.coverageData.promises);
    } else {
      this.coverageData.promises[key].catchCalls++;
      this._saveCoverageData();
    }
    
    console.log(`Promise ${id} (${type}) in ${component} .catch() called`);
  },
  
  trackPromiseFinally(component, id, type) {
    const key = `${component}:${id}:${type}`;
    console.log(`[TRACKING] trackPromiseFinally for ${key}`);
    
    if (!this.coverageData.promises[key]) {
      this.coverageData.promises[key] = { 
        created: 1,
        resolved: 0,
        rejected: 0,
        thenCalls: 0,
        catchCalls: 0,
        finallyCalls: 0
      };
      this._logStorage('trackPromiseFinally', key, this.coverageData.promises);
    } else {
      this.coverageData.promises[key].finallyCalls++;
      this._saveCoverageData();
    }
    
    console.log(`Promise ${id} (${type}) in ${component} .finally() called`);
  },
  
  // Try-catch tracking (already implemented)
  trackTry(component, id, blockType) {
    const key = `${component}:${id}:${blockType}`;
    if (!this.coverageData.tryCatch[key]) {
      this.coverageData.tryCatch[key] = { 
        tryCount: 0,
        catchCount: 0,
        finallyCount: 0
      };
    }
    
    this.coverageData.tryCatch[key].tryCount++;
    this._saveCoverageData();
    
    console.log(`Try block ${id} in ${component} executed`);
  },
  
  trackCatch(component, id, blockType) {
    const key = `${component}:${id}:${blockType}`;
    if (!this.coverageData.tryCatch[key]) {
      this.coverageData.tryCatch[key] = { 
        tryCount: 0,
        catchCount: 0,
        finallyCount: 0
      };
    }
    
    this.coverageData.tryCatch[key].catchCount++;
    this._saveCoverageData();
    
    console.log(`Catch block ${id} in ${component} executed`);
  },
  
  trackFinally(component, id, blockType) {
    const key = `${component}:${id}:${blockType}`;
    if (!this.coverageData.tryCatch[key]) {
      this.coverageData.tryCatch[key] = { 
        tryCount: 0,
        catchCount: 0,
        finallyCount: 0
      };
    }
    
    this.coverageData.tryCatch[key].finallyCount++;
    this._saveCoverageData();
    
    console.log(`Finally block ${id} in ${component} executed`);
  },
  
  getCoverageReport() {
    // Load the latest data from file
    try {
      if (fs.existsSync(COVERAGE_FILE)) {
        this.coverageData = JSON.parse(fs.readFileSync(COVERAGE_FILE, 'utf8'));
      }
    } catch (error) {
      console.error('Error loading coverage data for report:', error);
    }
    
    return {
      ...this.coverageData,
      summary: {
        branches: Object.keys(this.coverageData.branches).length,
        jsxElements: Object.keys(this.coverageData.jsxElements).length,
        functions: Object.keys(this.coverageData.functions).length,
        asyncFunctions: Object.keys(this.coverageData.asyncFunctions).length,
        promises: Object.keys(this.coverageData.promises).length,
        tryCatch: Object.keys(this.coverageData.tryCatch).length,
        details: {
          asyncFunctions: this.coverageData.asyncFunctions,
          promises: this.coverageData.promises
        }
      }
    };
  }
};

// Save initial coverage data
global.COVERAGE_TRACKER._saveCoverageData();

module.exports = global.COVERAGE_TRACKER; 