import {
  palette,
  readPage
} from './_palette'

beforeAll(() => {
  // widgets that need to be available

  // load document with placeholder elements to create widgets (for testing)
  document.documentElement.innerHTML = readPage('palette-editor', __dirname)
})

test('Editor: semVerCompare', () => {})
test('Editor: delayCallback', () => {})
test('Editor: changeNodeState', () => {})
test('Editor: installNodeModule', () => {})
test('Editor: removeNodeModule', () => {})
test('Editor: refreshNodeModuleList', () => {})
test('Editor: refreshNodeModule', () => {})

test('Editor: getContrastingBorder', () => {})
test('Editor: formatUpdatedAt', () => {})
test('Editor: _refreshNodeModule', () => {})
test('Editor: filterChange', () => {})
test('Editor: handleCatalogResponse', () => {})
test('Editor: initInstallTab', () => {})
test('Editor: refreshFilteredItems', () => {})
test('Editor: sortModulesAZ', () => {})
test('Editor: sortModulesRecent', () => {})
test('Editor: getSettingsPane', () => {})
test('Editor: createSettingsPane', () => {})
