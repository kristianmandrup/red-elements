import {
  palette,
  editor,
  RED,
  Searchbox,
  readPage
} from './_palette'

beforeAll(() => {
  // widgets that need to be available
  Searchbox(RED)

  // load document with placeholder elements to create widgets (for testing)
  document.documentElement.innerHTML = readPage('palette-editor', __dirname)
})

test('Editor: semVerCompare', () => {
  expect(editor).toBeDefined()
})
test('Editor: delayCallback(start, callback)', () => {
  const start = 100
  editor.delayCallback(start, () => {
    expect(1).toBeDefined()
  })
})
test('Editor: changeNodeState(id, state, shade, callback)', () => {
  const id = 'x'
  const state = true
  const shadeEl = document.createElement('div')
  const shade = $(shadeEl)

  function callback() {
    expect(1).toBeDefined()
  }
  // Note: uses delayCallback
  editor.changeNodeState(id, state, shade, callback)

})
test('Editor: installNodeModule(id, version, shade, callback)', () => {
  const id = 'marked'
  const version = '1.0'
  const shadeEl = document.createElement('div')
  const shade = $(shadeEl)

  function callback() {
    expect(1).toBeDefined()
  }
  // Note: uses delayCallback
  editor.installNodeModule(id, version, shade, callback)
})
test('Editor: removeNodeModule(id, callback)', () => {
  const id = 'marked'

  function callback() {
    expect(1).toBeDefined()
  }
  // Note: uses delayCallback
  editor.installNodeModule(id, callback)
})
test('Editor: refreshNodeModuleList()', () => {
  let refreshed = editor.refreshNodeModuleList()
  expect(refreshed).toBeDefined()
})
test('Editor: refreshNodeModule(module)', () => {
  let module = {}
  let refreshed = editor.refreshNodeModule(module)
  expect(refreshed).toBeDefined()
})

test('Editor: getContrastingBorder(rgbColor)', () => {
  let rgbColor = `rgba(234,129,283)`
  let border = editor.getContrastingBorder(rgbColor)
  expect(border).toBeDefined()
})
test('Editor: formatUpdatedAt', () => {
  let dateString = '11/11/2017'
  let updated = editor.formatUpdatedAt(dateString)
  expect(updated).toBeDefined()

})
test('Editor: _refreshNodeModule(module)', () => {
  let module = {}
  let refreshed = editor._refreshNodeModule(module)
  expect(refreshed).toBeDefined()
})
test('Editor: filterChange(val)', () => {
  let val = 'Active'
  let filtered = editor.filterChange(val)
  expect(filtered).toBeDefined()

})
test('Editor: handleCatalogResponse(err, catalog, index, v)', () => {
  let err
  let catalog
  let index
  let v

  let handled = editor.handleCatalogResponse(err, catalog, index, v)
  expect(handled).toBeDefined()

})
test('Editor: initInstallTab()', () => {
  let initialized = editor.initInstallTab()
  expect(initialized).toBeDefined()
})

test('Editor: refreshFilteredItems', () => {
  let refreshed = editor.refreshFilteredItems()
  expect(refreshed).toBeDefined()
})

let modules = {
  A: {
    info: {
      id: 'a'
    }
  },
  B: {
    info: {
      id: 'b'
    }
  }
}

test('Editor: sortModulesAZ(A, B)', () => {
  let sortResult = editor.sortModulesAZ(modules.A, modules.B)
  expect(sortResult).toEqual(1)
})

test('Editor: sortModulesRecent(A, B)', () => {
  let sortResult = editor.sortModulesRecent(modules.A, modules.B)
  expect(sortResult).toEqual(-1)
})
test('Editor: getSettingsPane()', () => {
  let pane = editor.getSettingsPane()
  expect(pane).toBeDefined()
})
test('Editor: createSettingsPane', () => {
  let pane = editor.createSettingsPane()
  expect(pane).toBeDefined()
})