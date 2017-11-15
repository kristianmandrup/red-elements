import {
  palette,
  RED,
  Searchbox,
  readPage
} from './_palette'

beforeAll(() => {
  // widgets that need to be available
  Searchbox(RED)
  // load document with placeholder elements to create widgets (for testing)
  document.documentElement.innerHTML = readPage('palette', __dirname)
})

test.only('Palette: created', () => {
  expect(palette).toBeDefined()
})

test('Palette: createCategoryContainer', () => {
  let created = palette.createCategoryContainer()
  expect(created).toBeDefined()
})
test('Palette: setLabel', () => {})
test('Palette: escapeNodeType', () => {})
test('Palette: addNodeType', () => {})
test('Palette: removeNodeType', () => {})
test('Palette: hideNodeType', () => {})
test('Palette: showNodeType', () => {})
test('Palette: refreshNodeTypes', () => {})
test('Palette: filterChange', () => {})
