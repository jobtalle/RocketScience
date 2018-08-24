const path = require('path'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      ExtractTextPlugin = require("extract-text-webpack-plugin"),
      UglifyJsPlugin = require('uglifyjs-webpack-plugin');;

module.exports = {
    devtool: 'source-map',
    target: 'web',
    entry: './src/app/main.js',
    output: {
        filename: 'rocketScience.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                use: [{ loader: 'css-loader', options: {minimize: true, url: false} }]
            })
        }]
    },
    optimization: {
        minimize: true,
        minimizer: [new UglifyJsPlugin({
            include: /\.js$/
        })]
    },
    node: {
        fs: 'empty'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/views/main.html'
        }),
        new ExtractTextPlugin('style.css')
    ]
};