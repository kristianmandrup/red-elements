# Red shared

*Red shared* is the node-red runtime and in-memory model, such as the internal node graph being edited, with some code shared between both client and server (backend API) applications.

This module is NOT a lerna project, as it has no local package dependencies in the `red-elements` repo.

## Getting started


```bash
$ npm install
...
```

## Jest with TypeScript

We will be using [ts-jest](https://www.npmjs.com/package/ts-jest) to run Jest tests written in TypeScript

Please note the following Gotchas!

- [using es2015 features in javascript files](https://www.npmjs.com/package/ts-jest#using-es2015-features-in-javascript-files)
- [importing packages written in typescript](https://www.npmjs.com/package/ts-jest#importing-packages-written-in-typescript)

Make sure you use the `jest.config.js` file to configure your Jest settings.

Then just run `jest` normally and it should transpile using your settings before running.

## Q & A

See the [node-red](https://nodered.org/) intro video to get an idea of interface.

Run the [node-red project on github](https://github.com/node-red/node-red)

See [1.0 Roadmap](https://nodered.org/blog/2017/07/17/roadmap-to-1-dot-0) to get a detailed overview of current status and where project is going...

What about references and use of the `RED` global context object which is empty?

See [red-runtime](https://github.com/tecla5/red-runtime) and [red-api](https://github.com/tecla5/red-api) (Express backend API)

Please mock and stub whatever you need to make tests pass. Jest includes advanced mocking capabilities.

## Testing

We use the following testing stack for headless browser testing (E2E) on Travic CI.

`red-elements/packages/red-runtime $ jest test/nodes/node.test.ts`

Note: You need `jest-cli` installed for the project.

`$ npm install -g jest-cli`

Writing jest tests can look sth like this:

```js
test('the best flavor is grapefruit', () => {
  expect(bestLaCroixFlavor()).toBe('grapefruit')
})
```

Please note that any `test/playtime` folder or similar sounding name (`sandbox` etc) is for experimental tests, ie. a sandbox for playing around.. Use any tests here at your own risk, ie. they might be highly unstable.

### Run jest with debugger

```bash
$ node --inspect-brk node_modules/.bin/jest --runInBand jest test/nodes/node.test.ts
```

## Test Setup

Jest and mocks for internal dependencies needed for tests are configured in `test/_setup.ts`

```ts
// ...

jest
  .dontMock('fs')
  .dontMock('jquery')

const $ = require('jquery');
const fs = require('fs')

global.$ = $

global.jQuery = global.$
require('jquery-ui-dist/jquery-ui')

// ...
```

### Faking RED context

The Fake `RED` global context object is configured in `src/_setup/setup.ts`

```ts
@injectable()
export class RED implements IRED {
  public palette: any
  public stack: any
  public comms: any

  // ...
}
```

## Architecture

Most classes extend the `Context` class which provides:

Automatic injection of `RED` global context constant. `RED` is injected as an instance variable on instance creation using a decorator.

Validation methods used to validate key function parameters.

Error/Warning handling via:

- `handleError`
- `logWarning`

Rebinding of methods via `rebind`
Setting of multiple instance vars via `setInstanceVars`

Please use these `Context` helper methods extensively, in order to avoid touching the original code and place more guards (ie. validations) to better track/debug errors.

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
