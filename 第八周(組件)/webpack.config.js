const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: "./main.js",
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'main.js',
      },
    module: {
        rules: [
            {
                test: /\.js$/, 
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [
                            ["@babel/plugin-transform-react-jsx",
                                {
                                    pragma: "createElement"
                                }
                            ]
                        ]
                    }
                }
            }
        ]
    },
    mode: "development",
    // devServer: {
    //     contentBase: path.join(__dirname, 'dist'),
    //     compress: false,
    //     port: 8080,
    //     open: true,
    // },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CleanWebpackPlugin(),
      ]
}