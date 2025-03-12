module.exports = {
  // File patterns to include
  includes: [
    // React component files
    '**/src/components/**/*.tsx',
    '**/src/components/**/*.jsx',
    '**/src/views/**/*.tsx',
    '**/src/views/**/*.jsx',
    // Other potential component files
    '**/src/features/**/*.tsx',
    '**/src/features/**/*.jsx'
  ],
  
  // File patterns to exclude
  excludes: [
    '**/*.test.*',
    '**/*.spec.*',
    '**/node_modules/**',
    '**/dist/**'
  ],
  
  // Maximum directory depth to scan
  maxDepth: 0,
  
  // Root directories to scan for components
  roots: [
    'src/components', 
    'src/features', 
    'src/screens',
    'src/views'
  ],
  
  // Component detection patterns
  componentPatterns: {
    namePatterns: [
      // Match files like Component.tsx or ComponentName.tsx
      /([A-Z][a-zA-Z]*)\.(tsx|jsx)$/,
      // Match index files in component directories
      /([A-Z][a-zA-Z]*)\/index\.(tsx|jsx)$/,
      // Match any .tsx files in the views directory
      /views\/([A-Za-z0-9]+)\.(tsx|jsx)$/,
      // Match files in the components directory
      /components\/([A-Za-z0-9]+)\.(tsx|jsx)$/
    ],
    requiredImports: [
      'react', 
      '@react-native',
      'React'
    ]
  },
  
  // Component relationship tracking
  relationships: {
    trackParentChild: true,
    trackImports: true,
    trackTestIds: true,
    maxRelationships: 1000
  },
  
  // Performance options
  performance: {
    enableCache: true,
    cacheDuration: 3600000, // 1 hour in ms
    concurrency: 4
  }
};
