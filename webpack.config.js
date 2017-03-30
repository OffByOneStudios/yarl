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
    path: path.resolve(__dirname, "static"),
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
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
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
  resolve: {
    modules: ["node_modules"]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
        YARL_BROWSER: true,
        YARL_ENTRYPOINT: true
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: function (module) {
    //      // this assumes your vendor imports exist in the node_modules directory
    //      return module.context && module.context.indexOf('node_modules') !== -1;
    //   }
    // })
  ],

}
