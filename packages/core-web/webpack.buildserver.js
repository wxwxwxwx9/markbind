const { merge } = require('webpack-merge');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const serverConfig = require('./webpack.server.config');

/* eslint-env node */
module.exports = merge(serverConfig, {
  mode: 'production',
  module: {
    // rules: [
    //   {
    //     test: /\.css$/,
    //     use: [
    //       MiniCssExtractPlugin.loader,
    //       'css-loader',
    //     ],
    //   },
    // ],
  },
  optimization: {
    minimizer: [new TerserPlugin(), new OptimizeCssAssetsPlugin()],
  },
  plugins: [
    // new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].min.css',
    }),
  ],
});
