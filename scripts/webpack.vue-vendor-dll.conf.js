const path = require("path");
const webpack = require("webpack");
const CompressionWebpackPlugin = require("compression-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    vueVendor: ["vue-router", "vue-i18n", "@jambonn/vue-lazyload"],
    hengshuai: ["@hengshuai/helper"]
  },
  output: {
    path: path.join(__dirname, "../public/lib/vendor"),
    filename: "[name].dll-[hash:8].js",
    library: "[name]_[hash]"
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
    new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: require("../public/lib/vendor/vue-manifest.json")
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
