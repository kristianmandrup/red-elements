module.exports = {
  "verbose": true,
  automock: false,
  collectCoverage: true,
  coverageReporters: ['lcov'],
  snapshotSerializers: [
    '<rootDir>/node_modules/enzyme-to-json/serializer'
  ],
  "unmockedModulePathPatterns": [
    "babel-core"
  ],
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'identity-obj-proxy'
  },
  "transform": {
    "^.+\\.(js|jsx)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.(ts|js|jsx|tsx)$": "<rootDir>/preprocessor.js"
  },
  "transformIgnorePatterns": [
    "<rootDir>/node_modules/(?!@tecla5)",
  ],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json"
  ],
  moduleDirectories: [
    "node_modules",
    "src"
  ],
  "setupFiles": ["jest-localstorage-mock"]
}
