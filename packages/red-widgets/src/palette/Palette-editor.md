# PaletteEditor

The palette editor for the available nodes.

## Development

### structure

- `/controllers` contains the palette editor logic, as a class `PaletteEditor`.
- `/test` contains the tests

Currently the constructor expect a context object (`RED`) as the single argument.
We should instead use Dependency Injection of a `RED` singleton object using either:

- [InversifyJS](https://github.com/inversify/InversifyJS)
- [bottlejs](https://github.com/young-steveo/bottlejs)

Alternatively (even better), use [TypeScript](typescriptlang.org) and use a decorator to inject it.

## Requirements

PaletteEditor requires the use of the common widgets:

- `Searchbox`
- `EditableList`

### testing

The `palette-editor` variable is available for all tests and is assigned a fresh `PaletteEditor` instance before each test is run via:

```js
beforeEach(() => {
  palette-editor = create(ctx)
})
```

The `beforeAll` is run once before all the tests. It loads a DOM document into memmory via `readPage`

`readPage('palette-editor', __dirname)`

Which will load the page from `./app/palette-editor.html` relative to the test file.

## Run test

`jest src/palette/test/palette-editor.test.js`

Ensure coverage is at least 85%
