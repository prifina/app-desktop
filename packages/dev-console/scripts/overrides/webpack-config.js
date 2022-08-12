const { ModuleFederationPlugin } = require("webpack").container;

const webpackConfigPath = "react-scripts/config/webpack.config";
const webpackConfig = require(webpackConfigPath);
const CopyPlugin = require("copy-webpack-plugin");

const override = config => {
  config.plugins.push(new CopyPlugin({
    patterns: [
      { from: "/Users/Tero/react-projects/digiole/data-modelling/plugins/packages/json-view/dist", to: "dist" },
    ],
  }));
  
  config.plugins.push(new ModuleFederationPlugin(require("../../modulefederation.config.js")));
  /*
  config.plugins.push(new CopyPlugin({
    patterns: [
      { from: "../../../plugins/packages/json-view/dist", to: "dist" },
    ],
  }));
  */
  config.output.publicPath = "auto";

  config.resolve.fallback = {
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    stream: require.resolve("stream-browserify"),
  };

  return config;
};

require.cache[require.resolve(webpackConfigPath)].exports = env => override(webpackConfig(env));

module.exports = require(webpackConfigPath);
