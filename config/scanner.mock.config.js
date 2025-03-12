module.exports = {
  includes: [
    '*.tsx',
    '*.ts',
    '**/**.tsx',
    '**/**.ts'
  ],
  
  excludes: [
    '*.test.*',
    '*.spec.*',
    '**/**.test.*',
    '**/**.spec.*',
    '**/node_modules/**'
  ],

  roots: [
    '__mocks__/src'
  ],

  maxDepth: 3,

  componentPatterns: {
    namePatterns: [
      /[A-Z][a-zA-Z]*\.(tsx|ts)$/,
      /index\.(tsx|ts)$/
    ],
    requiredImports: ['react']
  },

  relationships: {
    trackParentChild: true,
    trackImports: true,
    trackTestIds: true,
    maxRelationships: 100
  }
};
