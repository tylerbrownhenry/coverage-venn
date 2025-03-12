# Metro Integration Guide

## Overview
This guide explains how to integrate the coverage-venn tool with an existing React Native project that uses Metro bundler.

## Prerequisites
- Existing React Native project with Metro
- Metro version ≥ 0.72.0
- Node.js version ≥ 14

## Integration Steps

### 1. Update Your Metro Config
Merge the coverage-venn configuration with your existing metro.config.js:

```js
// Your existing metro.config.js
const { mergeConfig, getDefaultConfig } = require('@react-native/metro-config');
const coverageVennConfig = require('./scripts/coverage-venn/metro.config.js');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  const coverageConfig = await coverageVennConfig();

  return mergeConfig(defaultConfig, {
    transformer: {
      ...coverageConfig.transformer,
      // Preserve your existing transformer settings
      babelTransformerPath: coverageConfig.transformer.babelTransformerPath,
    },
    resolver: {
      ...coverageConfig.resolver,
      // Keep your existing resolver settings
      sourceExts: [...defaultConfig.resolver.sourceExts, ...coverageConfig.resolver.sourceExts],
    }
  });
})();
```

### 2. Configure Component Tracking
Add to your babel.config.js:

```js
module.exports = {
  // ...your existing presets
  plugins: [
    // ...your existing plugins
    ['./scripts/coverage-venn/src/instrumentation/babel/component-tracker.ts', {
      trackingEnabled: process.env.COVERAGE_TRACKING === 'true'
    }]
  ]
};
```

### 3. Environment Setup
Add to your .env file:
```bash
COVERAGE_TRACKING=true
COVERAGE_VENN_CONFIG_PATH=./scripts/coverage-venn/config/coverage.config.js
```

### 4. Package Scripts
Add to your package.json:
```json
{
  "scripts": {
    "start:coverage": "COVERAGE_TRACKING=true react-native start",
    "build:coverage": "COVERAGE_TRACKING=true react-native bundle"
  }
}
```

## Usage with Existing Project

### Development Mode
```bash
# Start Metro with coverage tracking
npm run start:coverage

# Run your app normally
npm run ios # or npm run android
```

### Production Build
```bash
# Bundle with coverage tracking
npm run build:coverage
```

## Troubleshooting

### Common Issues

1. **Metro Transformer Conflicts**
```js
// If you see transformer conflicts, merge them explicitly:
module.exports = {
  transformer: {
    babelTransformerPath: (filename) => {
      if (filename.includes('node_modules')) {
        return require.resolve('metro-react-native-babel-transformer');
      }
      return require.resolve('./scripts/coverage-venn/src/instrumentation/metro/transformer.js');
    }
  }
};
```

2. **Multiple Babel Configurations**
```js
// In your root babel.config.js
module.exports = {
  overrides: [{
    test: /coverage-venn\/.*\.tsx?$/,
    plugins: [
      './scripts/coverage-venn/src/instrumentation/babel/component-tracker.ts'
    ]
  }]
};
```

### Performance Impact
- Coverage tracking adds minimal overhead in development
- Disable tracking in production by removing the plugin
- Use selective tracking for specific components:

```js
// coverage.config.js
module.exports = {
  tracking: {
    selective: true,
    include: [
      'src/features/**/*.tsx',
      'src/components/**/*.tsx'
    ],
    exclude: [
      '**/node_modules/**',
      '**/__tests__/**'
    ]
  }
};
```

## Best Practices

1. **Selective Instrumentation**
   - Only track components you need coverage for
   - Exclude third-party components
   - Use path patterns to control scope

2. **Performance Optimization**
   - Enable tracking only during test runs
   - Use batch logging for high-frequency components
   - Implement caching for repeated operations

3. **Integration with CI/CD**
   - Add coverage analysis to your build pipeline
   - Set up automatic reporting
   - Configure failure thresholds

## Related Configuration

See also:
- [Main README.md](../README.md)
- [Coverage Configuration](../config/coverage.config.js)
- [Babel Plugin Documentation](../src/instrumentation/babel/README.md)
