
// Coverage tracker for Loop instrumentation
const COVERAGE_TRACKER = {
  loops: {},
  
  trackLoop(component, loopId, ...args) {
    const key = `${component}:${loopId}`;
    
    if (!this.loops[key]) {
      this.loops[key] = {
        executions: 0
      };
    }
    
    this.loops[key].executions++;
    console.log(`Loop (id: ${loopId}) in ${component} executed`);
    
    return args[0]; // Return first argument for chaining
  },
  
  printReport() {
    console.log('\nCoverage Report:');
    console.log('-----------------');
    
    console.log('\nLoops:');
    for (const key in this.loops) {
      const [component, id] = key.split(':');
      console.log(`  Loop ${id} in ${component}: ${this.loops[key].executions} executions`);
    }
  }
};

module.exports = COVERAGE_TRACKER;
