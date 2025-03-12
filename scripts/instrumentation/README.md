# Instrumentation Scripts

This directory contains scripts for testing different types of instrumentation with the coverage-venn tool.

### Directory Structure

- `async/` - Tests for async/await instrumentation
- `class/` - Tests for class instrumentation
- `flow/` - Tests for Flow type instrumentation
- `function/` - Tests for function instrumentation
- `jsx/` - Tests for JSX instrumentation
- `loop/` - Tests for loop instrumentation
- `switch/` - Tests for switch statement instrumentation
- `template/` - Templates for generating new instrumentation tests
- `try-catch/` - Tests for try/catch instrumentation
- `typescript/` - Tests for TypeScript instrumentation
- `__mocks__/` - Common mocks for shared modules
- `deprecated/` - Files that have been replaced or renamed due to refactoring

Each instrumentation directory contains:
- Test files for that instrumentation type
- Plugin files specific to that instrumentation
- `__tests__/` directory with unit tests
- `__mocks__/` directory with mocks for testing

### Running Tests

There are two types of tests in this project:

1. **Instrumentation Tests**: These are the actual tests that run the instrumentation on code samples
   ```
   npm run test:instrumentation
   ```

2. **Unit Tests**: These are Jest tests that verify the functionality of the instrumentation scripts
   ```
   npm run test:instrumentation-unit
   ```
   or
   ```
   cd scripts/instrumentation && npx jest -c jest.config.js
   ```

### Testing Approach

The unit tests use Jest's mocking capabilities to isolate the instrumentation scripts from their dependencies. This allows us to test the scripts without actually running the instrumentation, which can be slow and prone to errors.

Key aspects of the testing approach:

1. **Common Mocks**: Shared modules like `coverage-tracker.js` and `coverage-instrumentation-plugin.js` are mocked in the common `__mocks__` directory.

2. **Module Mocks**: Each test file mocks its corresponding module to provide predictable behavior.

3. **Process Exit Handling**: The `process.exit` function is mocked to prevent tests from terminating prematurely.

4. **TypeScript Support**: Tests can handle both JavaScript and TypeScript files.

### Deprecated Files

The `deprecated/` directory contains files that have been replaced or renamed during the migration to the unit testing framework:

- Original test files like `test-instrumentation.ts` have been replaced by the more modular approach in this directory
- A mapping file in `deprecated/file_mapping.md` tracks which files were moved and why
- Legacy scripts in `deprecated/outdated/` have been renamed and moved to their appropriate instrumentation type directories

For backwards compatibility, the package.json scripts still reference the new locations with informative messages.

### Adding New Tests

To add a new instrumentation test:

1. Create a new directory for your instrumentation type
2. Add your test files and plugin files
3. Run the setup scripts to create test and mock files:
   ```
   ./create-mocks.js
   ./update-tests.js
   ```

### Troubleshooting

If you encounter issues with the tests:

1. **Module Not Found**: Make sure the module is properly mocked in the `__mocks__` directory
2. **TypeScript Errors**: Ensure the TypeScript configuration is correct
3. **Process Exit**: Check if any code is calling `process.exit` without being mocked

## Directory Structure

Each instrumentation type has its own subdirectory with standardized file naming:

