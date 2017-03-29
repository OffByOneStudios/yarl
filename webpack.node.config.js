const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  target: 'node',
  watch: true,
  context: path.resolve(__dirname, 'src'),
  entry: [
    './index.js'
  ],


  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'cli.js',
    publicPath: 'dist',
    library: 'yarl',
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
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      YARL_BROWSER: false,
      YARL_ENTRYPOINT: true
    })
  ],

}
