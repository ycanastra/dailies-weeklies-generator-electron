const path = require('path');
const webpackTargetElectronRenderer = require("webpack-target-electron-renderer");
const nodeExternals = require('webpack-node-externals');

const config = {
  context: __dirname,
  entry: './src/App.jsx',
  output: {
    path: path.join(__dirname, '/app'),
    filename: 'bundle.js',
    publicPath: '/app/'
  },
  externals: [
    nodeExternals()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader'
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader'
      },
      {
        test: /\.json?$/,
        loader: 'json-loader'
      }
    ]
  }
};

config.target = webpackTargetElectronRenderer(config);

module.exports = config;
