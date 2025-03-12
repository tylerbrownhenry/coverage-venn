# Metro Configuration Guide

## Overview
This guide explains how to set up and use the Metro configuration for component coverage analysis.

## Installation

1. Add the required dependencies to your project:
```bash
npm install --save-dev metro metro-react-native-babel-transformer @react-native/metro-config
```

## Basic Configuration

### 1. Setup Metro Config
Create or update your `metro.config.js`:

```js
const { mergeConfig, getDefaultConfig } = require('@react-native/metro-config');
const componentAnalyzerConfig = require('./scripts/component-coverage-analyzer/metro.config.js');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  const analyzerConfig = await componentAnalyzerConfig();

  return mergeConfig(defaultConfig, analyzerConfig);
})();
```

### 2. Environment Variables
Required environment variables:
```bash
COVERAGE_TRACKING=true               # Enable/disable tracking
ANALYZER_CONFIG_PATH=./config.js     # Custom config path
NODE_ENV=development                 # Environment
```

## Advanced Usage

### 1. Selective Component Tracking
```js
// coverage.config.js
module.exports = {
  tracking: {
    include: [
      'src/components/**/*.tsx',
      'src/features/**/*.tsx'
    ],
    exclude: [
      '**/node_modules/**',
      '**/__tests__/**'
    ]
  }
}
```

### 2. Custom Transformer Rules
```js
module.exports = {
  transformer: {
    customTransformOptions: {
      instrumentComponents: true,
      trackingLevel: 'detailed',
      componentFilter: /^[A-Z].*Component$/
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **Transformer Not Found**
```bash
# Check transformer path
node -e "console.log(require.resolve('./src/instrumentation/metro/transformer.js'))"
```

2. **Performance Issues**
- Enable selective tracking
- Use the cache
- Implement batched logging

### Performance Optimization
```js
module.exports = {
  cache: {
    enabled: true,
    profiles: [{
      id: 'component-tracking',
      include: ['**/*.tsx']
    }]
  }
}
```

## Integration Examples

### 1. Basic Integration
```js
// metro.config.js
module.exports = {
  transformer: {
    babelTransformerPath: require.resolve(
      './scripts/component-coverage-analyzer/src/instrumentation/metro/transformer.js'
    )
  }
};
```

### 2. With Custom Rules
```js
// metro.config.js
module.exports = {
  transformer: {
    babelTransformerPath: (filename) => {
      if (shouldInstrument(filename)) {
        return require.resolve('./transformer.js');
      }
      return require.resolve('metro-react-native-babel-transformer');
    }
  }
};
```

## Best Practices

1. **Cache Management**
   - Enable Metro caching
   - Use selective tracking
   - Clear cache when updating configurations

2. **Performance**
   - Track only necessary components
   - Use batched logging
   - Enable experimental features carefully

3. **Integration**
   - Test configuration changes in development
   - Monitor build times
   - Watch memory usage

## Command Reference

```bash
# Start Metro with coverage tracking
npm run metro:start

# Build with instrumentation
npm run metro:build

# Clear Metro cache
npm run metro:clean

# Verify configuration
npm run metro:config-check
```

## Related Documentation
- [Main Integration Guide](./METRO_INTEGRATION.md)
- [Component Tracking](./COMPONENT_TRACKING.md)
- [Performance Guide](./PERFORMANCE.md)
