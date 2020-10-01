const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const MinifyHtmlWebpackPlugin = require('minify-html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const JSONMinifyPlugin = require('node-json-minify');

module.exports = {
  module: {
    rules: [
      { 
        test: /\.handlebars$/, 
        loader: "handlebars-loader" 
      },
      {
        test: /\.html$/,
        use: [{ loader: 'html-loader', options: { minimize: true } }],
      },
      {
        test: /\.(png|jpe?g|jpg)/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: './img/[name].[ext]',
              limit: 10000,
            },
          },
          {
            loader: 'img-loader',
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(woff(2)?|eot|ttf|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'webfonts/'
        },
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    filename: 'js/config.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        handlebarsLoader: {}
      }
    }),
    new MinifyHtmlWebpackPlugin({
      beforeCompile: true,
      dest: './src/assets/minified',
      rules: {
        collapseWhitespace: true,
        removeComments: true,
      },
      src: './src/assets/unminified',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/styles.css',
      chunkFilename: 'css/styles.css',
    }),
    new HtmlWebPackPlugin({
      //title: 'Release Notes Administration',
      template: 'src/views/pages/index.handlebars',
      minify: true,
      filename: 'index.html',
    }),
    new HtmlWebPackPlugin({
      template: 'src/views/pages/release.handlebars',
      minify: true,
      filename: 'release.html',
    }),
    new HtmlWebPackPlugin({
      template: 'src/views/pages/item.handlebars',
      minify: true,
      filename: 'item.html',
    }),
    new ManifestPlugin({
      fileName: '../manifesto.json',
    }),
    new CopyWebpackPlugin({
      patterns: [
        /*
        { from: 'src/_data',
          transform: function(content) {
            // minify json
            return JSONMinifyPlugin(content.toString());
          },
          to: ''
        },
        */
        { 
          from: './src/assets/minified',
          to: 'assets' 
        },
      ]
    }),
  ],
};