const title = 'App Orchestrator'

module.exports = {
  page: {
    title: title,
    favicon: 'favicon.ico',
    tabicon: 'red/images/node-red-icon-black.svg'
  },
  header: {
    title: title,
    image: 'red/images/node-red.png',
    action: {
      title: 'login'
    }
  },
  asset: {
    red: (process.env.NODE_ENV == 'development') ? 'red/red.es5.js' : 'red/red.min.js',
    main: (process.env.NODE_ENV == 'development') ? 'red/main.es5.js' : 'red/main.min.js'
  }
};
