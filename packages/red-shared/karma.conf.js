// Karma configuration
const pattern = {
  root: 'test/*.test.js',
  subfolders: 'test/**/*.test.js'
}
const watched = false
const preprocessors = [
  'webpack',
  'sourcemap'
]

module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'chai'],
    reporters: ['progress'],
    port: 9876, // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],
    autoWatch: false,
    // singleRun: false, // Karma captures browsers, runs the tests and exits
    concurrency: Infinity,
    // ... normal karma configuration
    files: [
      // all files ending in "_test"
      // {
      //   pattern: pattern.root,
      //   watched
      // },
      {
        pattern: pattern.subfolders,
        watched,
        served: true,
        included: true
      }
    ],
    coverageReporter: {
      type: 'nyc',
      dir: 'coverage/frontend/'
    },
    preprocessors: {
      // add webpack as preprocessor
      // [pattern.root]: preprocessors,
      [pattern.subfolders]: preprocessors
    },

    webpack: {
      // karma watches the test entry points
      // (you don't need to specify the entry option)
      // webpack watches dependencies
      // webpack configuration
      devtool: 'inline-source-map'
    },

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      stats: 'errors-only'
    }
  })
}
