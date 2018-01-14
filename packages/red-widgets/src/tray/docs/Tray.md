# Tray

The `Tray` is a tray in the editor that can be used to show a slading panel to the left of the right sidebar.

The Tray is used to display the Node diff and the Node editor (dynamic form) used to edit node configurations (ie. the nodes on the canvas).

## Development

### structure

- `/controllers` folder contains the tray logic, converted to a class.
- `/test` folder contains the tests

Currently the constructor expect a context object (`RED`) as the single argument.
We should instead use Dependency Injection of a `RED` singleton object using either:

- [InversifyJS](https://github.com/inversify/InversifyJS)
- [bottlejs](https://github.com/young-steveo/bottlejs)

Alternatively (even better), use [TypeScript](typescriptlang.org) and use a decorator to inject it.

### testing

The `tray` variable is available for all tests and is assigned a fresh `Tray` instance before each test is run via:

```js
beforeEach(() => {
  tray = create(ctx)
})
```

The `beforeAll` is run once before all the tests. It loads a DOM document into memmory via `readPage('simple')`. See `src/test/setup.js`.
You can override the `simple` page and provide your own:

`readPage('tray', __dirname)`

Which will try to load the page from `./app/tray.html` relative to the test file.

## Run test

`jest src/tray/test/tray.test.js`

Ensure coverage is at least 85%
