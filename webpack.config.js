const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
console.log('IS DEV: ', isDev)

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const jsLoaders = () => {
  const loaders =  [{
    loader: 'babel-loader',
    options: {
      presets: [
        '@babel/preset-env'
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties'
      ]
    }
  }]
  return loaders
}
const optimization = () => {
  const config =  {}
  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }
  return config
}
const plugins = () => {
  const base = [
    new HTMLWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      collapseWhitespace: isProd
    }),
    new HTMLWebpackPlugin({
      template: './policy.html',
      filename: 'policy.html',
      chunks: ['app']
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist') },
      ]
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    }),
  ]
  return base
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  // entry: ['@babel/polyfill', './index.js'],
  entry: {
    app: './index.js'
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimization: optimization(),
  devServer: {
    port: 3000,
    hot: isDev
  },
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ {
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: isDev,
          }
        }, 'css-loader']
      },
      {
        test: /\.(scss|sass)$/,
        use: [ {
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: isDev,
          }
        }, 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jper|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/images/'
          }
        }]
      },
      {
        test: /\.(ttf|woff|eot)$/,
        use: ['file-loader']
      },
      { test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      }
    ]
  }
}
