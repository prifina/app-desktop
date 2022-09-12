const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const TerserPlugin = require("terser-webpack-plugin");
const path = require('path');

module.exports = merge(common, {
  experiments: {
    outputModule: true,
},
  entry: "./src/index",
  mode: "production",
  /*
  output: {
    //publicPath: "/mfe-app2/",
    publicPath: "auto",
    clean: true,
  },
  */
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js',
    clean: true,
  },
  /*
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  */
});
