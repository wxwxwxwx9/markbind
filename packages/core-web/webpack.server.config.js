/* eslint-env node */
const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const config = require('./webpack.common.js');

module.exports = merge(config, {
  // target: 'node',
  // devtool: '#source-map',
  // entry: path.join(__dirname, 'src', 'MarkBindVue.js'),
  entry: './src/MarkBindVue.js',
  output: {
    // filename: 'js/[name].min.js',
    // library: 'MarkBind',
    // libraryExport: 'default',
    filename: 'js/markbindvue.min.js',
    // filename: 'server-bundle.js',
    libraryTarget: 'commonjs2',
    // libraryTarget: 'umd',
  },
  // https://webpack.js.org/configuration/externals/#externals
  // https://github.com/liady/webpack-node-externals
  externals: nodeExternals({
    // do not externalize CSS files in case we need to import it from a dependency
    allowlist: /\.css$/,
  }),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ],
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
  plugins: [
    new VueLoaderPlugin(),
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': 'development',
    //   'process.env.VUE_ENV': '"server"',
    // }),
    // new VueSSRServerPlugin({ filename: 'js/markbindvue.json' }),
  ],
});
