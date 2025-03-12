/**
 * Global teardown script that runs after all tests are complete.
 * 
 * This script:
 * 1. Reports test run duration
 * 2. Processes and aggregates coverage data
 * 3. Generates summary reports
 */

const fs = require('fs');
const path = require('path');

module.exports = async function() {
  // Calculate the total test duration
  const startTime = global.__INSTRUMENTATION_START_TIME__ || Date.now();
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000; // in seconds
  
  console.log(`\nTotal test run duration: ${duration.toFixed(2)} seconds`);
  
  // Check if instrumentation was enabled
  const isInstrumented = process.env.COVERAGE_INSTRUMENTATION === 'true';
  if (!isInstrumented) {
    return;
  }
  
  // Process all the coverage files
  try {
    const coverageDir = path.resolve(process.cwd(), 'coverage-instrumentation');
    const files = fs.readdirSync(coverageDir).filter(file => file.endsWith('.json'));
    
    if (files.length === 0) {
      console.log('No coverage data files found.');
      return;
    }
    
    console.log(`\nFound ${files.length} coverage data files.`);
    
    // Aggregate coverage data
    const aggregatedData = {
      branches: {},
      switches: {},
      cases: {},
      functions: {},
      jsx: {},
      tryBlocks: {}
    };
    
    // Process each file
    for (const file of files) {
      const filePath = path.join(coverageDir, file);
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Merge data into aggregated data
        mergeData(aggregatedData, data);
      } catch (error) {
        console.error(`Error processing file ${file}:`, error.message);
      }
    }
    
    // Save the aggregated data
    const summaryPath = path.join(coverageDir, 'coverage-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(aggregatedData, null, 2));
    
    // Generate a simple text summary
    generateTextSummary(aggregatedData, coverageDir);
    
    console.log(`Aggregated coverage data saved to: ${summaryPath}`);
  } catch (error) {
    console.error('Error processing coverage data:', error.message);
  }
};

/**
 * Merge coverage data from a single file into the aggregated data
 */
function mergeData(aggregated, data) {
  // Merge each category
  ['branches', 'switches', 'cases', 'functions', 'jsx', 'tryBlocks'].forEach(category => {
    if (!data[category]) return;
    
    Object.entries(data[category]).forEach(([component, items]) => {
      if (!aggregated[category][component]) {
        aggregated[category][component] = {};
      }
      
      Object.entries(items).forEach(([id, info]) => {
        if (!aggregated[category][component][id]) {
          // Initialize if this is the first occurrence
          aggregated[category][component][id] = { ...info };
        } else {
          // Merge with existing data
          const existing = aggregated[category][component][id];
          
          // Update hit counts
          if (typeof info.hits === 'number') {
            existing.hits = (existing.hits || 0) + info.hits;
          }
          
          // Update matches for cases
          if (typeof info.matches === 'number') {
            existing.matches = (existing.matches || 0) + info.matches;
          }
          
          // Update function calls and errors
          if (typeof info.calls === 'number') {
            existing.calls = (existing.calls || 0) + info.calls;
          }
          if (typeof info.errors === 'number') {
            existing.errors = (existing.errors || 0) + info.errors;
          }
          
          // Merge arrays of values/conditions
          if (Array.isArray(info.conditions)) {
            existing.conditions = [...(existing.conditions || []), ...info.conditions];
          }
          if (Array.isArray(info.values)) {
            existing.values = [...(existing.values || []), ...info.values];
          }
        }
      });
    });
  });
}

/**
 * Generate a simple text summary of the coverage data
 */
function generateTextSummary(data, outputDir) {
  // Calculate summary statistics
  const summary = {
    components: new Set(),
    branches: 0,
    switches: 0,
    cases: 0,
    functions: 0,
    jsx: 0,
    tryBlocks: 0
  };
  
  // Count components and elements
  ['branches', 'switches', 'cases', 'functions', 'jsx', 'tryBlocks'].forEach(category => {
    Object.keys(data[category]).forEach(component => {
      summary.components.add(component);
      summary[category] += Object.keys(data[category][component]).length;
    });
  });
  
  // Create a summary text
  const text = [
    '=== Coverage Instrumentation Summary ===',
    '',
    `Total components tracked: ${summary.components.size}`,
    `Total branches tracked: ${summary.branches}`,
    `Total switch statements tracked: ${summary.switches}`,
    `Total cases tracked: ${summary.cases}`,
    `Total functions tracked: ${summary.functions}`,
    `Total JSX elements tracked: ${summary.jsx}`,
    `Total try/catch/finally blocks tracked: ${summary.tryBlocks}`,
    '',
    'Components with tracking:',
    ...Array.from(summary.components).map(c => `- ${c}`),
    '',
    '=== End of Summary ==='
  ].join('\n');
  
  // Write to file
  fs.writeFileSync(path.join(outputDir, 'coverage-summary.txt'), text);
} 