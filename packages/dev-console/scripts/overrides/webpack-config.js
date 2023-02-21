const { ModuleFederationPlugin } = require("webpack").container;

const webpackConfigPath = "react-scripts/config/webpack.config";
const webpackConfig = require(webpackConfigPath);
//const CopyPlugin = require("copy-webpack-plugin");

const override = config => {
  /*
   config.plugins.push(new CopyPlugin({
     patterns: [
       // { from: "/Users/Tero/react-projects/local-development/prifina-development/widgets/packages/oura-sleep-v2/dist", to: "dist" },
 
       // { from: "/Users/Tero/react-projects/digiole/data-modelling/plugins/packages/json-view/dist", to: "dist" },
       //{ from: "/Users/Tero/react-projects/local-development/prifina-development/widgets/packages/dataTest-v2/dist", to: "dist" },
       //{ from: "/Users/Tero/react-projects/local-development/prifina-development/widgets/packages/dry-run-v2/dist", to: "dist" },
       //{ from: "/Users/Tero/react-projects/local-development/prifina-development/widgets/packages/holistic-health-v2/dist", to: "dist" },
       //{ from: "/Users/Tero/react-projects/local-development/prifina-development/widgets/packages/oura-activity-v2/dist", to: "dist" },
       //{ from: "/Users/Tero/react-projects/local-development/prifina-development/widgets/packages/imessage-v2/dist", to: "dist" },
       //{ from: "/Users/Tero/react-projects/digiole/data-modelling/testing/my-app/build", to: "dist" },
 
       //{ from: "/Users/Tero/react-projects/local-development/prifina-development/widgets/packages/cra-starter/build", to: "dist" },
       //{ from: "/Users/Tero/react-projects/local-development/prifina-development/widgets/packages/webpack-starter/dist", to: "dist" },
       { from: "/Users/Tero/react-projects/local-development/prifina-development/widgets/packages/weather-v2/dist", to: "dist" },
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
  config.resolve.fallback = { "http": false, "https": false }

  config.output.clean = true;
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
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    },
    {
      test: /\.m?js$/,
      exclude: [/node_modules/],
      /*
      exclude: babelLoaderExcludeNodeModulesExcept([
        '@dynamic-data/oura-mockups'
      ]),
       
      */
      //exclude: [excludeThis],
      loader: 'babel-loader',
      options: {
        presets: [
          ['@babel/preset-env', { targets: "defaults" }], "@babel/preset-react"
        ]
      }

    }

  ]

  console.log("WEBPACK ", JSON.stringify(config));
  return config;
};

require.cache[require.resolve(webpackConfigPath)].exports = env => override(webpackConfig(env));

module.exports = require(webpackConfigPath);
