# Red widgets

The goal is  update the widget tests and include as much test cases as we can for individual components.

## Lerna project

*red-widgets* is a lerna package, part of a [lerna](https://lernajs.io/) project.

The full UI project contains multiple related packages that can be managed as a unit.

See [Lerna Getting Started](https://lernajs.io/#getting-started) for typical development workflow.

The essential `lerna` npm scripts:

```json
"lerna:bootstrap": "lerna bootstrap --scope @tecla5/red-widgets",
"lerna:update": "npm run lerna:clean && npm run lerna:bootstrap",
```

## Windows setup

We have included the following scripts for Windows users.

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

## Getting started

Run the `lerna:update` to ensure all dependency modules are installed, including `@tecla5/red-shared` a Lerna package (part of the Lerna project).

```bash
$ npm run lerna:update
...
lerna success Bootstrapped 1 packages
```

Now you should have a `@tecla5/red-shared` in `node_modules`

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

Where is `Panel` and `Menu` etc.?

- The most basic components can all be found under `src/common`. They are the basic building blocks.

Most of the red-widgets components are in progress?

- All are fully working components/widgets extracted from node-red project.

We are first migrating test to jest of existing jQuery components.
We will start developing new custom elements using StencilJs once we achieve good enough code coverage using jest.

- Yes, exactly

Where can I see all the existing jQuery custom elements which we are planning to upgrade?

See the [node-red](https://nodered.org/) intro video to get an idea of interface.

Run the [node-red project from github](https://github.com/node-red/node-red)

See [1.0 Roadmap](https://nodered.org/blog/2017/07/17/roadmap-to-1-dot-0) to get a detailed overview of current status and where project is going...

What about references and use of the `RED` global context object which is empty?

See [red-runtime](https://github.com/tecla5/red-runtime) and [red-api](https://github.com/tecla5/red-api) (Express backend API)

Please mock and stub whatever you need to make tests pass. Jest includes advanced mocking capabilities.

## Testing

We use the following testing stack for headless browser testing (E2E) on Travic CI.

`red-elements $ jest src/common/test/controllers/panels.test.js`

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

## Troubleshooting

[Timeout - unresolved promise](https://facebook.github.io/jest/docs/en/troubleshooting.html#unresolved-promises)

If you have problem with jest and `Promise`, try:

```js
global.Promise = require.requireActual('promise');
```

Run jest with debugger

```bash
$ node --inspect-brk node_modules/.bin/jest --runInBand test/playtime/simple.test.js
```

## Jest tooling

- [VS Code jest plugin](https://github.com/orta/vscode-jest) - just AWESOME!!!

## Jest stack

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
## Migrating old (Ava) tests

- [jest-codemods](https://github.com/skovhus/jest-codemods)

`npm i -g jest-codemods`

`jest-codemods`

## E2E testing with Karma

An alternative...

### Karma testing stack

- [Travis](https://docs.travis-ci.com/user/getting-started)
- [Karma](https://karma-runner.github.io/1.0/index.html)
- [Webpack](https://webpack.github.io)
- [Webpack dev server](https://webpack.github.io/docs/webpack-dev-server.html)
- [Html Webpack plugin](https://github.com/jantimon/html-webpack-plugin)
- [Html Webpack harddisk plugin](https://github.com/jantimon/html-webpack-harddisk-plugin)

```js
  "karma-sourcemap-loader": "^0.3.7",
  "karma-webpack": "^2.0.6",
  "nightmare": "^2.10.0"
```

### Babel config

In `package.json`

```js
  "babel": {
    "presets": [
      "env"
    ]
  }
```
