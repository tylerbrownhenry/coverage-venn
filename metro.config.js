const { getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  
  return {
    ...config,
    transformer: {
      ...config.transformer,
      babelTransformerPath: require.resolve('./src/instrumentation/metro/transformer.js'),
      experimentalImportSupport: true,
    },
    resolver: {
      ...config.resolver,
      sourceExts: [...config.resolver.sourceExts, 'tsx', 'ts'],
      extraNodeModules: new Proxy({}, {
        get: (target, name) => path.join(__dirname, `node_modules/${name}`)
      })
    },
    watchFolders: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules')
    ]
  };
})();
