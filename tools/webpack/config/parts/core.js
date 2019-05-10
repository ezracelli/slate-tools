require('dotenv').load()

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SlateConfig = require('@shopify/slate-config');
const SlateEnv = require('@shopify/slate-env');
const SlateSectionsPlugin = require('@shopify/slate-sections-plugin');
const config = new SlateConfig(require('../../../../slate-tools.schema'));
const injectLocalesIntoSettingsSchema = require('../utilities/inject-locales-into-settings-schema');
const vueLoaderConfig = require('../utilities/vue-loader.conf');
const { VueLoaderPlugin } = require('vue-loader');

const extractLiquidStyles = new ExtractTextPlugin(
  '[name].styleLiquid.scss.liquid',
);

module.exports = {
  context: config.get('paths.theme.src'),

  output: {
    filename: '[name].js',
    path: config.get('paths.theme.dist.assets'),
    jsonpFunction: 'shopifySlateJsonp',
  },

  resolve: {
    extensions: [
      '.js',
      '.vue',
      '.json',
    ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': config.get('paths.theme.src'),
    },
  },

  resolveLoader: {
    modules: [
      path.resolve(__dirname, '../../../../node_modules'),
      path.resolve(__dirname, '../../../../../../node_modules'),
      path.resolve(__dirname, '../../'),
      path.join(config.get('paths.theme'), 'node_modules'),
    ],
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig,
      },
      {
        test: /\.js$/,
        exclude: config.get('webpack.commonExcludes'),
        loader: 'hmr-alamo-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: { name: '[name].[ext]' },
          },
          { loader: 'img-loader' },
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'file-loader',
        options: { name: '[name].[ext]' },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: { name: '[name].[ext]' },
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: config.get('paths.theme'),
    }),

    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        SHOPIFY_APP_HOST: process.env.SHOPIFY_APP_HOST,
        SHOPIFY_APP_SHOP: process.env.SHOPIFY_APP_SHOP,
        SHOPIFY_THEME_ID: process.env.SHOPIFY_THEME_ID,
      }),
    }),

    new VueLoaderPlugin(),

    extractLiquidStyles,

    new CopyWebpackPlugin([
      {
        from: config.get('paths.theme.src.assets'),
        to: config.get('paths.theme.dist.assets'),
        flatten: true,
      },
      {
        from: config.get('paths.theme.src.config'),
        to: config.get('paths.theme.dist.config'),
        ignore: ['locales/*.json'],
        transform(content, filePath) {
          return injectLocalesIntoSettingsSchema(content, filePath);
        },
      },
      {
        from: config.get('paths.theme.src.layout'),
        to: config.get('paths.theme.dist.layout'),
      },
      {
        from: config.get('paths.theme.src.locales'),
        to: config.get('paths.theme.dist.locales'),
      },
      {
        from: config.get('paths.theme.src.snippets'),
        to: config.get('paths.theme.dist.snippets'),
      },
      {
        from: config.get('paths.theme.src.templates'),
        to: config.get('paths.theme.dist.templates'),
      },
    ]),

    new SlateSectionsPlugin({
      from: config.get('paths.theme.src.sections'),
      to: config.get('paths.theme.dist.sections'),
    }),
  ],
};
