const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')

const prodConfig = {
  entry: {
    options: path.join(__dirname, '../chrome/extension/options'),
    popup: path.join(__dirname, '../chrome/extension/popup'),
    'matrix-content': path.join(__dirname, '../chrome/extension/matrix-content'),
    'published-form-content': path.join(__dirname, '../chrome/extension/published-form-content'),
    'published-form-inject': path.join(__dirname, '../chrome/extension/published-form-inject'),
  },
  mode: 'production',
  output: {
    path: path.join(__dirname, '../build/js'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js',
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.dev$/),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                getLocalIdent: (context, localIdentName, localName, options) => {
                  if (context.resourcePath.includes('antd')) {
                    return localName
                  }
                },
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer],
            },
          },
        ],
      },
    ],
  },
}

const backgroundProdConfig = {
  target: 'webworker',
  mode: 'production',
  entry: {
    background: path.join(__dirname, '../chrome/extension/background'),
  },
  output: {
    path: path.join(__dirname, '../build'),
    filename: '[name].js',
  },
}

module.exports = [prodConfig, backgroundProdConfig]
