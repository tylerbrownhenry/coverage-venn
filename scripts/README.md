# Scripts Directory Structure

This directory contains various scripts organized by their purpose:

- **add/**: Scripts that add features or functionality to reports
  - `add-export-to-report.js`: Adds export functionality to coverage reports
  - `add-interactive-source-to-report.js`: Adds interactive source code to reports

- **export/**: Scripts for exporting coverage data
  - `export-coverage.ts`: Exports coverage data in various formats

- **analysis/**: Scripts for analysis and inspection
  - **analyze/**: Coverage and application analysis
    - `analyze-mock-coverage.ts`: Analyzes coverage for mock components
    - `analyze-coverage.ts`: Analyzes generic coverage data
    - `analyze-mock-app.ts`: Analyzes mock applications
  - **correlate/**: Correlation between tests and components
    - `correlate-coverage.ts`: Correlates test coverage with components
  - **scan/**: Scanning tools
    - `scan-mock-app.ts`: Scans mock applications
  - **check/**: Validation tools
    - `check-plugin.js`: Checks the instrumentation plugin

- **generate/**: Scripts that generate reports and artifacts
  - `generate-html-report.ts`: Generates HTML coverage reports
  - `generate-simple-report.js`: Generates simplified reports
  - `generate-instrumented-report.js`: Generates reports for instrumented code
  - `generate-test-ids.ts`: Generates test IDs

- **run/**: Scripts that execute tests or coverage
  - `run-instrumented-jest.js`: Runs Jest with instrumentation
  - `run-instrumented-coverage.ts`: Runs instrumented coverage analysis

## Usage

Most scripts can be run using `ts-node` for TypeScript files or `node` for JavaScript files:

```bash
# Running TypeScript scripts
npx ts-node generate/generate-html-report.ts

# Running JavaScript scripts
node add/add-export-to-report.js
```
