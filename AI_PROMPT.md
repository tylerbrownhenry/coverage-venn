# Coverage Venn - AI Assistant Context

This prompt provides context about the Coverage Venn project to help you understand its purpose, structure, and implementation details.

## Project Overview

Coverage Venn is a specialized tool for analyzing and visualizing test coverage in JavaScript/TypeScript applications, with a focus on mapping the relationship between components and their tests. It generates enhanced HTML reports that display component coverage metrics, correlates tests with components, and provides insights for improving test coverage.

## Key Technical Concepts

1. **Component-Test Correlation**: The core feature maps which tests exercise which components by analyzing coverage data and test execution.

2. **Test Coverage Visualization**: Generates interactive HTML reports showing component coverage with source code highlighting.

3. **Syntax Highlighting**: Implements custom syntax highlighting in generated HTML reports using regex patterns for different code elements (keywords, strings, comments, etc.).

4. **Report Generation Workflow**:
   - Collects component coverage data from test runs
   - Correlates tests with components
   - Generates enhanced HTML with interactive features
   - Provides test navigation and recommendations

## Project Structure

- `/scripts/generate/`: Contains main report generation scripts
  - `generate-html-report-enhanced.ts`: Main script for generating HTML reports with syntax highlighting
  
- `/coverage-analysis/`: Contains component coverage data files
  - `project-test-component-correlation.json`: Maps tests to components

- `/coverage-project/`: Output directory for generated reports
  - `coverage.html`: The main HTML report that's generated

- `/src/managers/`: Contains code for coordinating analysis
- `/src/scanners/`: Contains code for extracting data from source code

## Known Technical Challenges

1. **Regex Pattern Issues**: The syntax highlighting relies on regex patterns that have occasionally caused issues, particularly with patterns for matching string literals, comments, and function declarations.

2. **JavaScript Syntax Errors**: Previous issues occurred with:
   - Invalid regex pattern syntax causing runtime errors
   - Missing closing parentheses in function calls
   - Undefined function reference errors

3. **HTML Report Structure**:
   - The report uses a custom structure with components, test files, and navigation between them
   - It utilizes client-side JavaScript for interactivity and syntax highlighting

## Environment Variables

- `PROJECT_ROOT`: Path to the project being analyzed
- `COVERAGE_SOURCE`: Source of coverage data (standard or project)
- `DEBUG`: Enable debug logging for more detailed output

## Common Tasks

- **Generate Enhanced HTML Report**: 
  ```
  PROJECT_ROOT=/path/to/project COVERAGE_SOURCE=project npm run report:correlated:project
  ```

- **Debug Report Generation**:
  ```
  DEBUG=true PROJECT_ROOT=/path/to/project COVERAGE_SOURCE=project npm run report:correlated:project
  ```

- **Fix Syntax Highlighting Issues**: If syntax errors occur in the HTML report, check the regex patterns in the `applySyntaxHighlighting` function within the generated HTML file or in the original `generate-html-report-enhanced.ts` script.

## Documentation

Additional README files in the repository provide more detailed information:
- `/scripts/README.md`: Information about utility scripts
- `/scripts/instrumentation/README.md`: Details about the instrumentation process
- `/src/managers/README.md`: Documentation on analysis managers
- `/src/scanners/README.md`: Information about the scanners that extract data

Use this information to quickly understand the project and provide targeted assistance with any code, debugging, or enhancement needs. 