# Red widgets

Red widgets contains all the widgets of node-red, refactored as TypeScript classes.
For the first iteration (version), we plan to refactor the code and include good test coverage, then wrap each widget as a [native browser W3C Custom Element](https://www.w3.org/TR/custom-elements/) to build the full node-red editor UI from.

We will then polish and improve the editor as needed to suit our particular use cases.

## Dependencies

- `red-runtime` (in-memory model)
- `red-assets` shared assets such as stylesheets, images, vendor libs etc.

We currently depend on a modified version of `jsonata` library in `@tecla5/red-assets/vendor`.
We will want to upgrade to use the latest `jsonata` version.

The `d3` library used is `v3` but we will want to upgrade to use the latest version `v4`, which has a modular design that consists of smaller modules to avoid loading all of D3.

### Backend API

Some widgets use Ajax (via jQuery `$.ajax`) to make requests to a backend API. We have an Express server backend [red-api](https://github.com/tecla5/red-api) refactored as ES6 classes, but for now simply mock the reponses using [nock](red-widgets) or similar.

## Getting started: red-widgets

Run the script `lerna:update` to ensure all dependency modules are installed, including `@tecla5/red-runtime` a Lerna package (part of the Lerna project).

```bash
red-elements/packages/red-widgets $ npm run lerna:update
...
lerna success Bootstrapped 1 packages
```

Now you should have a `@tecla5/red-runtime` in `node_modules`

Ensure you have `jest-cli` installed so you can run the `jest` binary/executable to run the tests:

`$ npm install -g jest-cli`

Run a test

`$ jest test/actions/actions.test.ts`

Should all pass :)

## Design/Architecture

- `src` contains all the source files in TypeScript
- `test` contains the test files used to test source
- `dist` contains the compiled `.js` files for distribution and compiled test files

## Src architecture

The source code is written in TypeScript. Use the full power, including types and interfaces etc.

### Widget folders

Each widget has a folder, such as `sidebar` for the `Sidebar` widget.
A widget subfolder usually has the following structure:

- `index.ts` exposing widget API such as the main widget classes and interfaces
- `/lib` library code (ie. main logic)
- `/docs` documentation, explaining widget architecture, use, supporting files etc
- `/styles` any styles specific to widget
- `/assets` static assets

### RED

The folder `/red` contains the global `RED` context object (service).
Currently we are only using a fake/mock `RED` object, but we need to use a full (live) one ASAP!

The `Main` class builds the entire `RED` object and should be the way to go for real.

`RED` is currently injected in all classes that subclass `Context`. The `Context` class also contains a lot of useful base functionality such as:

- error handling (via `handleError`)
- logging (turn on via `logging` property)
- validation (via `Validator`)
- and much more...

It would make sense to allow classes to gain all this functionality without injecting RED as well. We thus might need a deeper hierarchy of `BaseContext` and `Context`.

`RED` is actually just a container object for services. We might as well make each service (class) indepently injectable. Then we can specify the exact service requirements for each class via lazy injectors (just like in Angular ans similar frameworks) and avoid polluting with entire RED object each time!

Note that some services have their own service requirements. Injecting services on a per need basis get rid of any problems with circular dependencies as well :)

## Test architecture

Testing is done using `jest` test runner

### Infrastructure

`test/_infra` contains testing infrastructure files, such as:

- test documents
- adds special jquery matchers to jest
- adds globals `$` and `jQuery`
- adds `i18n()` fake jquery widget factory method

Test documents (in `_infra/document`) are used to have a DOM available to test specific widgets that rely on pre-existing minimal DOM structure.

To use a test document use `readPage` to read the document and set the `innerHTML` of the document in a `beforeAll`:

```js
beforeAll(() => {
  document.documentElement.innerHTML = readPage('simple')
})
```

Documentation of the general test setup can be found in the `red-runtime` project

## Testing

