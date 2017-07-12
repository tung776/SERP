var path = require('path');
const webpack = require('webpack');

module.exports = {
    // devtool: 'eval-source-map',
    entry: './Server/src/client.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    // watch: true,
    module: {
        loaders: [
            {
                test:/\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-1']
                }
            }
        ]
    },
    resolve: {
        modules: [
            path.resolve('./src'), 
            'node_modules',
             path.resolve('./Shared')
        ]
    },
    node: {
        net: 'empty',
        dns: 'empty'
    },
    plugins: [
       
        new webpack.optimize.OccurrenceOrderPlugin (),
        new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
    ]
}