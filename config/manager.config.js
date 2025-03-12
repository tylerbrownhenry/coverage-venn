/**
 * Configuration for the component manager
 */
module.exports = {
  // Base directory for component scanning
  baseDir: 'src',
  
  // Output directory for reports
  outputDir: 'reports',
  
  // BrowserStack integration settings
  browserStack: {
    enabled: false,
    username: process.env.BROWSERSTACK_USERNAME || '',
    accessKey: process.env.BROWSERSTACK_ACCESS_KEY || '',
    projectName: 'Coverage Venn'
  },
  
  // Test tracking settings
  tracking: {
    enableHashTracking: true,
    enableTagTracking: true,
    hashStoreFile: '.hash-store.json',
    tagStoreFile: '.tag-store.json'
  },
  
  // Coverage settings
  coverage: {
    reportDir: 'coverage',
    includeUntestedComponents: true,
    thresholds: {
      unit: 80,
      e2e: 50,
      visual: 30,
      runtime: 60
    }
  }
}; 