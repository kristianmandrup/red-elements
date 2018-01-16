# Search

Is used to search for specific nodes in a workspace.

## Development

### structure

- `/lib` contains the search logic, as a class `Search`.
- `/test` contains the tests

Currently the constructor expect a context object (`RED`) as the single argument.
We use Dependency Injection of a `RED` singleton object using [InversifyJS](https://github.com/inversify/InversifyJS)

## Requirements

Search requires the use of the common widgets:

- `Searchbox`
- `EditableList`

### testing

The `search` variable is available for all tests and is assigned a fresh `Search` instance before each test is run via:

```js
beforeEach(() => {
  search = create(ctx)
})
```

The `beforeAll` is run once before all the tests. It loads a DOM document into memmory via `readPage('simple')`. See `src/test/setup.js`.
You can override the `simple` page and provide your own:

`readPage('search', __dirname)`

Which will try to load the page from `./app/search.html` relative to the test file.

## Run test

`jest src/search/test/search.test.js`

Ensure coverage is at least 85%