```
instrumentation/
├── fixed-coverage-plugin.js          # Main fixed plugin with anti-recursion protection
├── run-fixed-tests.js                # Script to run all fixed tests
├── generate-plugin.js                # Script to generate new instrumentation types
├── setup-tests.js                    # Script to set up unit tests
├── template/                         # Templates for new instrumentation types
│   ├── {TYPE}-plugin.js.template     # Plugin template
│   ├── test-{TYPE}.js.template       # Basic test template
│   ├── test-{TYPE}-fixed.js.template # Fixed test template
│   ├── __tests__/                    # Unit tests for templates
│   └── __mocks__/                    # Mocks for templates
├── async/
│   ├── async-plugin.js               # Async-specific plugin
│   ├── test-async.js                 # Tests for async instrumentation
│   ├── __tests__/                    # Unit tests for async
│   └── __mocks__/                    # Mocks for async
├── flow/
│   ├── flow-plugin.js                # Flow-specific plugin
│   ├── test-flow.js                  # Main Flow tests
│   ├── test-flow-simple.js           # Simplified Flow tests
│   ├── __tests__/                    # Unit tests for flow
│   └── __mocks__/                    # Mocks for flow
├── function/
│   ├── function-plugin.js            # Function-specific plugin 
│   ├── test-function.ts              # Main function tests
│   ├── test-function-fixed.js        # Tests using fixed plugin
│   ├── __tests__/                    # Unit tests for function
│   └── __mocks__/                    # Mocks for function
├── jsx/
│   ├── jsx-plugin.js                 # JSX-specific plugin
│   ├── test-jsx.ts                   # Main JSX tests
│   ├── test-jsx-fixed.js             # Tests using fixed plugin
│   ├── __tests__/                    # Unit tests for jsx
│   └── __mocks__/                    # Mocks for jsx
├── switch/
│   ├── run-switch.js                 # Switch runner script
│   ├── switch-plugin.js              # Switch-specific plugin
│   ├── test-switch-fixed.js          # Tests using fixed plugin
│   ├── __tests__/                    # Unit tests for switch
│   └── __mocks__/                    # Mocks for switch
├── try-catch/
│   ├── run-try-catch.js              # Try-catch runner script
│   ├── try-catch-plugin.js           # Try-catch-specific plugin
│   ├── test-try-catch.ts             # Main try-catch tests
│   ├── test-try-catch-fixed.js       # Tests using fixed plugin
│   ├── __tests__/                    # Unit tests for try-catch
│   └── __mocks__/                    # Mocks for try-catch
└── typescript/
    ├── typescript-plugin.js          # TypeScript-specific plugin
    ├── test-typescript.js            # TypeScript tests
    ├── __tests__/                    # Unit tests for typescript
    └── __mocks__/                    # Mocks for typescript
```

## File Naming Convention

We follow a standardized naming convention for all files:

1. **Plugin Files**:
   - `{type}-plugin.js` - Type-specific plugin

2. **Test Files**:
   - `test-{type}.js` or `test-{type}.ts` - Main test for that instrumentation type
   - `test-{type}-fixed.js` - Test using the fixed anti-recursion plugin
   - `test-{type}-simple.js` - Simplified test cases (if needed)

3. **Runner Files**:
   - `run-{type}.js` - Runner script for a specific type
   - `run-fixed-tests.js` - Script to run all fixed tests

4. **Unit Tests**:
   - `__tests__/{filename}.test.js` - Unit tests for specific files
   - `__mocks__/coverage-tracker.js` - Mocks for coverage tracker

## Fixed Coverage Plugin

The `fixed-coverage-plugin.js` contains an improved version of the coverage instrumentation plugin with anti-recursion protection to prevent stack overflow errors when instrumenting complex JavaScript code.

Key features:
- WeakSet to track visited nodes
- Recursion depth tracking with max limit
- Better detection of already instrumented code
- Simplified instrumentation patterns
- Support for multiple language constructs

## Generating New Instrumentation Types

You can generate a new instrumentation type using the provided template and generator script:

```bash
node scripts/instrumentation/generate-plugin.js <type>
```

For example, to create a new instrumentation type for loops:

```bash
node scripts/instrumentation/generate-plugin.js loop
```

This will:
1. Create a new directory `loop/` with the necessary files
2. Generate template files for the plugin and tests
3. Update the run-fixed-tests.js script to include the new type

After generating, you'll need to:
1. Implement your specific instrumentation logic in the plugin file
2. Add test cases to the test files
3. Run your tests individually or as part of the test suite

## Running Tests

### Integration Tests

To run tests for the fixed plugin:

```bash
node scripts/instrumentation/run-fixed-tests.js
```

To run tests for a specific instrumentation type:

```bash
node scripts/instrumentation/{type}/test-{type}-fixed.js
```

### Unit Tests

The codebase includes unit tests for all components using Jest. Each instrumentation type directory has its own `__tests__` folder containing unit tests for each file in that directory.

To set up new unit tests:

```bash
node scripts/instrumentation/setup-tests.js
```

To run unit tests:

```bash
npm run test:instrumentation
```

To run unit tests with coverage:

```bash
npm run test:coverage
```

## Adding Support to Fixed Plugin

When adding a new instrumentation type, you may need to update the fixed plugin to support the new type. This typically involves:

1. Adding a new counter for your type IDs
2. Creating a tracking call generator for your type
3. Adding a visitor for your specific AST node type
4. Implementing the instrumentation logic following the anti-recursion pattern
5. Writing unit tests for the new functionality

See the existing implementations in `fixed-coverage-plugin.js` for examples. 