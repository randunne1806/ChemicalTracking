// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
    fallback: {
      async_hooks: require.resolve('async_hooks'),
      zlib: require.resolve('browserify-zlib'), // Install browserify-zlib
      querystring: require.resolve('querystring-es3'), // Install querystring-es3
      path: require.resolve('path-browserify'), // Install path-browserify
      crypto: require.resolve('crypto-browserify'), // Install crypto-browserify
      fs: false, // Set fs to false or use appropriate fallback
      url: require.resolve('url/'), // Install url
      stream: require.resolve('stream-browserify'), // Install stream-browserify
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util/'),
      buffer: require.resolve('buffer/'),
      assert: require.resolve('assert/'),
      net: false,
      tls: false,
    },
  }
};
