const { transform } = require('@babel/core');
const generate = require('@babel/generator').default;

module.exports = {
  transform({ src, filename, options }) {
    const instrumentationPlugin = require('../babel/component-tracker').default;
    
    const result = transform(src, {
      filename,
      plugins: [
        [instrumentationPlugin, {
          trackingEnabled: true,
          componentPaths: options.componentPaths
        }]
      ],
      ...options
    });

    return {
      code: result.code,
      map: result.map
    };
  },

  getCacheKey() {
    return 'coverage-venn-transformer';
  }
};
