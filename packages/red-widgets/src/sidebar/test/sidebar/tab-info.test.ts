import {
  RED,
  readPage,
  ctx as baseCtx,
  Tips,
  SidebarTabInfo
} from '../imports'

function createTip(ctx) {
  return new Tips()
}

function create(ctx) {
  return new SidebarTabInfo()
}

const ctx = Object.assign({
  // menu,
  // sidebar

  // events,
  // actions,
  // view,
  // tray
}, baseCtx)

let tabInfo
beforeEach(() => {
  tabInfo = create(ctx)
})

beforeAll(() => {
  // Searchbox(RED)
  // EditableList(RED)
  document.documentElement.innerHTML = readPage('../red-widgets/src/test/app/simple');
})

test('Sidebar TabInfo: create', () => {
  expect(typeof tabInfo.tips).toBe('object')
})

// test('TabInfo: show', () => {
//   tabInfo.show()
//   // TODO: test sidebar is shown
//   expect(tabInfo.sidebar).toBeDefined()
// })

// test('TabInfo: jsonFilter - empty key', () => {
//   let value = 29
//   let filterValue = tabInfo.jsonFilter('', value)
//   expect(filterValue).toBe(value)
// })

// test('TabInfo: jsonFilter', () => {
//   let key = 'x'
//   let value = {
//     a: 2
//   }
//   let filterValue = tabInfo.jsonFilter(key, value)
//   expect(filterValue).toEqual(`[object]`)
// })

// test('TabInfo: addTargetToExternalLinks', () => {
//   let element = $('#target')
//   let el = tabInfo.addTargetToExternalLinks(element)
//   expect(el).toBeDefined()
// })

// test('TabInfo: refresh', () => {
//   let node = {}
//   let refreshed = tabInfo.refresh(node)
//   expect(refreshed).toBe(tabInfo)
// })

// test('TabInfo: setInfoText', () => {
//   let infoText = 'hello'
//   let updated = tabInfo.setInfoText(infoText)
//   expect(updated).toBe(tabInfo)
// })

// test('TabInfo: clear', () => {
//   let cleared = tabInfo.clear()
//   expect(cleared).toBe(tabInfo)
// })

// test('TabInfo: set', () => {
//   let html = '<b>hello</b>'
//   let set = tabInfo.set(html)
//   expect(set).toBe(tabInfo)
// })
