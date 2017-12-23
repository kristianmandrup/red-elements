import {
  RED,
  readPage,
  Menu,
  Sidebar,
  SidebarTabConfig
} from '../imports'

function create() {
  return new SidebarTabConfig()
}

let tc, sidebar, menu
beforeEach(() => {
  menu = new Menu({
    id: 'menu',
    options: [
      'a',
      'b'
    ]
  })

  sidebar = new Sidebar()
  tc = create()
})

beforeAll(() => {
  // Searchbox(RED)
  // EditableList(RED)
  let html = readPage('simple');
  document.documentElement.innerHTML = html
})

test('Sidebar TabConfig: create', () => {
  expect(tc).toBeDefined()
})


test('Sidebar TabConfig: categories', () => {
  expect(tc.categories).toEqual({})
})

// fix
test('TabConfig: getOrCreateCategory', () => {
  let name = 'abc',
    parent = {},
    label = 'xyz'

  let expected = {}
  let category = tc.getOrCreateCategory(name, parent, label)
  expect(category).toBe(expected)
})

test('TabConfig: createConfigNodeList', () => {
  let id = 'abc'
  let node = {
    id: 'x'
  }
  let nodes = [
    node
  ]
  let expected = {}
  tc.createConfigNodeList(id, nodes)
  // expect(category).toBe(expected)
})

test('TabConfig: refreshConfigNodeList', () => {
  tc.refreshConfigNodeList()
  expect(tc).toBeDefined()
})

test('TabConfig: show', () => {
  let id = 'x'
  tc.show(id)
  // TODO
  // t.is()
})
