const {ProvidePlugin} = require('webpack');
const {aliasWebpack, aliasJest} = require('react-app-alias');
const options = {}; // default is empty for most cases

module.exports = function override(config, env) {
  aliasWebpack(options)(config);
  aliasJest(options)(config);
  config.resolve.fallback = {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    path: require.resolve('path-browserify'),
    buffer: require.resolve('buffer'),
    'process/browser': require.resolve('process/browser'),
  };

  config.plugins.push(
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser'
    }),
  );

  return config;
};
