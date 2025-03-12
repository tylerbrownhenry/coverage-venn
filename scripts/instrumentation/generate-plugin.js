#!/usr/bin/env node
/**
 * Script to generate a new instrumentation plugin from templates
 * 
 * Usage: node generate-plugin.js <type>
 * Example: node generate-plugin.js for
 */

const fs = require('fs');
const path = require('path');

// Get the type from command line args
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Error: Missing type argument');
  console.log('Usage: node generate-plugin.js <type>');
  console.log('Example: node generate-plugin.js for');
  process.exit(1);
}

const type = args[0].toLowerCase();
const TYPE = type.charAt(0).toUpperCase() + type.slice(1);
const TYPE_UPPER = type.toUpperCase();

// Paths
const BASE_DIR = path.resolve(__dirname);
const TEMPLATE_DIR = path.join(BASE_DIR, 'template');
const TARGET_DIR = path.join(BASE_DIR, type);

// Template files
const TEMPLATES = [
  {
    source: path.join(TEMPLATE_DIR, '{TYPE}-plugin.js.template'),
    target: path.join(TARGET_DIR, `${type}-plugin.js`),
  },
  {
    source: path.join(TEMPLATE_DIR, 'test-{TYPE}.js.template'),
    target: path.join(TARGET_DIR, `test-${type}.js`),
  },
  {
    source: path.join(TEMPLATE_DIR, 'test-{TYPE}-fixed.js.template'),
    target: path.join(TARGET_DIR, `test-${type}-fixed.js`),
  }
];

// Create the target directory if it doesn't exist
if (!fs.existsSync(TARGET_DIR)) {
  console.log(`Creating directory: ${TARGET_DIR}`);
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Process each template
for (const template of TEMPLATES) {
  // Skip if source doesn't exist
  if (!fs.existsSync(template.source)) {
    console.error(`Template file not found: ${template.source}`);
    continue;
  }
  
  // Skip if target already exists (to prevent overwriting)
  if (fs.existsSync(template.target)) {
    console.log(`File already exists, skipping: ${template.target}`);
    continue;
  }
  
  // Read template content
  let content = fs.readFileSync(template.source, 'utf8');
  
  // Replace placeholders
  content = content
    .replace(/\{\{TYPE\}\}/g, TYPE)
    .replace(/\{\{type\}\}/g, type);
  
  // Write the file
  console.log(`Creating file: ${template.target}`);
  fs.writeFileSync(template.target, content);
}

// Add the new type to run-fixed-tests.js if it's not already there
const runFixedTestsPath = path.join(BASE_DIR, 'run-fixed-tests.js');
if (fs.existsSync(runFixedTestsPath)) {
  let runFixedTests = fs.readFileSync(runFixedTestsPath, 'utf8');
  
  // Only add if it doesn't already exist
  if (!runFixedTests.includes(`${TYPE_UPPER} INSTRUMENTATION TEST`)) {
    // Find the position to insert the new test section - before ALL TESTS COMPLETED
    const allTestsCompletedIndex = runFixedTests.indexOf('ALL TESTS COMPLETED');
    if (allTestsCompletedIndex !== -1) {
      // Find the start of the line containing ALL TESTS COMPLETED
      const lineStart = runFixedTests.lastIndexOf('\n', allTestsCompletedIndex);
      if (lineStart !== -1) {
        // Find the start of the preceding empty line or console.log call
        const sectionStart = runFixedTests.lastIndexOf('\n\n', lineStart - 1);
        if (sectionStart !== -1) {
          // Create the test section to insert
          const testSectionTemplate = `
// Run ${TYPE} Instrumentation Test
console.log('\\n============================================');
console.log('RUNNING ${TYPE_UPPER} INSTRUMENTATION TEST');
console.log('============================================\\n');

try {
  const ${type}TestFile = path.join(__dirname, '${type}', 'test-${type}-fixed.js');
  
  // Create the file and directory if it doesn't exist
  if (!fs.existsSync(path.dirname(${type}TestFile))) {
    fs.mkdirSync(path.dirname(${type}TestFile), { recursive: true });
  }
  
  // Run the ${type} test
  execSync(\`node \${${type}TestFile}\`, { stdio: 'inherit' });
  console.log('${TYPE} instrumentation test completed successfully');
} catch (error) {
  console.error('Error running ${type} instrumentation test:', error.message);
}`;

          // Insert the section at the appropriate position
          const firstPart = runFixedTests.substring(0, sectionStart + 1);
          const secondPart = runFixedTests.substring(sectionStart + 1);
          runFixedTests = firstPart + testSectionTemplate + secondPart;
          
          // Update the summary line to include the new type
          const summaryLine = runFixedTests.match(/2\. Tested (.*) instrumentation/);
          if (summaryLine) {
            const currentTypes = summaryLine[1];
            if (!currentTypes.includes(type)) {
              // Check if we should append with "and" or comma
              let newTypes;
              if (currentTypes.includes(', and ')) {
                // Already has "and", so replace the last "and" with comma and add new "and"
                newTypes = currentTypes.replace(', and ', ', ') + `, and ${type}`;
              } else if (currentTypes.includes(' and ')) {
                // Has "and" but no comma, so add comma before "and"
                newTypes = currentTypes.replace(' and ', ', and ') + `, and ${type}`;
              } else if (currentTypes.includes(', ')) {
                // Has commas, so add "and" before the new type
                newTypes = currentTypes + `, and ${type}`;
              } else {
                // Just a single word, add "and"
                newTypes = currentTypes + ` and ${type}`;
              }
              
              runFixedTests = runFixedTests.replace(
                /2\. Tested (.*) instrumentation/,
                `2. Tested ${newTypes} instrumentation`
              );
            }
          }
          
          // Write the updated file
          console.log(`Updating ${runFixedTestsPath} to include ${type} tests`);
          fs.writeFileSync(runFixedTestsPath, runFixedTests);
        }
      }
    }
  }
}

console.log(`\n${TYPE} instrumentation plugin and tests generated successfully!`);
console.log('\nNext steps:');
console.log(`1. Implement your ${type} instrumentation logic in ${type}/${type}-plugin.js`);
console.log(`2. Add ${type}-specific test cases in ${type}/test-${type}.js and ${type}/test-${type}-fixed.js`);
console.log('3. Run your tests with:');
console.log(`   node ${type}/test-${type}.js`);
console.log(`   node ${type}/test-${type}-fixed.js`);
console.log('4. Or run all tests with:');
console.log('   node run-fixed-tests.js'); 