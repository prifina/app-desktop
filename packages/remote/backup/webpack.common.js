const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin =
  require("webpack").container.ModuleFederationPlugin;
const webpack = require("webpack");

const deps = require('./package.json').peerDependencies;

module.exports = {
  module: {
    rules: [
      /*
      {
        test: /\.m?js$/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      */
      {
        test: /.m?js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      
      /*
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      */
    ],
  },
  plugins: [
   
    /*
    new ModuleFederationPlugin({
      name: "mfeApp2",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App",
      },
      shared: [
        {
          react: { singleton: true, requiredVersion: deps['react'] },
          "react-dom/client": { singleton: true,requiredVersion: deps['react-dom'] },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    */
    /*
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),*/
  ],
};