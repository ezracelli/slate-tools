const fs = require('fs');
const path = require('path');
const SlateConfig = require('@shopify/slate-config');

const config = new SlateConfig(require('../../../../slate-tools.schema'));

const part = {module: {rules: []}};

const babelLoader = {
  test: /\.js$/,
  include: [
    path.join(config.get('paths.theme'), 'src'),
    // path.resolve(__dirname, 'test'),
  ],
  loader: 'babel-loader',
  options: {
    babelrc: false,
    extends: config.get('webpack.babel.configPath'),
  },
};

if (
  fs.existsSync(config.get('webpack.babel.configPath')) &&
  config.get('webpack.babel.enable')
) {
  part.module.rules.push(babelLoader);
}

module.exports = part;
