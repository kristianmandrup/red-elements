exports.config = {
  bundles: [{
    components: [
      'red-checkbox-set',
      // 'red-editable-list'
    ]
  }],
  collections: [{
    name: '@stencil/router'
  }]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
