const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {path: path.resolve(__dirname, 'dist'), filename: 'bundle.js'},
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          'presets': ['@babel/env', '@babel/preset-react'],
          'plugins':
              [['@babel/plugin-proposal-class-properties', {'loose': true}]]
        }
      },
      {test: /\.css$/, use: ['style-loader', 'css-loader']}
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'public/'),
    port: 3000,
    publicPath: 'http://localhost:3000/dist/',
    hotOnly: true
  },
  resolve: {extensions: ['*', '.js', '.jsx']},
  plugins: [
    // new CopyPlugin([
    //   {from: 'public/index.html'},
    // ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
    })
  ],
};