# Sidebar

`Sidebar` is used to display and manage sidebar (ie. projects).

Each Workspace is a tab, with a canvas for that workspace. One tab/workspace is active.

## Development

### structure

- `/controllers` folder contains the Sidebar logic, converted to a class.
- `/test` folder contains the tests

Currently the constructor expect a context object (`RED`) as the single argument.
We should instead use Dependency Injection of a `RED` singleton object using either:

- [InversifyJS](https://github.com/inversify/InversifyJS)
- [bottlejs](https://github.com/young-steveo/bottlejs)

Alternatively (even better), use [TypeScript](typescriptlang.org) and use a decorator to inject it.

### testing

The `sidebar` variable is available for all tests and is assigned a fresh `Sidebar` instance before each test is run via:

```js
beforeEach(() => {
  sidebar = create(ctx)
})
```

The sidebar context (ie. `RED`), requires a `menu` object. Currently faked to:

```js
let menu = {
  isSelected() {},
  setSelected(id) {}
}
```

Should be a `menu` widget instance instead, ie `new Menu()`.

The `beforeAll` is run once before all the tests. It loads a DOM document into memmory via `readPage('simple')`. See `src/test/setup.js`.
You can override the `simple` page and provide your own:

`readPage('sidebar', __dirname)`

Which will try to load the page from `./app/sidebar.html` relative to the test file.

## Run test

`jest src/sidebar/test/sidebar.test.js`

Ensure coverage is at least 85%
