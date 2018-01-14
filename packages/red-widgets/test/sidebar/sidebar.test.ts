import {
  $,
  widgets,
  readPage
} from '../_infra'

const {
  Sidebar,
} = widgets

function create() {
  return new Sidebar()
}

let menu = {
  isSelected() { },

  setSelected(id) { },
  addItem(id, obj) { }
}
let sidebar: any = {};

beforeEach(() => {
  sidebar = create()
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

test('Sidebar: addTab - when not visible does not (really) add a tab', () => {
  let id = 'xyz-invisible'
  let title = 'abc'
  let content = {
    id
  }
  let closeable = false
  let visible = false
  let tabCount = 2;
  sidebar.addTab(title, content, closeable, visible)

  let ids = sidebar.sidebar_tabs.ids
  expect(ids).not.toContain(id)
})

test('Sidebar: addTab - when visible really does add a tab', () => {
  let id = 'xyz'
  let title = 'abc'
  let content = {
    id
  }
  let closeable = false
  let visible = true
  let tabCount = 2;
  sidebar.addTab(title, content, closeable, visible)

  let ids = sidebar.sidebar_tabs.ids
  expect(ids).toContain(id)
})

test('Sidebar: removeTab - if no such tab registered, ignore remove', () => {
  let id = 'xyz'
  let title = 'abc'
  let content = {
    id
  }
  let closeable = false
  let visible = true
  let tabCount = 0;
  sidebar.knownTabs = {
    xyz: {
      wrapper: "#wrapper"
    }
  }

  sidebar.addTab(title, content, closeable, visible)
  let ids = sidebar.sidebar_tabs.ids
  expect(ids).toContain(id)

  visible = false
  sidebar.removeTab('unknown')
  ids = sidebar.sidebar_tabs.ids
  expect(ids).toContain(id)
})

test('Sidebar: removeTab - removes tab if registered', () => {
  let id = 'xyz'
  let title = 'abc'
  let content = {
    id
  }
  let closeable = false
  let visible = true
  let tabCount = 0;
  sidebar.knownTabs = {
    xyz: {
      wrapper: "#wrapper"
    }
  }

  sidebar.addTab(title, content, closeable, visible)
  sidebar.removeTab(id)
  let ids = sidebar.sidebar_tabs.ids
  expect(ids).not.toContain(id)
})

test('Sidebar: toggleSidebar', () => {
  let state = {}
  sidebar.sidebar_tabs = {
    resize() { }
  }
  sidebar.toggleSidebar(state)
  let closed = $("#main-container").hasClass('sidebar-closed')
  expect(closed).toBe(false)
})

test('Sidebar: showSidebar', () => {
  let id = 'xyz'
  let title = 'abc'
  let content = {
    id
  }
  let closeable = false
  let visible = true
  let tabCount = 0;
  sidebar.knownTabs = {
    xyz: {
      wrapper: "#wrapper"
    }
  }

  sidebar.addTab(title, content, closeable, visible)
  let ids = sidebar.sidebar_tabs.ids
  expect(ids).toContain(id)

  sidebar.showSidebar(id)
  let activated = sidebar.sidebar_tabs.isActivated(id)
  expect(activated).toBeTruthy()
})

test('Sidebar: containsTab', () => {
  let id = 'xyz'
  let title = 'abc'
  let content = {
    id
  }
  let closeable = false
  let visible = true
  let tabCount = 0;
  sidebar.knownTabs = {
    xyz: {
      wrapper: "#wrapper"
    }
  }

  sidebar.addTab(title, content, closeable, visible)
  let ids = sidebar.sidebar_tabs.ids
  expect(ids).toContain(id)

  let contained = sidebar.containsTab(id)
  expect(contained).toBeTruthy()
})
