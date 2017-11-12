# Red widgets

## Testing

We use the following testing stack for headless browser testing (E2E) on Travic CI.

`red-elements $ jest src/common/test/controllers/panels.test.js`

## Syntax: Expectations & Globals

- [Expectations](https://facebook.github.io/jest/docs/en/expect.html)
- [Globals](https://facebook.github.io/jest/docs/en/api.html)

```js
test('the best flavor is grapefruit', () => {
  expect(bestLaCroixFlavor()).toBe('grapefruit')
})
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

File under test doing some jQuery ops:

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
