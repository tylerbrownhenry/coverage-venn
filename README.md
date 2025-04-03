# Coverage Venn

A component coverage analysis and visualization tool that helps you understand and improve your test coverage across different testing types (unit, e2e, visual, runtime).

## Installation

### From npm registry:
```bash
npm install -g coverage-venn
```

Or install locally in your project:
```bash
npm install --save-dev coverage-venn
```

### From GitHub repository:
```bash
# Install latest version
npm install github:tylerhenry/coverage-venn

# Install from specific branch
npm install github:tylerhenry/coverage-venn#main

# Install from full URL
npm install https://github.com/tylerhenry/coverage-venn.git
```

## Usage

### Command Line Interface

Scan a directory for component coverage analysis:

```bash
coverage-venn scan <directory> [options]
```

Options:
- `-o, --output <path>`: Output path for coverage report (default: "./coverage-report.json")
- `-c, --config <path>`: Path to config file

Example:
```bash
coverage-venn scan src/components -o coverage.json
```

### Programmatic Usage

```typescript
import { ComponentHierarchyManager, CoverageReportGenerator } from 'coverage-venn';

async function analyzeCoverage() {
  // Initialize managers
  const hierarchyManager = new ComponentHierarchyManager();
  const reportGenerator = new CoverageReportGenerator('./coverage-report.json');

  // Scan component hierarchy
  const hierarchy = await hierarchyManager.scanHierarchy();
  
  // Generate and save report
  const coverageData = Array.from(hierarchy.values()).map(component => ({
    path: component.path,
    coverage: {
      unit: 0,
      e2e: 0,
      visual: 0,
      runtime: 0
    },
    testIds: component.testIds,
    tags: []
  }));

  const report = await reportGenerator.generateReport(coverageData);
  await reportGenerator.saveReport(report);
}
```

## Configuration

Create a configuration file (e.g., `coverage-venn.config.js`):

```javascript
module.exports = {
  manager: {
    rootDir: 'src/components',
    tracking: {
      hashStoreFile: '.hash-store.json',
      tagStoreFile: '.tag-store.json'
    }
  },
  browserStack: {
    enabled: false,
    username: process.env.BROWSERSTACK_USERNAME,
    accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
    projectName: 'My Project'
  }
};
```

## Features

- Component hierarchy analysis
- Multiple coverage types tracking:
  - Unit tests
  - E2E tests
  - Visual tests
  - Runtime coverage
- Component tagging system
- BrowserStack integration
- Customizable reporting

## Development

To contribute or run locally:

```bash
# Clone the repository
git clone https://github.com/tylerhenry/coverage-venn.git
cd coverage-venn

# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test

# Try it out
npm run scan src/components
```

## License

MIT

