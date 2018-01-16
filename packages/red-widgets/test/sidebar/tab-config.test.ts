import {
  $,
  widgets,
  readPage
} from '../_infra'

const {
  Menu,
  Sidebar,
  SidebarTabConfig
} = widgets

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
  document.documentElement.innerHTML = readPage('simple')
})

test('Sidebar TabConfig: create', () => {
  expect(tc).toBeDefined()
})


test('Sidebar TabConfig: categories', () => {
  expect(tc.categories).toEqual({})
})


test('TabConfig: getOrCreateCategory', () => {
  let name = 'abc'
  const parent = $('#sidebar')
  let label = 'xyz'

  let category = tc.getOrCreateCategory(name, parent, label)
  expect(category).toBeDefined()
})

test('TabConfig: createConfigNodeList', () => {
  let id = 'abc'
  let node = {
    id: 'x',
    users: [],
    _def: {
      hasUsers() {
        return true
      }
    }
  }
  let nodes = [
    node
  ]
  let expected = {}
  tc.createConfigNodeList(id, nodes)
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
