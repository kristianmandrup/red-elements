# Workspaces

`Workspaces` is used to display and manage workspaces (ie. projects).

Each Workspace is a tab, with a canvas for that workspace. One tab/workspace is active.

## Development

### structure

- `/controllers` folder contains the Workspaces logic, converted to a class.
- `/test` folder contains the tests

Currently the constructor expect a context object (`RED`) as the single argument.
We should instead use Dependency Injection of a `RED` singleton object using either:

- [InversifyJS](https://github.com/inversify/InversifyJS)
- [bottlejs](https://github.com/young-steveo/bottlejs)

Alternatively (even better), use [TypeScript](typescriptlang.org) and use a decorator to inject it.

### testing

The `ws` variable is available for all tests and is assigned a fresh `Workspaces` instance before each test is run via:

```js
beforeEach(() => {
  ws = create(ctx)
})
```

The `beforeAll` is run once before all the tests. It loads a DOM document into memmory via `readPage('simple')`. See `src/test/setup.js`.
You can override the `simple` page and provide your own:

`readPage('workspaces', __dirname)`

Which will try to load the page from `./app/workspaces.html` relative to the test file.

## Run test

`jest src/workspaces/test/workspaces.test.js`

Ensure coverage is at least 85%
