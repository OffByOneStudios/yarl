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
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:*"
    },

    publicPath: '/',

    proxy: {
      "/vendor/docs": {
        target: "http://atom.io/docs/api/v1.5.0/AtomEnvironment",
        pathRewrite: {"^/vendor/docs" : ""}
      },
      "/vendor/trello": {
        target: "https://trello.com:443",
        pathRewrite: {"^/vendor/trello" : ""}
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        }
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
