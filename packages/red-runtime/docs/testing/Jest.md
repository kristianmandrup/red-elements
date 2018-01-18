# Jest tooling

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