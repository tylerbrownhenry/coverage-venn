module.exports = {
  rootDir: '__mocks__/src',
  
  hash: {
    enabled: true,
    track: ['*.tsx', '*.ts'],
    ignore: ['*.test.*', '*.spec.*']
  },

  tags: {
    enabled: true,
    prefix: 'root_',
    enforce: true
  },

  coverage: {
    enabled: true,
    output: 'coverage-mock',
    threshold: {
      unit: 80,
      e2e: 60,
      visual: 90
    }
  },

  browserstack: {
    enabled: false,
    username: 'mock_user',
    accessKey: 'mock_key',
    projectName: 'Mock App',
    capabilities: {
      'browserstack.debug': true
    }
  },

  reporting: {
    format: ['json', 'html'],
    output: 'reports-mock'
  }
};