See the [Test](https://github.com/kristianmandrup/red-elements/blob/major-refactor/packages/red-widgets/docs/Test.md) document for testing details

Note that the test are run from `dist`. Running:

`$ jest test/actions/actions.test.ts`

Will actually run the equivalent `.js` file in `dist`

`$ jest dist/test/actions/actions.test.js`

Ensure files in dist reflect your latest update. Ensure you have setup a task to auto-compile your .ts files to `/dist` folder on any change.

Note: You might also want to sometimes clean the `dist` folder to ensure you don't have leftover files from refactoring file names and locations.

## Widgets

The following should provide an overview of all the widgets that form the NodeRed UI

- `actions` - editor actions
- `app` - the full editor UI app
- `clipboard` - copy nodes to clipboard
- `canvas` - canvas to draw nodes on (via D3)
- `common` - base widgets such as `Panel`, `Menu`, `Dropdown` etc.
- `context` - base class for all widgets
- `deploy` - deploy nodes for running on server
- `header` - header of editor (logo, session, main menu)
- `keyboard` - editor keyboard control and shortcuts
- `library` - node libraries
- `main` - main editor area (palette, canvas, sidebar) and setup of all widgets used
- `node-diff` - node difference display
- `node-editor` - form to edit node properties
- `notifications` - notify user on events
- `palette` - palette of nodes available for canvas
- `red` - RED context object (injected on all widgets)
- `search` - search for nodes
- `settings` - user settings
- `sidebar` - sidebar with tabs, incl. console output of running node flow
- `state` - current editor state?
- `text` - text formatting
- `touch` - touch specific widgets such as radial menu
- `tray` - tray with info
- `user` - user session login/logout
- `utils` - various utility functions
- `workspaces` - workspaces of node configurations

Please also see the [1.0 Roadmap](https://nodered.org/blog/2017/07/17/roadmap-to-1-dot-0) and the NodeRed videos online to get a full impression of the UI.

## Lerna project

*red-widgets* is a lerna package, part of a [lerna](https://lernajs.io/) project.

The full UI project contains multiple inter-related packages that can be managed as a unit.

See [Lerna Getting Started](https://lernajs.io/#getting-started) for typical development workflow.

The essential `lerna` npm scripts:

```json
"lerna:bootstrap": "lerna bootstrap --scope @tecla5/red-widgets",
"lerna:update": "npm run lerna:clean && npm run lerna:bootstrap",
```

To update dependencies, just run:

`red-elements/packages/red-widgets $ npm run lerna:update`

## Windows setup

Please use [docker for windows](https://www.docker.com/docker-windows) to setup a unix environment (VM) to work in.

If for any reason you are trying to run this on a Windows OS directly, we have included the following scripts: (Not yet tested, modify as needed)

```json
"clean:win": "npm run clean:lock | clean:modules",
"clean:lock": "del /s /f /q package-lock.json.lock",
"clean:modules": "del /s /f /q node_modules/*",
"link:shared": "npm link @tecla5/red-widgets"
```

You need to somehow clean the project, by removing `package.json.lock` and all module folders under `node_modules` and then run `lerna:bootstrap`

```bash
$ npm run clean:win
...

$ npm run lerna:bootstrap
... bootstrapped
```

## Jest with TypeScript

We will be using [ts-jest](https://www.npmjs.com/package/ts-jest) to run Jest tests written in TypeScript

Please note the following Gotchas!

- [using es2015 features in javascript files](https://www.npmjs.com/package/ts-jest#using-es2015-features-in-javascript-files)
- [importing packages written in typescript](https://www.npmjs.com/package/ts-jest#importing-packages-written-in-typescript)

Make sure you use the `jest.config.js` file to configure your Jest settings.

Then just run `jest` normally and it should transpile using your settings before running.

## Babel config

If you get Syntax error on `import`, try adding `transform-runtime` to `.babelrc`

```json
  "plugins": [
    ["transform-runtime", {
      "polyfill": false,
      "regenerator": true
    }]
  ]
```

## Q & A

Where is the code logic of all the components of which we are about to write jest tests? Like header’s path is `red-widget/src/header`

Where are the basic widgets such as `Panel`, `Menu` etc.?

- The most basic components can all be found under `src/common`. They are the basic building blocks.

See the [node-red](https://nodered.org/) intro video to get an idea of interface.

Run the [node-red project on github](https://github.com/node-red/node-red)

See [1.0 Roadmap](https://nodered.org/blog/2017/07/17/roadmap-to-1-dot-0) to get a detailed overview of current status and where project is going...

What about references and use of the `RED` global context object?

Currently the tests are injecting a fake (mocked) `RED` global context object into all classes. We will shortly use the real `RED` object (as per the `node-red` project) once we have that implemented and tested!

Please mock and stub whatever you need to make tests pass. Jest includes advanced mocking capabilities.

## Advanced testing

We use the following testing stack for headless browser testing (E2E) on Travic CI.

`red-elements/packages/red-widgets $ jest src/common/test/controllers/panels.test.js`

## Syntax: Expectations & Globals

- [Expectations](https://facebook.github.io/jest/docs/en/expect.html)
- [Globals](https://facebook.github.io/jest/docs/en/api.html)

Note: You need `jest-cli` installed for the project.

```js
describe('sum', () => {
  it('adds 1 + 1 = 2', () => {
    expect(1 + 1).toBe(2)
  })
})

// or using test

test('the best flavor is grapefruit', () => {
  expect(bestLaCroixFlavor()).toBe('grapefruit')
})
```

Warning: Please note that jest seems to break if you put any arguments in the test function, ie. such as `done` cb here

```js
test('sum: 1+2 = 2', done => {
  expect(1 + 1).toBe(2)
})
```

### Troubleshooting

Run jest with debugger

```bash
$ node --inspect-brk node_modules/.bin/jest --runInBand test/playtime/simple.test.js
```

### Jest tooling

- [VS Code jest plugin](https://github.com/orta/vscode-jest) - just AWESOME!!!

### Jest stack

- [Jest next generation testing](https://codeburst.io/jest-the-next-generation-testing-8a6ee7c14656)
- [Jest JQuery tutorial](https://facebook.github.io/jest/docs/en/tutorial-jquery.html)
- [Jest & jQuery for testing](https://www.phpied.com/jest-jquery-testing-vanilla-app/)
- [Unit testing beginners guide](https://www.jstwister.com/post/unit-testing-beginners-guide-testing-functions/)
- [UI testing with Jest and Puppeteer](https://www.valentinog.com/blog/ui-testing-jest-puppetteer/)
- [Jest Egghead tutorial videos](https://egghead.io/playlists/testing-javascript-with-jest-a36c4074)
- [Migrating to Jest](https://blog.kentcdodds.com/migrating-to-jest-881f75366e7e)

`npm i -D jest babel-jest enzyme-to-json identity-obj-proxy jest-jquery-matchers`

### jest jQuery testing

The thing about Jest is that it mocks everything. Which is priceless for unit testing. But it also means you need to declare when you don't want something mocked. Starting the new test with:

```js
jest
  .dontMock('fs')
  .dontMock('jquery');

var $ = require('jquery');
var html = require('fs')
  .readFileSync('./app.html').toString();
```

Test doing some jQuery operations:

```js
const $ = require('jquery');

$('#button').click(() => {
  const loggedText = 'Logged ' + (user.loggedIn ? 'In' : 'Out');
  $('#username').text(user.fullName + ' - ' + loggedText);
});
```

The test:

```js
test('displays a user after a click', () => {
  // Set up our document body
  document.body.innerHTML =
    '<div>' +
    '  <span id="username" />' +
    '  <button id="button" />' +
    '</div>';

  // This module has a side-effect
  require('../displayUser');
  const $ = require('jquery');

  // Use jquery to emulate a click on our button
  $('#button').click();

  // Assert that the fetchCurrentUser function was called, and that the
  // #username span's inner text was updated as we'd expect it to.
  expect(fetchCurrentUser).toBeCalled();
  expect($('#username').text()).toEqual('Johnny Cash - Logged In');
});
```

Special jQuery assertions :)

```js
let el = $('#username')
expect(el.text()).toEqual('Johnny Cash - Logged In');
```

Becomes

```js
let el = $('#username')
expect(el).toHaveText('Johnny Cash - Logged In');
```

A little nicer on the eye :)

```bash
toExist
toHaveLength
toHaveId
toHaveClass
toHaveTag
toHaveAttr
toHaveProp
toHaveText
toHaveData
toHaveValue
toHaveCss
toBeChecked
toBeDisabled
toBeEmpty
toBeHidden
toBeSelected
toBeVisible
toBeFocused
toBeInDom
toBeMatchedBy
toHaveDescendant
toHaveDescendantWithText
```

## License

Copyright 2018 Tecla5