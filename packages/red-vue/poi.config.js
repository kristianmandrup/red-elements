const path = require('path')
const pkg = require('./package')

module.exports = {
  entry: [
    'src/polyfills.js',
    'src/index.js'
  ],
  html: {
    title: pkg.productName,
    favicon: 'favicon.ico',
    tabicon: './images/node-red-icon-black.svg',
    description: pkg.description,
    template: path.join(__dirname, 'index.ejs')
  },
  postcss: {
    plugins: [
      // Your postcss plugins
    ]
  },
  presets: [
    require('poi-preset-bundle-report')()
  ],
  mergeConfig: {
    module: {
      rules: [{
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      }]
    }
  }
}
