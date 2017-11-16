import {
  readPage,
  ctx as baseCtx,
  RED,
  Search,
  Searchbox
} from './imports'

function create(ctx) {
  return new Search(ctx)
}

let events = {
  on() {}
}
let actions = {
  add() {}
}
let utils = {
  getNodeLabel() {
    return 'my-label'
  }
}
let nodes = {
  eachWorkspace() {},
  eachSubflow() {},
  eachConfig() {},
  eachNode() {}
}

const ctx = Object.assign({
  events,
  actions,
  utils,
  nodes
}, baseCtx)

let search
beforeEach(() => {
  search = create(ctx)
})

beforeAll(() => {
  Searchbox(RED)
  // EditableList(RED)

  document.documentElement.innerHTML = readPage('simple')
})

test('Search: created', () => {
  expect(search).toBeDefined()
})

test('Search: disabled', () => {
  expect(search.disabled).toBeFalsy()
})

test('Search: disable()', () => {
  search.disable()
  expect(search.disabled).toBeTruthy()
})

test('Search: enable()', () => {
  search.disable()
  search.enable()
  expect(search.disabled).toBeFalsy()
})


test('Search: indexNode', () => {
  let n = {
    id: 'x',
    label: 'abc'
  }
  search.indexNode(n)
  // fix
  let indexed = search.index[n.label]
  expect(indexed).toEqual({
    "x": {
      "label": "my-label",
      "node": {
        "id": "x",
        "label": "abc"
      }
    }
  })
})

test('Search: indexWorkspace()', () => {
  search.indexWorkspace()
  expect(search.index).toEqual({})
})
test('Search: search(val) - no searchResults, throws', () => {
  const val = 'hello'
  expect(() => search.search(val)).toThrowError()
})

test.only('Search: search(val) - w searchResults works', () => {
  const val = 'hello'
  // to ensure searchResults initialized
  search.createDialog()
  let results = search.search(val).results
  expect(results).toEqual([])
})

test('Search: ensureSelectedIsVisible', () => {})
test('Search: createDialog', () => {})
test('Search: reveal', () => {})
test('Search: show', () => {})
test('Search: hide', () => {})
