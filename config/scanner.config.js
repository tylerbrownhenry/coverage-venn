module.exports = {
  // File patterns to include
  includes: [
    // React component files - more inclusive patterns
    '**/src/components/**/*.tsx',
    '**/src/components/**/*.jsx',
    '**/src/components/**/*.ts',
    '**/src/components/**/*.js',
    
    // Views & pages
    '**/src/views/**/*.tsx',
    '**/src/views/**/*.jsx',
    '**/src/views/**/*.ts',
    '**/src/views/**/*.js',
    '**/src/pages/**/*.tsx',
    '**/src/pages/**/*.jsx',
    
    // Features and screens
    '**/src/features/**/*.tsx',
    '**/src/features/**/*.jsx',
    '**/src/features/**/*.ts',
    '**/src/features/**/*.js',
    '**/src/screens/**/*.tsx',
    '**/src/screens/**/*.jsx',
    
    // Context providers
    '**/src/contexts/**/*.tsx',
    '**/src/contexts/**/*.ts',
    '**/src/providers/**/*.tsx',
    '**/src/providers/**/*.ts',
    
    // Hooks and utils
    '**/src/hooks/**/*.ts',
    '**/src/hooks/**/*.tsx',
    '**/src/utils/**/*.ts',
    '**/src/utils/**/*.js',
    
    // Any file that might be a component in the src directory
    '**/src/**/*.tsx',
    '**/src/**/*.jsx',
    '**/src/**/*.ts',
    '**/src/**/*.js'
  ],
  
  // File patterns to exclude
  excludes: [
    '**/*.test.*',
    '**/*.spec.*',
    '**/__mocks__/**',
    '**/__tests__/**',
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/*.d.ts'
  ],
  
  // Maximum directory depth to scan - set to 0 for unlimited depth
  maxDepth: 0,
  
  // Root directories to scan for components
  roots: [
    'src',
    'src/components', 
    'src/features',
    'src/screens',
    'src/views',
    'src/contexts',
    'src/utils'
  ],
  
  // Component detection patterns
  componentPatterns: {
    namePatterns: [
      // Match files like Component.tsx or ComponentName.tsx
      /([A-Z][a-zA-Z]*)\.(tsx|jsx|ts|js)$/,
      
      // Match index files in component directories
      /([A-Z][a-zA-Z]*)\/index\.(tsx|jsx|ts|js)$/,
      
      // Match any .tsx or .ts files in key directories
      /views\/([A-Za-z0-9]+)\.(tsx|jsx|ts|js)$/,
      /components\/([A-Za-z0-9]+)\.(tsx|jsx|ts|js)$/,
      /contexts\/([A-Za-z0-9]+)\.(tsx|ts)$/,
      /features\/([A-Za-z0-9]+)\.(tsx|jsx|ts|js)$/,
      
      // Match utility files
      /utils\/([A-Za-z0-9]+)\.(ts|js)$/,
      
      // Match camelCase files which might be components
      /([a-z][a-zA-Z0-9]*)\.(tsx|jsx|ts|js)$/
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
