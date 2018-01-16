import {
  palette,
  RED,
  Searchbox,
  EditableList,
  readPage
} from './_palette'

beforeAll(() => {
  // load document with placeholder elements to create widgets (for testing)
  document.documentElement.innerHTML = readPage('palette');
})

test('Palette: created', () => {
  expect(palette).toBeDefined()
})

test('Palette: createCategoryContainer', () => {
  expect(() => palette.createCategoryContainer()).toThrowError()
})

test('Palette: createCategoryContainer', () => {
  let created = palette.createCategoryContainer('hello')
  expect(created).toBeDefined()
})

test('Palette: setLabel(type, el, label, info)', () => {
  let type = 'text'
  let div = document.createElement('div')
  let el = $(div)
  // el.data('popover', 'x')
  let label = 'hello world'
  let info = false // true

  let wasSet = palette.setLabel(type, el, label, info)
  expect(wasSet).toBeDefined()
})
test('Palette: escapeNodeType(nt)', () => {
  const nt = 'a:b_c'
  const escaped = palette.escapeNodeType(nt)
  expect(escaped).not.toEqual(nt)
  expect(escaped).toEqual('a_b_c')
})
test('Palette: addNodeType(nt, def)', () => {
  const nt = 'a:b_c'
  const def = {
    category: 'io',
    set: {
      id: 'axl'
    }
  }
  const added = palette.addNodeType(nt, def)
  expect(added).toBeDefined()
})

test('Palette: removeNodeType(nt)', () => {
  const nt = 'a:b_c'
  const def = {
    category: 'io',
    set: {
      id: 'axl'
    }
  }
  const added = palette.addNodeType(nt, def)
  const removed = palette.removeNodeType(nt)
  expect(removed).toBeDefined()
})

test('Palette: hideNodeType(nt)', () => {
  const nt = 'a:b_c'
  const hidden = palette.hideNodeType(nt)
  expect(hidden).toBeDefined()
})

test('Palette: showNodeType(nt)', () => {
  const nt = 'a:b_c'
  const shown = palette.showNodeType(nt)
  expect(shown).toBeDefined()
})

test('Palette: refreshNodeTypes()', () => {
  const refreshed = palette.refreshNodeTypes()
  expect(refreshed).toBeDefined()
})

test('Palette: filterChange(val)', () => {
  const val = 'a:bc'
  const filtered = palette.filterChange(val)
  expect(filtered).toBeDefined()
})

// TODO: uses marked package for converting to node info to markdown format
test('Palette: marked', () => {
  const filtered = palette.filterChange("test")
  expect(filtered).toBeDefined()
})
