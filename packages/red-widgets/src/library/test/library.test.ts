import {
  RED,
  readPage,
  ctx as baseCtx,
  Library
} from './imports'

// TODO:
// investigate legacy Library
// to figure out which class to use in each case
// set to real instance for each!
// See red-runtime
let actions = {
  add() {}
}
let events = {
  on() {}
}
let settings = {
  theme() {}
}
// use a Nodes instance (see runtime)
let nodes = {
  createExportableNodeSet() {}
}
let view = {
  selection() {
    return {
      nodes: [{
        id: 'first-node'
      }]
    }
  }
}

let ctx = Object.assign({
  actions,
  events,
  settings,
  nodes,
  view
}, baseCtx)

function create(ctx) {
  document.body.innerHTML =readPage('library',__dirname);
  return new Library(ctx)
}

let library
beforeEach(() => {
  library = create(ctx)
})

test('Library: create', () => {
  expect(typeof library.exportToLibraryDialog).toBe('object')
})

// TODO: should be set to timeout if callback not called within 1s
test('Library: loadFlowLibrary', () => {
  let done = (err, result) => {
    expect(result).toBeDefined()
    expect(err).not.toBeDefined()
  }
  // async?
  let loaded = library.loadFlowLibrary(done)
  // makes AJAX call to get JSON data
  // updates UI

  // use jest to test UI update
})

test('Library: createUI', () => {
  let options = {editor:{setText:{}},ctx:ctx}
  library.createUI(options)

  expect(typeof library.ui).toBe('object')
  // use jest to test UI update of editor
})

test('Library: exportFlow', () => {
  let options = {}
  library.exportFlow()

  // use jest to test UI update of editor
})
