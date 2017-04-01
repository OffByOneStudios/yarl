const path = require('path');
const webpack = require('webpack');
//const ChunkManifestPlugin = require("chunk-manifest-webpack-plugin");
//const WebpackChunkHash = require("webpack-chunk-hash");


function definesFor(env) {
  switch (env.yarltarget) {
    case "browser":
      return {
        YARL_BROWSER: true,
        YARL_ELECTRON: false,
        YARL_NATIVE: false,
        YARL_ENTRYPOINT: env.yarlentry
      }
    case "ebrowser":
      return {
        YARL_BROWSER: true,
        YARL_ELECTRON: true,
        YARL_NATIVE: false,
        YARL_ENTRYPOINT: env.yarlentry
      }
    case "eserver":
      return {
        YARL_BROWSER: false,
        YARL_ELECTRON: true,
        YARL_NATIVE: false,
        YARL_ENTRYPOINT: env.yarlentry
      }
    case "native":
      return {
        YARL_BROWSER: false,
        YARL_ELECTRON: false,
        YARL_NATIVE: true,
        YARL_ENTRYPOINT: env.yarlentry
      }
    case "server":
      return {
        YARL_BROWSER: true,
        YARL_ELECTRON_RENDER: false,
        YARL_NATIVE: false,
        YARL_ENTRYPOINT: env.yarlentry
      }
    default:
      return {
        YARL_BROWSER: true,
        YARL_ELECTRON: false,
        YARL_NATIVE: false,
        YARL_ENTRYPOINT: env.yarlentry
      }
  }
}

module.exports = (env)=> {

  return {
    devtool: 'cheap-module-eval-source-map',
    context: path.resolve(__dirname, 'src'),
    entry: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:3020',
      'webpack/hot/only-dev-server',
      './index.js'
    ],
    output: {
      path: path.resolve(__dirname, "static"),
      publicPath: 'static',
      library: 'yarl',
      filename: "[name].js"
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
          loader: ['babel-loader'],
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
      new webpack.EnvironmentPlugin({
        NODE_ENV: "notproduction"
      }),
      new webpack.DefinePlugin(Object.assign({}, definesFor(env),
        {}
      )),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.js',
        minChunks: function (module) {
           // this assumes your vendor imports exist in the node_modules directory
           return module.context && module.context.indexOf('node_modules') !== -1;
        }
      })
    ],

  }
}
