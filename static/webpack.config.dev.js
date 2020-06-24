const path = require("path");
let webpack = require("webpack");
let HtmlWebpackPlugin = require("html-webpack-plugin");//一个处理html，并将html打包到别的地方的模板
let MiniCssExtractPlugin = require("mini-css-extract-plugin");//将打包后js中的css代码分离到一个独立的文件
let TerserWebpackPlugin = require('terser-webpack-plugin');
let OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    mode: "development", //production(compression) or development
    entry: {
        home: "./webpack/home.webpack.js",
        login: "./webpack/login.webpack.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),//must be absolute path
        filename: "./js/[name].[hash:8].js" //[name]: the key of entry
    },
    devtool: "source-map",
    watch: false,
    watchOptions: {
        ignored:/(node_modules|bower_components)/,
        aggregateTimeout: 1000
    },
    //externals: {
    //    jquery: 'jQuery'
    //},
    resolve: {
        modules: [
            "node_modules"
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            chunks: ["home"],
            template: "./home.html",
            filename: "./index.html", //absolute path is output.path + filename
            hash: true
        }),
        new HtmlWebpackPlugin({
            chunks: ["login"],
            template: "./login.html",
            filename: "./login.html", //absolute path is output.path + filename
            hash: true
        }),
        new MiniCssExtractPlugin({
            filename: "./style/[name].[hash:8].css", //分配到别的路径
            chunkFilename: "[id].css",
            hash: true
        }),
        new webpack.BannerPlugin("made by h-hg")
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
    }
};