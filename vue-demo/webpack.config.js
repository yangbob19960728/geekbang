const webpack = require('webpack'); //to access built-in plugins

const CopyPlugin = require("copy-webpack-plugin");

const {
    VueLoaderPlugin
} = require('vue-loader')
module.exports = {
    entry: './src/main.js',
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            // 它会应用到普通的 `.js` 文件
            // 以及 `.vue` 文件中的 `<script>` 块
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            // 它会应用到普通的 `.css` 文件
            // 以及 `.vue` 文件中的 `<style>` 块
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    mode: "production",
    plugins: [
        new VueLoaderPlugin(),
        new CopyPlugin({
            patterns: [{
                    from: "src/*.html",
                    to: "[name].[ext]"
                },
            ],
        }),
    ],
};