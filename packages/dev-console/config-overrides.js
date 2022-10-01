const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const deps = require('./package.json').dependencies;

module.exports = function override(config) {
  config.resolve.fallback = {
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    stream: require.resolve("stream-browserify"),
  };

  // config.module.rules.push({
  //   test: /\.m?js/,
  //   resolve: {
  //     fullySpecified: false,
  //   },
  // });
  config.plugins.push(
    new ModuleFederationPlugin({
      name: 'host',
      shared: {
        react: { singleton: true, eager:false, requiredVersion: deps['react'] },
        'react-dom': { singleton: true,eager:false,requiredVersion: deps['react'] }
      },
    })
  )

  return config;
};

// module.exports = {
//   webpack: (config, {}) => {
//     config.resolve.alias.https = "https-browserify";
//     config.resolve.alias.http = "http-browserify";
//     config.resolve.alias.stream = "stream-browserify";
//     // config.resolve.alias["https"] = false;
//     // config.resolve.alias["http"] = false;
//     return config;
//   },
//   jest: function (config) {
//     return config;
//   },
//   devServer: function (configFunction) {
//     return function (proxy, allowedHost) {
//       return config;
//     };
//   },
//   paths: function (paths, env) {
//     return paths;
//   },
// };
