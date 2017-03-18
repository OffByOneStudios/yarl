const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  context: path.resolve(__dirname, 'src'),
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3020',
    'webpack/hot/only-dev-server',
    './index.js'
  ],


  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'bundle.js',
    publicPath: 'static',
    library: 'yarl',
  },

  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, 'static'),
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|woff2|svg|ttf|woff|eot)(\?.*)?$/,
        loader: "url",
        exclude: /node_modules/
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],

}
