var path = require('path');
var distPath = path.join(__dirname, 'dist/app');
var srcPath = path.join(__dirname, 'app');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    devServer: {
        hot: true,
        noInfo: false,
        proxy: {
            "/backend/*": {
                target: "http://m.app",
                secure: false,
                host: "m.app",
                changeOrigin: true
            },
            "/fend/*": {
                target: "http://m.app",
                secure: false,
                host: "m.app",
                changeOrigin: true
            },
            "/imgs/*": {
                target: "http://m.app",
                secure: false,
                host: "m.app",
                changeOrigin: true
            },
            "/uploads/*": {
                target: "http://m.app",
                secure: false,
                host: "m.app",
                changeOrigin: true
            }
        },
        historyApiFallback: true
    },
    entry: {
        main: path.join(srcPath, 'bootstrap.js'),
        vendor: ['jquery']
    },
    output: {
        path: distPath,
        publicPath: '/app/',
        filename: "js/[name]-[hash].js"
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        fallback: [path.join(__dirname, '../node_modules')]
    },
    resolveLoader: {
        root: path.join(__dirname, 'node_modules'),
    },
    vue: {
        loaders: {
            scss: ['vue-style-loader', 'css', 'sass'].join('!')
        }
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            include: path.resolve(__dirname, 'app'),
            exclude: /node_modules/,
            query: {
                presets: ['es2015']
            }
        }, {
            test: /\.vue$/,
            loader: 'vue'
        }, {
            test: /\.scss$/,
            exclude: /node_modules/,
            loaders: ["style", "css", "sass?config=otherSassLoaderConfig"]
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        }, {
            test: /\.(png|jpg|gif|svg|woff2?|eot|ttf)(\?.*)?$/,
            loader: 'url',
            query: {
                limit: 10000,
                name: 'fonts/[name].[ext]'
            }
        }]
    },
    plugins: [
        new ExtractTextPlugin('css/[name]-[hash].css'),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'js/vendor-[hash].js'),
        new HtmlWebpackPlugin({
            template: path.join(srcPath, 'template/index.html')
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            "window.$": "jquery",
        })
    ]
};