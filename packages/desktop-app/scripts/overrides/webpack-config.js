//const webpack = require("webpack");
const { ModuleFederationPlugin } = require("webpack").container;

const webpackConfigPath = "react-scripts/config/webpack.config";
const webpackConfig = require(webpackConfigPath);
//const CopyPlugin = require("copy-webpack-plugin");

const path = require('path');

//const babelLoaderExcludeNodeModulesExcept = require('babel-loader-exclude-node-modules-except');
/*
console.log(babelLoaderExcludeNodeModulesExcept([
  '@dynamic-data/oura-mockups'
]));
*/

//console.log("REGEX", new RegExp('node_modules\\' + path.sep + '(?!@dynamic\-data).*'))
const excludeThis = new RegExp('node_modules\\' + path.sep + '(?!@dynamic\-data).*');

//path.resolve(__dirname, 'node_modules/library/polyfill.js'),
const override = config => {

  /*  if (process.env.REACT_APP_MOCKUP_CLIENT && process.env.REACT_APP_MOCKUP_CLIENT === "true") {
     config.plugins.push(new CopyPlugin({
       patterns: [
         { from: "/Users/Tero/react-projects/local-development/prifina-development/widgets/packages/weather-v2/dist", to: "dist" },
         
         // {
         // from: path.resolve(__dirname, "../../../../mockup-assets/widgets"),
         // to: "widgets"
       
       ]
     }));
   } */
  /*
    config.plugins.push(new CopyPlugin({
      patterns: [
        { from: "/Users/Tero/react-projects/local-development/prifina-development/widgets/packages/dry-run-v2/dist", to: "dist" },
        // { from: "/Users/Tero/react-projects/digiole/data-modelling/plugins/packages/json-view/dist", to: "dist" },
        //{ from: "/Users/Tero/react-projects/local-development/prifina-development/widgets/packages/dataTest-v2/dist", to: "dist" },
  
        // { from: "/Users/Tero/react-projects/local-development/prifina-development/widgets/packages/imessage-v2/dist", to: "dist" },
        //{ from: "/Users/Tero/react-projects/digiole/data-modelling/testing/my-app/build", to: "dist" },
  
        //{ from: "/Users/Tero/react-projects/local-development/prifina-development/widgets/packages/cra-starter/build", to: "dist" },
        //{ from: "/Users/Tero/react-projects/local-development/prifina-development/widgets/packages/webpack-starter/dist", to: "dist" },
        //{ from: "/Users/Tero/react-projects/local-development/prifina-development/widgets/packages/weather-v2/dist", to: "dist" },
      ],
    }));
  */

  config.plugins.push(new ModuleFederationPlugin(require("../../modulefederation.config.js")));
  /*
  config.plugins.push(new CopyPlugin({
    patterns: [
      { from: "../../../plugins/packages/json-view/dist", to: "dist" },
    ],
  }));
  */
  //config.output.publicPath = "auto";
  /*
  config.resolve.alias = {
    "oura-mockups": require.resolve("@dynamic-data/oura-mockups")
  }
  */
  /*
  config.resolve.fallback = {
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    stream: require.resolve("stream-browserify"),
  };
  resolve: {
        alias: { react: require.resolve("react") }
    },
    'react': require.resolve('./node_modules/react'),
'react-dom': require.resolve('./node_modules/react-dom'),
  */
  //config.resolve.fallback = { "http": false, "https": false, "crypto": false, "path": false, "stream": false, "os": false }
  /*
  config.resolve.fallback = {
    "http": false, "https": false, stream: require.resolve("stream-browserify"),
    buffer: require.resolve("buffer"),
  }
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
    new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
      const mod = resource.request.replace(/^node:/, "");
      switch (mod) {
        case "buffer":
          resource.request = "buffer";
          break;
        case "stream":
          resource.request = "readable-stream";
          break;
        default:
          throw new Error(`Not found ${mod}`);
      }
    }),
  );
  */
  //config.ignoreWarnings = [/Failed to parse source map/];
  //config.devtool = 'cheap-module-source-map';
  /*
    config.resolve.fallback = {
      url: require.resolve("url"),
      fs: require.resolve("graceful-fs"),
      buffer: require.resolve("buffer"),
      stream: require.resolve("stream-browserify"),
  };
  */

  //config.output.clean = true;
  // seems babel 9 & webpack5 requires this babel-loader... 
  /* 
    config.module.rules.push({
      // Test for a polyfill (or any file) and it won't be included in your
      // bundle
      //test: path.resolve(__dirname, 'node_modules/library/polyfill.js'),
      test: /\.(tro|1js)$/,
      use: 'null-loader',
    });
   */

  /* 
  config.module.rules = [
    {
      // Test for a polyfill (or any file) and it won't be included in your
      // bundle
      //test: path.resolve(__dirname, 'node_modules/library/polyfill.js'),
      test: /\.(tro|1js)$/,
      use: 'null-loader',
    },
    {
      test: /\.(jpg|png)$/,
      use: {
        loader: 'url-loader',
      },
    },
    {
      test: /\.m?js$/,
      exclude: [/node_modules/],
   
      loader: 'babel-loader',
      options: {
        presets: [
          ['@babel/preset-env', { targets: "defaults" }], "@babel/preset-react"
        ]
      }

    }

  ] */

  // config.module = {
  //   rules: [{
  //     test: /\.js$/,
  //     exclude: /node_modules/,
  //     use: {
  //       loader: 'babel-loader',
  //     }
  //   }]
  // };

  //config.resolve.alias['/\.(tro|1js)$/'] = false;


  //console.log("WEBPACK ", JSON.stringify(config));
  return config;
};

require.cache[require.resolve(webpackConfigPath)].exports = env => override(webpackConfig(env));

module.exports = require(webpackConfigPath);
