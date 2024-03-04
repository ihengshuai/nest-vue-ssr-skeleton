const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    vue: ["vue"]
  },
  output: {
    path: path.join(__dirname, "../public/lib/vendor"),
    filename: "[name].dll-[hash:8].js",
    library: "[name]_[hash]" // vendor.dll.js中暴露出的全局变量名
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
      }
    ]
  },
  plugins: [
    // 清除之前的dll文件
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, "../public/lib/vendor")]
    }),
    new webpack.DllPlugin({
      path: path.join(__dirname, "../public/lib/vendor", "[name]-manifest.json"),
      name: "[name]_[hash]",
      context: process.cwd()
    }),
    new CompressionWebpackPlugin({
      algorithm: "gzip",
      test: /\.js$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
};
