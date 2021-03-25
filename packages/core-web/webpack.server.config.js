/* eslint-env node */
const path = require('path');
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

const config = require('./webpack.common.js');

module.exports = merge(config, {
  target: 'node',
  devtool: '#source-map',
  entry: path.join(__dirname, 'src', 'MarkBindVue.js'),
  output: {
    // filename: 'js/[name].min.js',
    // library: 'MarkBind',
    // libraryExport: 'default',
    filename: 'js/[name].min.js',
    library: 'MarkBind',
    libraryTarget: 'commonjs2',
  },
  // https://webpack.js.org/configuration/externals/#externals
  // https://github.com/liady/webpack-node-externals
  externals: nodeExternals({
    // do not externalize CSS files in case we need to import it from a dependency
    allowlist: /\.css$/,
  }),
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    //   'process.env.VUE_ENV': '"server"',
    // }),
    new VueSSRServerPlugin(),
  ],
});
