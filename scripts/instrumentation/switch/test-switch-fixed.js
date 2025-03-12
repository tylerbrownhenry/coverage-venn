/**
 * Test switch statement instrumentation with the fixed plugin
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const babel = require('@babel/core');

// Set up test environment
const TEST_DIR = path.resolve(__dirname, 'temp-fixed');
const PLUGIN_PATH = path.resolve(__dirname, '..', 'fixed-coverage-plugin.js');

// Create test directory
if (!fs.existsSync(TEST_DIR)) {
  fs.mkdirSync(TEST_DIR, { recursive: true });
}

// Create coverage tracker file
const coverageTrackerFile = path.join(TEST_DIR, 'coverage-tracker.js');
fs.writeFileSync(coverageTrackerFile, `
// Coverage tracker for fixed plugin
const COVERAGE_TRACKER = {
  functions: {},
  branches: {},
  switches: {},
  
  trackFunctionStart(functionName, component, id) {
    const key = \`\${component}:\${id}:\${functionName}\`;
    if (!this.functions[key]) {
      this.functions[key] = { calls: 0 };
    }
    this.functions[key].calls++;
    console.log(\`Function \${functionName} (id: \${id}) in \${component} started\`);
    return true;
  },
  
  trackBranch(component, branchId, branchType, condition) {
    const key = \`\${component}:\${branchId}:\${branchType}\`;
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
      console.log(\`Branch \${branchType} (id: \${branchId}) in \${component} evaluated to true\`);
    } else {
      this.branches[key].falsy++;
      console.log(\`Branch \${branchType} (id: \${branchId}) in \${component} evaluated to false\`);
    }
    
    return condition;
  },
  
  trackSwitch(component, switchId, discriminant, caseIndex) {
    const key = \`\${component}:\${switchId}\`;
    
    if (!this.switches[key]) {
      this.switches[key] = {
        evaluations: 0,
        cases: {}
      };
    }
    
    this.switches[key].evaluations++;
    
    if (caseIndex !== undefined) {
      if (!this.switches[key].cases[caseIndex]) {
        this.switches[key].cases[caseIndex] = 0;
      }
      this.switches[key].cases[caseIndex]++;
      console.log(\`Switch (id: \${switchId}) in \${component} executed case: \${caseIndex}\`);
    }
    
    return discriminant;
  },
  
  printReport() {
    console.log('\\nCoverage Report:');
    console.log('-----------------');
    
    console.log('\\nFunctions:');
    for (const key in this.functions) {
      const [component, id, name] = key.split(':');
      console.log(\`  \${name} in \${component}: \${this.functions[key].calls} calls\`);
    }
    
    console.log('\\nBranches:');
    for (const key in this.branches) {
      const [component, id, type] = key.split(':');
      const branch = this.branches[key];
      console.log(\`  \${type} \${id} in \${component}: \${branch.evaluations} evaluations (true: \${branch.truthy}, false: \${branch.falsy})\`);
    }
    
    console.log('\\nSwitches:');
    for (const key in this.switches) {
      const [component, id] = key.split(':');
      const switchData = this.switches[key];
      console.log(\`  Switch \${id} in \${component}: \${switchData.evaluations} evaluations\`);
      for (const caseIndex in switchData.cases) {
        console.log(\`    Case \${caseIndex}: \${switchData.cases[caseIndex]} executions\`);
      }
    }
  }
};

module.exports = COVERAGE_TRACKER;
`);

// Create test file with switch statements
const testSwitchFile = path.join(TEST_DIR, 'test-switch.js');
fs.writeFileSync(testSwitchFile, `
// Import coverage tracker
const COVERAGE_TRACKER = require('./coverage-tracker');

// Basic switch statement
function getDayName(dayNum) {
  let dayName;
  
  switch (dayNum) {
    case 0:
      dayName = 'Sunday';
      break;
    case 1:
      dayName = 'Monday';
      break;
    case 2:
      dayName = 'Tuesday';
      break;
    case 3:
      dayName = 'Wednesday';
      break;
    case 4:
      dayName = 'Thursday';
      break;
    case 5:
      dayName = 'Friday';
      break;
    case 6:
      dayName = 'Saturday';
      break;
    default:
      dayName = 'Invalid day';
  }
  
  return dayName;
}

// Switch with fall-through
function getQuarterMonths(quarter) {
  let months = [];
  
  switch (quarter) {
    case 1:
      months.push('January');
      months.push('February');
      months.push('March');
      break;
    case 2:
      months.push('April');
      months.push('May');
      months.push('June');
      break;
    case 3:
      months.push('July');
      months.push('August');
      months.push('September');
      break;
    case 4:
      months.push('October');
      months.push('November');
      months.push('December');
      break;
    default:
      months.push('Invalid quarter');
  }
  
  return months;
}

// Switch with return statements
function getGradeDescription(grade) {
  switch (grade) {
    case 'A':
      return 'Excellent';
    case 'B':
      return 'Good';
    case 'C':
      return 'Average';
    case 'D':
      return 'Below Average';
    case 'F':
      return 'Failing';
    default:
      return 'Invalid Grade';
  }
}

// Test the functions
console.log('Testing switch instrumentation:');
console.log('---------------------------------------');

console.log('getDayName(1):', getDayName(1));
console.log('getDayName(6):', getDayName(6));
console.log('getDayName(9):', getDayName(9));

console.log('\\ngetQuarterMonths(2):', getQuarterMonths(2));
console.log('getQuarterMonths(4):', getQuarterMonths(4));

console.log('\\ngetGradeDescription("A"):', getGradeDescription('A'));
console.log('getGradeDescription("C"):', getGradeDescription('C'));
console.log('getGradeDescription("Z"):', getGradeDescription('Z'));

// Print coverage report
COVERAGE_TRACKER.printReport();
`);

// Instrument the code
console.log('Instrumenting switch statements with fixed plugin...');
try {
  // Verify plugin exists
  if (!fs.existsSync(PLUGIN_PATH)) {
    console.error(`Fixed plugin not found at: ${PLUGIN_PATH}`);
    process.exit(1);
  }
  
  const result = babel.transformFileSync(testSwitchFile, {
    plugins: [PLUGIN_PATH],
    filename: 'test-switch.js'
  });
  
  if (result && result.code) {
    const instrumentedFile = path.join(TEST_DIR, 'instrumented-switch.js');
    fs.writeFileSync(instrumentedFile, result.code);
    console.log(`Instrumented code written to: ${instrumentedFile}`);
    
    // Run the instrumented code
    console.log('\nRunning instrumented code:');
    console.log('-------------------------------------------');
    
    execSync(`node ${instrumentedFile}`, { stdio: 'inherit' });
    
    console.log('-------------------------------------------');
    console.log('Switch instrumentation test completed successfully!');
  } else {
    console.error('Failed to transform code with the fixed plugin');
  }
} catch (error) {
  console.error('Error during switch instrumentation test:', error.message);
  if (error.stack) {
    console.error(error.stack.split('\n').slice(0, 3).join('\n'));
  }
} 