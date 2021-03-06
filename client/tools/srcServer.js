import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import proxy from 'http-proxy-middleware';

import config from '../webpack.config.dev';

const bundler = webpack(config);
browserSync({
  port: 4000,
  ui: { port: 4001 },
  server: {
    baseDir: 'src',

    middleware: [
      historyApiFallback(),
      proxy(['/api', '/docs'], { target: 'http://localhost:3000', changeOrigin: false }),
      webpackDevMiddleware(bundler, {
        publicPath: config.output.publicPath,
        noInfo: true,
        quiet: true,
        stats: {
          assets: false,
          colors: true,
          version: false,
          hash: false,
          timings: false,
          chunks: false,
          chunkModules: false,
        },
      }),
      webpackHotMiddleware(bundler),
    ],
  },
  files: [
    'src/*.html',
  ],
});
