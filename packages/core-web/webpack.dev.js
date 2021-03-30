/* eslint-env node */
const path = require('path');
const testFs = require('fs');
const MFS = require('memory-fs');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const clientConfig = require('./webpack.client.config');
const serverConfig = require('./webpack.server.config');

module.exports = {
  client: (publicPath) => {
    const webpackDevConfig = merge(clientConfig, {
      mode: 'development',
      entry: {
        markbind: ['webpack-hot-middleware/client', path.join(__dirname, 'src', 'index.js')],
      },
      output: {
        publicPath,
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'vue-style-loader',
              'css-loader',
            ],
          },
        ],
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
      ],
    });

    const compiler = webpack(webpackDevConfig);
    return [
      webpackDevMiddleware(compiler, {
        publicPath,
        // serverSideRenader: true,
      }),
      webpackHotMiddleware(compiler),
    ];
  },
  server: (cb) => {
    const readFile = (fs, file) => {
      try {
        // const resolved = `${__dirname}/dist/js/${file}`;
        // const json = vol.toJSON();
        // console.log(json);
        // const resolved = path.join(__dirname, `/dist/js/${file}`);
        // const test = `${__dirname}/README.md`;
        // const test2 = `${__dirname}/dist/js/markbindvue.json`;
        // console.log(test2);
        // console.log(testFs.existsSync(test2) ? 'exists' : 'no');
        // const test3 = '/Users/jamesongwx/Documents/GitHub/markbind/docs/dist/js/markbindvue.json';
        // const test4 = '/Users/jamesongwx/Documents/GitHub/markbind/docs/dist/js/markbindvue.min.js';
        const test5 = '/Users/jamesongwx/Desktop/markbind/test2/dist/js/markbindvue.min.js';
        const read = fs.readFileSync(test5, 'utf-8');
        return read;
      } catch (e) {
        console.log(e);
      }
    };

    let bundle;
    let ready;
    const readyPromise = new Promise((r) => { ready = r; });
    const update = () => {
      if (bundle) {
        ready();
        cb(bundle);
      }
    };

    // watch and update server renderer
    const serverCompiler = webpack(serverConfig);
    const mfs = new MFS();
    serverCompiler.outputFileSystem = mfs;
    serverCompiler.watch({}, (err, stats) => {
      console.log('CHANGED');
      console.log(mfs);
      if (err) throw err;
      stats = stats.toJson();
      if (stats.errors.length) {
        console.log(stats.errors);
        return;
      }

      // read bundle generated by vue-ssr-webpack-plugin
      // bundle = JSON.parse(readFile(mfs, 'markbindvue.json')); // vue-ssr-server-bundle.json
      bundle = readFile(mfs, 'markbindvue.json');
      // console.log(bundle);
      update();
    });

    // return webpackDevMiddleware(serverCompiler);
    return readyPromise;
  },
};
