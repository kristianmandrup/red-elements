# Palette

The palette of available nodes that can be used on the canvas.
The nodes are grouped by category, such as `io` nodes etc.

## Development

### structure

- `/controllers` contains the palette logic, as a class `Palette`.
- `/test` contains the tests

Currently the constructor expect a context object (`RED`) as the single argument.
We should instead use Dependency Injection of a `RED` singleton object using either:

- [InversifyJS](https://github.com/inversify/InversifyJS)
- [bottlejs](https://github.com/young-steveo/bottlejs)

Alternatively (even better), use [TypeScript](typescriptlang.org) and use a decorator to inject it.

## Requirements

Palette requires the use of the common widgets:

- `Popover`
- `Tabs`
- `Searchbox`
- `EditableList`

Palette requires a rather complex `RED` context (runtime) object with the following objects:

```js
let ctx = Object.assign({
  actions,
  popover,
  tabs,
  text,
  events,
  settings,
  userSettings,
  nodes,
  view
}, baseCtx)
```

Currently these are all faked to the minimum required to run tests.
Ideally each of these should be an instance of the relevant type, such as `new Tabs()` for the `tabs` entry.

For some of the entries, such as `actions`, `events` etc. find the relevant classes in [red-runtime](https://github.com/tecla5/red-runtime)

### testing

The `palette` variable is available for all tests and is assigned a fresh `Palette` instance before each test is run via:

```js
beforeEach(() => {
  palette = create(ctx)
})
```

The `beforeAll` is run once before all the tests. It loads a DOM document into memmory via `readPage`

`readPage('palette', __dirname)`

Which will load the page from `./app/palette.html` relative to the test file.

## Run test

`jest src/palette/test/palette.test.js`

Ensure coverage is at least 85%
