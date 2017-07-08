var path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'eval-source-map',
    entry: {
        bundle:[
        'webpack-hot-middware/src',
        './src/client.js'
        ]},
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'),
        publicPath: '/'
    },
    // watch: true,
    module: {
        loaders: [
            {
                test:/\.js$/,
                exclude: /node_modules/,
                loaders: ['react-hot-loader', 'babel-loader'],
                query: {
                    presets: ['react', 'es2015', 'stage-1']
                }
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin ()
        // new webpack.DefinePlugin({
        // 'process.env': {
        //     NODE_ENV: JSON.stringify('production')
        // }
        // }),
        // new webpack.optimize.UglifyJsPlugin()
    ]
}