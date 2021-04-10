const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require("webpack")
//var BundleAnalyzerPlugin   = require('webpack-bundle-analyzer').BundleAnalyzerPlugin


module.exports = {
    mode: "production",
    entry: {
        vendor: [
            "vue",
            "vue-router",
            "axios",
            "element-ui/lib",
            "element-ui/lib/theme-chalk/index.css"
        ]
    },
    output: {
        path: path.resolve(__dirname, 'static/js'),
        filename: '[name].dll.js',
        library: '[name]'
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
                use: ["babel-loader"]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: 'ziti.[ext]',
                    publicPath: 'https://www.rayvet.cn/cdn-product/'
                }
            }

        ],
    },
    plugins: [
        //new BundleAnalyzerPlugin(),
        new VueLoaderPlugin(),
        new webpack.DllPlugin({
            path: path.join(__dirname, 'static/js', '[name]-manifest.json'),
            name: "[name]"
        })

    ]
}
