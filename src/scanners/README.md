# Component Scanner

## Overview
The Component Scanner analyzes React component files to build a component hierarchy and track relationships between components.

## Features

### Component Discovery
- Recursively scans directories for `.tsx` and `.jsx` files
- Excludes test files (`*.test.*`, `*.spec.*`)
- Maps component dependencies and imports

### Hierarchy Mapping
```typescript
interface ComponentNode {
  name: string;        // Component name
  path: string;        // File path
  children: string[];  // Child components
  parents: string[];   // Parent components
  imports: string[];   // Import statements
  testIds: string[];   // Test IDs used
}
```

### Test ID Validation
- Validates test IDs against standardized rules
- Enforces naming conventions
- Provides suggestions for incorrect IDs
- Reports validation errors

## Usage

```typescript
import { ComponentHierarchyScanner } from './ComponentHierarchyScanner';

const scanner = new ComponentHierarchyScanner();
const hierarchy = await scanner.scanDirectory('src/components');

// Access component information
const button = hierarchy.get('Button');
console.log(button.children);  // Child components
console.log(button.testIds);   // Test IDs used
```

## Validation Rules

1. **Prefix Rule**
   - Must start with `root_` or `shared_`
   - Example: `root_button`, `shared_modal`

2. **Case Rule**
   - Must use lowercase with underscore separators
   - Example: `root_home_screen_button`

3. **Hierarchy Rule**
   - Must reflect component hierarchy
   - Example: `root_parent_child_component`

## File Detection

The scanner identifies component files by:
- File extension (`.tsx` or `.jsx`)
- Excluding test files
- Checking for React component patterns

```typescript
isComponentFile(filename: string): boolean {
  return /\.(tsx|jsx)$/.test(filename) && 
         !filename.includes('.test.') &&
         !filename.includes('.spec.');
}
```

## Component Analysis

For each component, the scanner:
1. Parses the file using @babel/parser
2. Analyzes imports and dependencies
3. Identifies child components
4. Validates test IDs
5. Builds parent-child relationships

## Configuration

The scanner behavior can be customized through `scanner.config.js`:

```javascript
module.exports = {
  // File patterns to include/exclude
  includes: ['**/*.tsx'],
  excludes: ['**/*.test.*'],

  // Root scanning directories
  roots: ['src/components'],

  // Scanning depth (0 = unlimited)
  maxDepth: 0
}
```

### Example Configurations

1. **Basic Component Library**
```javascript
module.exports = {
  includes: ['**/*.tsx'],
  roots: ['src/components'],
  maxDepth: 2,
  componentPatterns: {
    namePatterns: [/[A-Z][a-zA-Z]*\.tsx$/]
  }
};
```

2. **Feature-based Structure**
```javascript
module.exports = {
  includes: ['**/*.tsx', '**/*.jsx'],
  roots: ['src/features'],
  relationships: {
    trackParentChild: true,
    trackImports: true
  }
};
```

3. **Monorepo Setup**
```javascript
module.exports = {
  includes: ['**/*.tsx'],
  roots: [
    'packages/web/src',
    'packages/mobile/src'
  ],
  excludes: [
    '**/node_modules/**',
    '**/dist/**'
  ]
};
```

### Performance Tuning

```javascript
module.exports = {
  performance: {
    enableCache: true,
    cacheDuration: 3600000, // 1 hour
    concurrency: 4
  }
};
```

## Output Example

```json
{
  "Button": {
    "name": "Button",
    "path": "src/components/Button.tsx",
    "children": ["Icon", "Spinner"],
    "parents": ["Form", "Card"],
    "imports": ["./Icon", "./Spinner"],
    "testIds": ["root_button", "root_button_loading"]
  }
}
```

## Integration

The scanner integrates with:
- Test ID validation
- Coverage tracking
- BrowserStack testing
- Component relationship mapping

See [Component Manager](../managers/README.md) for integration details.
