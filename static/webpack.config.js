const path = require("path");
let webpack = require("webpack");
let HtmlWebpackPlugin = require("html-webpack-plugin");//一个处理html，并将html打包到别的地方的模板
let MiniCssExtractPlugin = require("mini-css-extract-plugin");//将打包后js中的css代码分离到一个独立的文件
let TerserWebpackPlugin = require('terser-webpack-plugin');
let OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

let miniHTMLOptions = {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true
};
module.exports = {
    mode: "production",
    entry: {
        home: "./webpack/home.webpack.js",
        login: "./webpack/login.webpack.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),//must be absolute path
        filename: ".js/[name].[hash:8].js" //[name]: the key of entry
    },
    resolve: {
        modules: [
            "node_modules"
        ]
    },
    //插件的书写没有顺序
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ["home"],
            template: "./home.html",
            filename: "./index.html", //absolute path is output.path + filename
            hash: true,
            minify: miniHTMLOptions 
        }),
        new HtmlWebpackPlugin({
            chunks: ["login"],
            template: "./login.html",
            filename: "./login.html", //absolute path is output.path + filename
            hash: true,
            minify: miniHTMLOptions
        }),
        new MiniCssExtractPlugin({
            filename: "./style/[name].[hash:8].css", //分配到别的路径
            chunkFilename: "[id].css",
            hash: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    MiniCssExtractPlugin.loader,//"style-loader", 将打包后的js代码中的css代码插入到head
                    "css-loader",//处理@import等语句
                    "postcss-loader",//处理css前缀
                    "sass-loader"//scss -> css
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/
            }
        ]
    },
    optimization: {
        minimizer:[
            new TerserWebpackPlugin({}),
            new OptimizeCSSAssetsPlugin({})
        ]
    }
};