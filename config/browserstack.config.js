module.exports = {
  username: process.env.BROWSERSTACK_USERNAME,
  accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
  projectName: 'TW Mobile',
  capabilities: {
    'browserstack.debug': true,
    'browserstack.console': 'verbose',
    'browserstack.networkLogs': true
  },
  environments: {
    chrome: {
      browser: 'chrome',
      browser_version: 'latest'
    },
    safari: {
      browser: 'safari',
      browser_version: 'latest'
    }
  }
};
