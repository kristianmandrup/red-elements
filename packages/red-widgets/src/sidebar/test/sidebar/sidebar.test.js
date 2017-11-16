import {
  RED,
  readPage,
  ctx,
  Sidebar,
} from '../imports'

function create(ctx) {
  return new Sidebar(ctx)
}

const ctx = Object.assign({
  // events,
  // actions,
  // view,
  // tray
}, baseCtx)

let sidebar
beforeEach(() => {
  sidebar = create(ctx)
})

beforeAll(() => {
  // Searchbox(RED)
  // EditableList(RED)
  document.documentElement.innerHTML = readPage('simple')
})

test('Sidebar: create', () => {
  expect(sidebar).toBeDefined()
})


test('Sidebar: sidebarSeparator', () => {
  expect(sidebar.sidebarSeparator).toEqual({})
})

test('Sidebar: knownTabs', () => {
  expect(sidebar.knownTabs).toEqual({})
})

test('Sidebar: addTab - adds a tab', () => {
  let title = 'abc'
  let content = 'xyz'
  let closeable = false
  let visible = false
  let tabCount = sidebar.tabs.length
  sidebar.addTab(title, content, closeable, visible)
  expect(sidebar.tabs.length).toEqual(tabCount + 1)
})

test('Sidebar: removeTab - if no tabs, ignore', () => {
  let sidebar = create(ctx)
  let title = 'abc'
  let content = 'xyz'
  let closeable = false
  let visible = false
  let id = 'x'
  let tabCount = sidebar.tabs.length
  sidebar.removeTab(id)
  expect(sidebar.tabs.length).toEqual(tabCount)
})

test('Sidebar: removeTab - removes a tab', () => {
  let sidebar = create(ctx)
  let title = 'abc'
  let content = 'xyz'
  let closeable = false
  let visible = false
  let id = 'x'
  sidebar.addTab(title, content, closeable, visible)
  let tabCount = sidebar.tabs.length
  sidebar.removeTab(id)
  expect(sidebar.tabs.length).toEqual(tabCount - 1)
})

function isClosed(expected) {
  let closed = $("#main-container").hasClass('sidebar-closed')
  expect(closed).toBe(expected)
}

test('Sidebar: toggleSidebar', () => {
  let state = {}
  isClosed(false)
  sidebar.toggleSidebar(state)
  isClosed(true)
})

test('Sidebar: showSidebar', () => {
  let id = 'x'
  sidebar.showSidebar(id)
})

test('Sidebar: containsTab', () => {
  let id = 'x'
  sidebar.containsTab(id)
})
