const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin")
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require("webpack")

module.exports = {
    mode: "development",
    entry: {
        main: './index.js'
    },
    devServer: {
        index: "index.html",
        publicPath: "/",
        proxy: {
            '/houtai': {
                target: 'http://localhost:3000'
            },
            '/getCaptcha': {
                target: 'http://localhost:3000'
            },
            '/login': {
                target: 'http://localhost:3000'
            }
        }


    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: "[hash].[name].js"
    },
    optimization: {
        splitChunks: {
            name: 'common',
            minSize: 1,
            minChunks: 1,
            maxAsyncRequests: 10,
            chunks: 'async'
        },
    },
    resolve: {
        alias: {
            'houtai': path.resolve(__dirname, "houtai"),
            'img': path.resolve(__dirname, "img")
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ["vue-loader"]
            },
            {
                test: /\.css$/,
                use: ["vue-style-loader", "css-loader"]
            },
            {
                test: /\.js$/,
                use: ["babel-loader?cacheDirectory=true"]
            },
            {
                test: /\.less$/,
                use: ["vue-style-loader", "css-loader", "less-loader"]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            name: '[path][name].[ext]',
                            limit: 8192
                        }
                    }
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader'
            }
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'env': JSON.stringify("environment"),
        }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        // new webpack.DllReferencePlugin({
        //   context: __dirname,
        //   manifest: require("./static/js/vendor-manifest.json"),
        // })
    ]
}
