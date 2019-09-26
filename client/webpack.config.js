const path = require('path');

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
        options: {presets: ['@babel/env']}
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
};