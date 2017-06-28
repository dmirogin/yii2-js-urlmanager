const webpack = require('webpack');
const path = require('path');
module.exports = {
    entry: './src/app.ts',
    output: {
        filename: './build/bundle.js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        })
    ],
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    configFileName : './src/tsconfig.json'
                }
            }
        ]
    }
};