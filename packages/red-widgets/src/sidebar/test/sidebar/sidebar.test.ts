import {
  RED,
  readPage,
  ctx as baseCtx,
  Sidebar,
} from '../imports'

function create(ctx) {
  return new Sidebar(ctx)
}

let menu = {
  isSelected() { },

  setSelected(id) { },
  addItem(id, obj) { }
}
let sidebar: any = {};

let ctx: any = Object.assign({
  menu,
  sidebar
  // events,
  // actions,
  // view,
  // tray
}, baseCtx)

beforeEach(() => {
  sidebar = create(ctx)
})

beforeAll(() => {
  // Searchbox(RED)
  // EditableList(RED)
  document.documentElement.innerHTML = readPage('../red-widgets/src/test/app/simple')
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
  let tabCount = 2;
  sidebar.addTab(title, content, closeable, visible)
  expect(typeof sidebar.addTab).toBe('function')
})

// test('Sidebar: removeTab - if no tabs, ignore', () => {
//   // let sidebar = create(ctx)
//   let title = 'abc'
//   let content = 'xyz'
//   let closeable = false
//   let visible = false
//   let id = 'x'
//   let tabCount = 0;
//   sidebar.knownTabs = {
//     x: {
//       wrapper: "#wrapper"
//     }
//   }

//   sidebar.removeTab(id)
//   expect(typeof sidebar.removeTab).toBe('function')
// })

// test('Sidebar: removeTab - removes a tab', () => {
//   let sidebar = create(ctx)
//   let title = 'abc'
//   let content = 'xyz'
//   let closeable = false
//   let visible = false
//   let id = 'x';
//   sidebar.knownTabs = {
//     x: {
//       wrapper: '#wrapper'
//     }
//   }
//   sidebar.addTab(title, content, closeable, visible)
//   let tabCount = 0;
//   sidebar.removeTab(id)
//   expect(typeof sidebar.removeTab).toBe('function')
// })

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
  let id = 'x'
  sidebar.showSidebar(id)
  expect(sidebar.sidebar_tabs.isActivated(id)).toBeTruthy()
})

// test('Sidebar: containsTab', () => {
//   let id = 'x'
//   sidebar.containsTab(id)
// })
