
// Coverage tracker for fixed plugin
const COVERAGE_TRACKER = {
  functions: {},
  branches: {},
  tryCatch: {},
  
  trackFunctionStart(functionName, component, id) {
    const key = `${component}:${id}:${functionName}`;
    if (!this.functions[key]) {
      this.functions[key] = { calls: 0 };
    }
    this.functions[key].calls++;
    console.log(`Function ${functionName} (id: ${id}) in ${component} started`);
    return true;
  },
  
  trackFunctionEnd(functionName, component, id) {
    console.log(`Function ${functionName} (id: ${id}) in ${component} completed`);
    return true;
  },
  
  trackFunctionError(functionName, component, id) {
    console.log(`Function ${functionName} (id: ${id}) in ${component} errored`);
    return true;
  },
  
  trackBranch(component, branchId, branchType, condition) {
    const key = `${component}:${branchId}:${branchType}`;
    if (!this.branches[key]) {
      this.branches[key] = { 
        evaluations: 0,
        truthy: 0,
        falsy: 0
      };
    }
    
    this.branches[key].evaluations++;
    
    if (condition) {
      this.branches[key].truthy++;
      console.log(`Branch ${branchType} (id: ${branchId}) in ${component} evaluated to true`);
    } else {
      this.branches[key].falsy++;
      console.log(`Branch ${branchType} (id: ${branchId}) in ${component} evaluated to false`);
    }
    
    return condition;
  },
  
  trackTryCatch(component, id, block, error) {
    const key = `${component}:${id}`;
    
    if (!this.tryCatch[key]) {
      this.tryCatch[key] = {
        try: 0,
        catch: 0,
        finally: 0
      };
    }
    
    this.tryCatch[key][block]++;
    
    if (block === 'try') {
      console.log(`Try block (id: ${id}) in ${component} executed`);
    } else if (block === 'catch') {
      console.log(`Catch block (id: ${id}) in ${component} executed with error: ${error?.message || 'Unknown'}`);
    } else if (block === 'finally') {
      console.log(`Finally block (id: ${id}) in ${component} executed`);
    }
  },
  
  getReport() {
    return {
      functions: this.functions,
      branches: this.branches,
      tryCatch: this.tryCatch
    };
  },
  
  printReport() {
    console.log('\nCoverage Report:');
    console.log('-----------------');
    
    console.log('\nFunctions:');
    for (const key in this.functions) {
      const [component, id, name] = key.split(':');
      console.log(`  ${name} in ${component}: ${this.functions[key].calls} calls`);
    }
    
    console.log('\nBranches:');
    for (const key in this.branches) {
      const [component, id, type] = key.split(':');
      const branch = this.branches[key];
      console.log(`  ${type} ${id} in ${component}: ${branch.evaluations} evaluations (true: ${branch.truthy}, false: ${branch.falsy})`);
    }
    
    console.log('\nTry-Catch:');
    for (const key in this.tryCatch) {
      const [component, id] = key.split(':');
      const tc = this.tryCatch[key];
      console.log(`  Block ${id} in ${component}: try: ${tc.try}, catch: ${tc.catch}, finally: ${tc.finally}`);
    }
  }
};

module.exports = COVERAGE_TRACKER;
