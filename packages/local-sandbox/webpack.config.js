const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config({ path: './.env' });

//const path = require('path');

const port = 8080;

module.exports = {
  entry: './src/index',
  mode: 'development',
  devtool: "eval-cheap-source-map",
  devServer: {
    port: port,
    historyApiFallback: true,

    static: {
      //directory: path.join(__dirname, 'public'),  
      //directory: path.join(__dirname, '..','plugins','packages','json-view')
    },

  },
  output: {
    // publicPath: `http://localhost:${port}/`,
    publicPath: 'auto',
    //sourceMapFilename: "[name].js.map"
  },
  module: {
    rules: [
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
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],

          },
        },
      },
      /*  {
         test: /\.js$/,
         enforce: 'pre',
         use: ['source-map-loader'],
       }, */
    ],
  },

  plugins: [

    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
    /*  new webpack.SourceMapDevToolPlugin({
       filename: "[file].map"
     }), */
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
