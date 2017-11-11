module.exports = {
  automock: false,
  collectCoverage: true,
  coverageReporters: ['lcov'],
  snapshotSerializers: [
    '<rootDir>/node_modules/enzyme-to-json/serializer'
  ],
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'identity-obj-proxy'
  }
}
