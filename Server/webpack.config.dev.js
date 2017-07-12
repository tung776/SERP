var path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'eval-source-map',
    entry: {
        bundle:[
            './Server/src/client.js'
        ]},
    output: {
        // filename: 'bundle.js',
        path: path.resolve(__dirname, 'Server/public'),
        publicPath: '/'
    },
    watch: true,
    module: {
        loaders: [
            {
                test:/\.js$/,
                exclude: /node_modules/,
                loaders: ['react-hot-loader', 'babel-loader'],
                include: path.join(__dirname, 'src'),
                // query: {
                //     presets: ['react', 'es2015', 'stage-1']
                // }
            }
        ]
    },
    // resolve: {
    //     extentions: ['', '.js']
    // },
    node: {
        net: 'empty',
        dns: 'empty'
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.optimize.OccurrenceOrderPlugin ()
        // new webpack.DefinePlugin({
        // 'process.env': {
        //     NODE_ENV: JSON.stringify('production')
        // }
        // }),
        // new webpack.optimize.UglifyJsPlugin()
    ]
}