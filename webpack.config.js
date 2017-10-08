/* eslint-disable */

const webpack = require('webpack'),
  path = require('path'),
  CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin,
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env = {}) => {
  const isProd = env.production === true;
  const nodeEnv = isProd ? 'production' : 'development';

  console.log(nodeEnv);

  const plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv)
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      hash: 'true',
      template: 'src/index.html',
      inject: 'head'
    }),
    new ExtractTextPlugin({ filename: '[name].bundle.css', allChunks: true })
  ];

  if (isProd) {
    plugins.push(
      new webpack.LoaderOptionsPlugin({ minimize: true, debug: false })
    );
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        compress: {
          warnings: false,
          screw_ie8: true,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true
        },
        output: {
          comments: false
        }
      })
    );
  } else {
    //plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return {
    devtool: isProd ? 'source-map' : 'eval',
    context: path.resolve('./'),
    entry: {
      app: ['./src/index']
    },
    output: {
      path: path.join(__dirname, 'dist'),
      publicPath: '',
      filename: '[name].bundle.js',
      chunkFilename: '[id].chunk.js',
      libraryTarget: 'umd',
      library: 'StickyBottom'
    },
    devServer: {
      open: true,
      contentBase: './',
      noInfo: true,
      port: 3333,
      compress: isProd,
      inline: !isProd
      //hot: !isProd,
    },
    plugins: plugins,
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ['babel-loader'],
          exclude: [/node_modules/]
        },
        // {
        //     test: /\.html$/,
        //     use: ['html-loader'],
        //     exclude: [/node_modules/]
        // },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader'
          }),
          exclude: [/node_modules/]
        },
        {
          test: /\.(sass|scss)$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.(png|gif|jpg)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192
              }
            }
          ],
          exclude: [/node_modules/]
        },
        {
          test: /\.(ttf|eot|svg)$/,
          use: ['file-loader'],
          exclude: [/node_modules/]
        }
      ]
    },
    resolve: {
      extensions: ['.js']
    },
    externals: {}
  };
};

/* eslint-enable */
