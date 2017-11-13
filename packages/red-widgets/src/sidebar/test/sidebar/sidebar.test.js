import {
  Sidebar,
} from '../imports'

const ctx = {}

function create(ctx) {
  return new Sidebar(ctx)
}

test('Sidebar: create', () => {
  let sidebar = create(ctx)
  t.deepEqual(sidebar.sidebarSeparator, {})
  t.deepEqual(sidebar.knownTabs, {})
})
test('Sidebar: addTab', () => {
  let sidebar = create(ctx)
  let title = 'abc'
  let content = 'xyz'
  let closeable = false
  let visible = false
  sidebar.addTab(title, content, closeable, visible)
})

test('Sidebar: removeTab', () => {
  let sidebar = create(ctx)
  let title = 'abc'
  let content = 'xyz'
  let closeable = false
  let visible = false
  let id = 'x'
  sidebar.addTab(title, content, closeable, visible)
  sidebar.removeTab(id)
})

test('Sidebar: toggleSidebar', () => {
  let sidebar = create(ctx)
  let state = {}
  sidebar.toggleSidebar(state)
})

test('Sidebar: showSidebar', () => {
  let sidebar = create(ctx)
  let id = 'x'
  sidebar.showSidebar(id)
})

test('Sidebar: containsTab', () => {
  let sidebar = create(ctx)
  let id = 'x'
  sidebar.containsTab(id)
})
