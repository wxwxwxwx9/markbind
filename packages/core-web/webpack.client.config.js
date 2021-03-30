/* eslint-env node */
const path = require('path');
const { merge } = require('webpack-merge');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const config = require('./webpack.common.js');

module.exports = merge(config, {
  entry: {
    markbind: path.join(__dirname, 'src', 'index.js'),
  },
  output: {
    filename: 'js/[name].min.js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules|vue\/src|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
        use: [
          {
            loader: 'babel-loader',
            options: {
              root: __dirname,
              rootMode: 'upward',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
});
