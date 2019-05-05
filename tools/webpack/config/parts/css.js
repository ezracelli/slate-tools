const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SlateConfig = require('@shopify/slate-config');
const config = new SlateConfig(require('../../../../slate-tools.schema'));

const isDev = process.env.NODE_ENV === 'development';

const part = {
  module: {
    rules: [],
  },
  plugins: [],
};

const cssRule = {
  test: /\.css$/,
};

const styleLoader = {
  loader: 'style-loader',
  options: {
    hmr: isDev,
  },
};

const cssLoader = {
  loader: 'css-loader',
  // Enabling sourcemaps in styles when using HMR causes style-loader to inject
  // styles using a <link> tag instead of <style> tag. This causes
  // a FOUC content, which can cause issues with JS that is reading
  // the DOM for styles (width, height, visibility) on page load.
  options: {sourceMap: !isDev},
};

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    sourceMap: !isDev,
    plugins: config.get('webpack.postcss.plugins'),
  },
};

const cssVarLoader = {loader: '@shopify/slate-cssvar-loader'};

cssRule.use = [
  ...(isDev ? [styleLoader] : [MiniCssExtractPlugin.loader, cssVarLoader]),
  cssLoader,
  postcssLoader,
];
part.module.rules.push(cssRule);

const cssLoaders = function () {

  // Enabling sourcemaps in styles when using HMR causes style-loader to inject
  // styles using a <link> tag instead of <style> tag. This causes
  // a FOUC content, which can cause issues with JS that is reading
  // the DOM for styles (width, height, visibility) on page load.

  const cssLoader = {
    loader: 'css-loader',
    options: { sourceMap: !isDev },
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      sourceMap: !isDev,
      plugins: config.get('webpack.postcss.plugins'),
    },
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = [ cssLoader, postcssLoader ]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, { sourceMap: !isDev }),
      })
    }

    // extract CSS during production build
    return [
        isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
        ...loaders
      ]
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus'),
  }
}

// Generate loaders for standalone style files (outside of .vue)
const styleLoaders = function () {
  const output = []
  const loaders = cssLoaders()

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader,
    })
  }

  return output
}

module.exports = { module: { rules: styleLoaders() } };
