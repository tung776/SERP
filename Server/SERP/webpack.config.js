var path = require('path');
const webpack = require('webpack');

module.exports = {
    // devtool: 'eval-source-map',
    entry: './src/client.js',
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
    plugins: [
       
        new webpack.optimize.OccurrenceOrderPlugin (),
        new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
        }),
        new webpack.optimize.UglifyJsPlugin()
    ]
}