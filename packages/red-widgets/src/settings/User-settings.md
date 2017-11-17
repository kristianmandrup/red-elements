# UserSettings

`UserSettings` is used to display and manage user settings

## Development

### structure

- `/controllers` contains user settings logic as a class `UserSettings`
- `/test` contains the tests

Currently the constructor expect a context object (`RED`) as the single argument.
We should instead use Dependency Injection of a `RED` singleton object using either:

- [InversifyJS](https://github.com/inversify/InversifyJS)
- [bottlejs](https://github.com/young-steveo/bottlejs)

Alternatively (even better), use [TypeScript](typescriptlang.org) and use a decorator to inject it.

### testing

The `settings` variable is available for all tests and is assigned a fresh `UserSettings` instance before each test is run via:

```js
beforeEach(() => {
  settings = create(ctx)
})
```

The `beforeAll` is run once before all the tests. It loads a DOM document into memmory via `readPage('simple')`. See `src/test/setup.js`.
You can override the `simple` page and provide your own:

`readPage('settings', __dirname)`

Which will try to load the page from `./app/settings.html` relative to the test file.

## Run test

`jest src/settings/test/user-settings.test.js`

Ensure coverage is at least 85%
