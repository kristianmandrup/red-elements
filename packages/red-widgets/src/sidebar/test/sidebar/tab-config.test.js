import {
  RED,
  readPage,
  ctx as baseCtx,
  Menu,
  Sidebar,
  SidebarTabConfig
} from '../imports'

function create(ctx) {
  return new SidebarTabConfig(ctx)
}

let menu = new Menu(ctx)
let sidebar = new Sidebar(ctx)

const ctx = Object.assign({
  menu,
  sidebar

  // events,
  // actions,
  // view,
  // tray
}, baseCtx)

let tc
beforeEach(() => {
  tc = create(ctx)
})

beforeAll(() => {
  // Searchbox(RED)
  // EditableList(RED)
  document.documentElement.innerHTML = readPage('simple')
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
  expect(category).toBe(expected)
})

test('TabConfig: refreshConfigNodeList', () => {
  tc.refreshConfigNodeList()
  expect(tc).toBe(expected)
})

test('TabConfig: show', () => {
  let tc = create(ctx)
  let id = 'x'
  tc.show(id)
  // TODO
  // t.is()
})
