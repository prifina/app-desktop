
//const path = require('path');

 module.exports =  {
    entry: './src/index.js',
    output: {
        //path: path.resolve(__dirname, './dist'),
        //filename: '[name].js',
        clean: true,
        library: "@prifina-apps/remote",
        libraryTarget: "umd",
        /*
        library: {
            name:"@prifina-apps/remote",
            type:"umd"
        }
        */
    },
    /*
    experiments: {
        outputModule: true,
    },
    optimization: {
        splitChunks: {
          chunks: 'all',
        },
      },
      */
    plugins: [
       
    ],
    
    module: {
         // https://webpack.js.org/loaders/babel-loader/#root
        rules: [
            {
              //test: /\.m?js$/,
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
           }
        ],
    },

    devtool: 'source-map',
    resolve: {
        //alias: aliases,
        extensions: ['.js', '.jsx', '.json' ],
        modules: ['node_modules']
    },
}