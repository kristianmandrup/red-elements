# TypeSearch

Is used to search for specific nodes by type in a workspace.

## Development

### structure

- `/controllers` contains the type search logic, as a class `TypeSearch`.
- `/test` contains the tests

Currently the constructor expect a context object (`RED`) as the single argument.
We should instead use Dependency Injection of a `RED` singleton object using either:

- [InversifyJS](https://github.com/inversify/InversifyJS)
- [bottlejs](https://github.com/young-steveo/bottlejs)

Alternatively (even better), use [TypeScript](typescriptlang.org) and use a decorator to inject it.

## Requirements

TypeSearch requires the use of the common widgets:

- `Searchbox`
- `EditableList`

### testing

The `ts` variable is available for all tests and is assigned a fresh `TypeSearch` instance before each test is run via:

```js
beforeEach(() => {
  ts = create(ctx)
})
```

The `beforeAll` is run once before all the tests. It loads a DOM document into memmory via `readPage('simple')`. See `src/test/setup.js`.
You can override the `simple` page and provide your own:

`readPage('type-search', __dirname)`

Which will try to load the page from `./app/type-search.html` relative to the test file.

## Run test

`jest src/search/test/type-search.test.js`

Ensure coverage is at least 85%
