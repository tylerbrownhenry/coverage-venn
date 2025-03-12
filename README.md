# Coverage Venn: Test-Code Correlation Tool

Coverage Venn is a specialized tool for correlating unit tests and E2E tests with the code they cover. Unlike standard coverage tools that only show what code is covered, Coverage Venn helps you understand *which tests* are covering *which components*, and provides recommendations for improving test coverage.

## TLDR: Quick Commands for Correlated Coverage Reports

```bash
# Install dependencies
npm install

# Generate the correlated coverage report using the mock app
npm run coverage:correlate:mock

# Open the report in your browser
# macOS:
open coverage-mock/coverage.html
# Windows:
start coverage-mock/coverage.html
# Linux:
xdg-open coverage-mock/coverage.html
```

## What Makes Coverage Venn Different?

Standard coverage tools (like Istanbul) show you *if* your code is covered, but Coverage Venn shows you:

1. **Which tests** are covering which components
2. **Correlation between unit and E2E tests** for full coverage visibility
3. **Recommendations for additional test coverage** based on gap analysis
4. **Visual representation** of code-test relationships

## Core Workflow

1. **Scan component hierarchy** from your React/React Native app
2. **Analyze test coverage** from both unit and E2E tests
3. **Correlate tests with components** to establish relationships
4. **Generate comprehensive reports** showing overall coverage and recommendations

## Using with Mock App vs Real Projects

The tool supports two primary modes:

### Mock App Mode (For Development/Testing)

Uses the sample app in `__mocks__/` directory to demonstrate functionality:

```bash
# Scan the mock app structure
npm run scan:mock

# Analyze mock coverage
npm run analyze:mock

# Correlate test coverage with components
npm run correlate:coverage:mock

# Generate the correlated report
npm run report:correlated
```

### Real Project Mode (For Production Use)

For use with your actual large-scale project:

```bash
# Set environment variables pointing to your project
export PROJECT_ROOT=/path/to/your/project
export SOURCE_DIR=src
export TEST_DIR=tests

# Run the full workflow
npm run scan:project
npm run analyze:project
npm run correlate:coverage:project
npm run report:correlated:project
```

## Understanding the Report

The generated HTML report in `coverage-mock/coverage.html` provides:

1. **Component List**: All analyzed components with coverage percentages
2. **Test Correlation**: Which tests (unit and E2E) cover each component
3. **Coverage Gaps**: Areas that need additional test coverage
4. **Recommended Tags**: Suggestions for test IDs and tags to improve test correlation

## Configuration

Customize the analysis with configuration files:

- `config/scanner.config.js`: Controls component scanning behavior
- `config/manager.config.js`: Manages component tracking and relationships
- `config/correlation.config.js`: Configures test-to-component correlation algorithms

## Extending for Large Repositories

When using with large repositories:

1. Configure path mappings in `config/scanner.config.js`
2. Adjust correlation thresholds in `config/correlation.config.js`
3. Use the tag recommendation system for standardizing test IDs
4. Consider breaking analysis into modules for better performance

## Development and Contribution

Coverage Venn is designed to be extended. The key extension points are:

- `src/scanners/`: Add support for different component types
- `src/analyzers/`: Integrate with different coverage tools
- `src/correlators/`: Improve correlation algorithms
- `src/reporters/`: Add new report formats

## Documentation

- [Scanner Configuration](./docs/SCANNER_CONFIG.md)
- [Correlation Algorithms](./docs/CORRELATION.md)
- [Report Customization](./docs/REPORTS.md)
- [Integration Guide](./docs/INTEGRATION.md)

## File Structure Overview

```
coverage-venn/
├── config/            # Configuration files
├── coverage-mock/     # Generated mock coverage reports
│   ├── coverage.html  # Main HTML report with correlation data
│   └── coverage.json  # Raw correlation data
├── scripts/           # Analysis and report generation scripts
├── src/               # Core functionality
│   ├── analyzers/     # Coverage analysis tools
│   ├── correlators/   # Test-code correlation algorithms
│   ├── reporters/     # Report generation
│   └── scanners/      # Component scanning tools
└── __mocks__/         # Mock application for testing
    └── src/           # Source code for mock app
        ├── components/
        └── __tests__/
```

## Troubleshooting

If you encounter issues:

1. Ensure your component structure follows React/React Native patterns
2. Check that test files are using consistent naming patterns
3. Verify that coverage data is being generated correctly
4. For large repositories, consider increasing memory limits with `NODE_OPTIONS="--max-old-space-size=4096"`

For additional help, see the [Troubleshooting Guide](./docs/TROUBLESHOOTING.md).