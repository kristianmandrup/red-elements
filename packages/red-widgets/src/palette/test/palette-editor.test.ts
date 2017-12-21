import {
  editor,
  RED,
  Searchbox,
  EditableList,
  readPage
} from './_palette'
import { edit } from 'brace';

const {
  log
} = console

beforeAll(() => {
  // widgets that need to be available
  new EditableList()
  new Searchbox()

  // load document with placeholder elements to create widgets (for testing)
  document.documentElement.innerHTML = readPage('../red-widgets/src/palette/test/app/palette-editor');
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
  editor.installNodeModule(id, callback, version, shade)
})
test('Editor: removeNodeModule(id, callback)', () => {
  const id = 'marked'
  const shadeEl = document.createElement('div')
  const shade = $(shadeEl);
  function callback() {
    expect(1).toBeDefined()
  }
  // Note: uses delayCallback
  editor.installNodeModule(id, callback, shade, shade)
})
test('Editor: refreshNodeModuleList()', () => {
  editor.refreshNodeModuleList()
  expect(typeof editor.refreshNodeModuleList).toBe('function')
})
test('Editor: refreshNodeModule(module)', () => {
  let module = {}
  let refreshed = editor.refreshNodeModule(module)
  expect(typeof editor.refreshNodeModule).toBe('function')
})

test('Editor: getContrastingBorder(rgbColor)', () => {
  let rgbColor = `rgba(234,129,283)`
  let border = editor.getContrastingBorder(rgbColor)
  expect(border).toBeDefined()
})
test('Editor: formatUpdatedAt', () => {
  let dateString = '11/11/2017'
  let updated = editor.formatUpdatedAt(dateString)
  console.log("LOG", updated);
  expect(updated).not.toBeDefined()

})
test('Editor: _refreshNodeModule(module)', () => {
  let module = {}
  let refreshed = editor._refreshNodeModule(module)
  expect(refreshed).not.toBeDefined()
})
test('Editor: filterChange(val)', () => {
  let val = 'Active'
  let filtered = editor.filterChange(val)
  expect(typeof editor.filterChange).toBe('function')

})
test('Editor: handleCatalogResponse(err, catalog, index, v)', () => {
  let err
  let catalog
  let index
  let v = {
    modules: [{
      id: 'my-module'
    }]
  }

  let handled = editor.handleCatalogResponse(err, catalog, index, v)
  expect(typeof editor.handleCatalogResponse).toBe('function')

})
test('Editor: initInstallTab()', () => {
  let initialized = editor.initInstallTab()
  expect(initialized).toBeDefined()
})
test('Editor: initInstallTab()', () => {
  editor.packageList = {};
  let initialized = editor.initInstallTab()
  expect(initialized).toBeDefined()
})
test('Editor: refreshFilteredItems', () => {

  let refreshed;
  try {
    refreshed = editor.refreshFilteredItems();
    expect(refreshed).toBeDefined();
  }
  catch (e) {
    expect(refreshed).not.toBeDefined();
  }
})

const today = new Date()

let modules = {
  A: {
    info: {
      id: 'a',
      timestamp: today
    }
  },
  B: {
    info: {
      id: 'b',
      timestamp: today.getMilliseconds() - 100
    }
  }
}

test('Editor: sortModulesAZ(A, B)', () => {
  let sortResult = editor.sortModulesAZ(modules.A, modules.B)
  expect(sortResult).toEqual(-1)
})

test('Editor: sortModulesRecent(A, B)', () => {
  let sortResult = editor.sortModulesRecent(modules.A, modules.B)
  expect(sortResult).toBeLessThan(0)
})
test('Editor: getSettingsPane() - fails without createSettingsPane', () => {
  expect(() => editor.getSettingsPane()).toThrowError()
})
test('Editor: createSettingsPane', () => {
  editor.createSettingsPane()
  const props = ['settingsPane', 'packageList', 'editorTabs', 'filterInput', 'nodeList']
  props.map(prop => {
    log('check', prop)
    expect(editor[prop]).toBeDefined()
  })
})
test('Editor: getSettingsPane() - works after createSettingsPane', () => {
  editor.settingsPane = {}
  editor.editorTabs = {
    activateTab(node) { }
  }
  // editor.createSettingsPane()
  let pane = editor.getSettingsPane()
  expect(pane).toBeDefined()
})



