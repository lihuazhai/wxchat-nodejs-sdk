/**
 * @file webpack.config.js
 * @author yangxiaoxu
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'src/App.js'),
    output: {
        path: __dirname + '/dist/',
        filename: './[hash]app.js',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        }
    },
    // 服务配置
    devServer: {
        contentBase: path.join(__dirname, 'dist'), //网站的根目录为 根目录/dist
        host: '0.0.0.0',
        port: 3000,
        disableHostCheck: true,
        // host: '192.168.0.103', //如果指定的host，这样同局域网的电脑或手机可以访问该网站,host的值在dos下使用ipconfig获取 
        open: true, // 自动打开浏览器
        compress: true, //压缩
        proxy: {
            '/api': {
                target: "http://127.0.0.1:3003",
                changeOrigin: true
            }
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader'],
                exclude: /\.useable\.less$/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'hello',
            template: 'client/src/layout.tpl.html',
            hash: true, // 会在打包好的bundle.js后面加上hash串
            overlay: true // 这个配置属性用来在编译出错的时候，在浏览器页面上显示错误
        })
    ]
};