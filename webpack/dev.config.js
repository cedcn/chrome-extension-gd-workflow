const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')

const config = {
  devtool: 'source-map',
  mode: 'development',
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.prod$/),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
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
        test: /\.less|\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
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

const devConfig = {
  entry: {
    options: path.join(__dirname, '../chrome/extension/options'),
    popup: path.join(__dirname, '../chrome/extension/popup'),
    'matrix-content': path.join(__dirname, '../chrome/extension/matrix-content'),
    'published-form-content': path.join(__dirname, '../chrome/extension/published-form-content'),
    'published-form-inject': path.join(__dirname, '../chrome/extension/published-form-inject'),
  },
  output: {
    path: path.join(__dirname, '../dev/js'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js',
  },
  ...config,
}

const backgroundDevConfig = {
  target: 'webworker',
  entry: {
    background: path.join(__dirname, '../chrome/extension/background'),
  },
  output: {
    path: path.join(__dirname, '../dev'),
    filename: '[name].js',
  },
  ...config,
}

module.exports = [devConfig, backgroundDevConfig]
