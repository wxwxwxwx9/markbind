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
  plugins: [new VueLoaderPlugin()],
});
