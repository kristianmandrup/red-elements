## [Unreleased]

### Added 
 - Unit test for widget common controller (WIP).
 - Implemented dependency injection with bottlejs. get reference from (https://github.com/young-steveo/bottlejs).
  install bottlejs using node package command `npm install bottlejs`.
 - created global setup file for bottle js configuration.
 - Implemented dependency injection with Inversifyjs. get reference from (https://github.com/inversify/InversifyJS).
 install inversify using npm command `npm install inversify inversify-inject-decorators reflect-metadata`.
 - created global setup file for inversify js configuration.
 - Code refactored for controllers (WIP).

 ### Converting javascript files to typescript

- Install typescript to project using node package command `npm install typescript`.
- created typscript configuration file.
```js
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "allowUnreachableCode": false,
    "declaration": false,
    "experimentalDecorators": true,
    "lib": [
      "dom",
      "ES2015"
    ],
    "moduleResolution": "node",
    "module": "systemjs",
    "target": [
      "es2015",
      "dom"
    ],
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "jsx": "react",
    "jsxFactory": "h",
    "allowJs": true
  },
  "include": [
    "src"
  ],
  "exclude": [
    "node_modules"
  ]
}
```
- Installed typings jquery to work with typescript file using node package command `npm install @types/jquery`.
- Installed typing jest testing framework to work with typescript file using node package command `npm install @types/jest`.
- Changed jest configuration `(jest.config.js)` to test typescript component test-cases.
```js
{
  "verbose": true,
  automock: false,
  collectCoverage: true,
  coverageReporters: ['lcov'],
  snapshotSerializers: [
    '<rootDir>/node_modules/enzyme-to-json/serializer'
  ],
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'identity-obj-proxy'
  },
  "transform": {
    "^.+\\.(ts|tsx)$": "<rootDir>/preprocessor.js"
  },
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
  ]
}
```
- Installed type d3 to work d3 functionality with typescript using command `npm install @types/d3`.
- created global.d.ts file for typescript global configuration, e.g. jquery, $, etc.
### WIP
- Compiling typescript and solving compilation error along with re-factoring (WIP).
    e.g. Expected 1 arguments, but got 2,
    test, expect, beforeeach... name not found,
    jquery,($) not found.

### Issues facing

- src/tray/controllers/tray.ts(188,80): error TS2339: Property 'preferredWidth' does not exist on type '{tray: JQuery<HTMLElement>;
- src/tray/controllers/tray.ts(197,16): error TS2339: Property 'width' does not exist on type '{ tray:JQuery<HTMLElement>
- src/tray/controllers/tray.ts(81,18): error TS2693: 'Promise' only refers to a type, but is being used as a value here.
- Recursive `redraw()` function call at view.ts file and it leads to maximum call stack full.
- src/workspaces/workspaces.js: this.workspace_tabs.resize is not a function.
- src/canvas/view.ts d3.event getting null.
- facing issue in creating jquery widget factory in typescript file.
- how to get i18n reference? 
- Unable to convert below components to ts due widget refrences of editablelist widget factory:-
  1. node-diff
  2. node-editor
  3. palette
  4. search