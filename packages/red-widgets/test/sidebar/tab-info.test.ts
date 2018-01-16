import {
  $,
  widgets,
  readPage
} from '../_infra'

const {
  Tips,
  SidebarTabInfo
} = widgets

function createTip() {
  return new Tips()
}

function create() {
  return new SidebarTabInfo()
}

let tabInfo
beforeEach(() => {
  tabInfo = create()
})

beforeAll(() => {
  document.documentElement.innerHTML = readPage('simple')
})

test('Sidebar TabInfo: create', () => {
  expect(typeof tabInfo.tips).toBe('object')
})

test('TabInfo: show', () => {
  tabInfo.show()
  // TODO: test sidebar is shown
  expect(tabInfo.sidebar).toBeDefined()
})

test('TabInfo: jsonFilter - empty key', () => {
  let value = 29
  let filterValue = tabInfo.jsonFilter('', value)
  expect(filterValue).toBe(value)
})

test('TabInfo: jsonFilter', () => {
  let key = 'x'
  let value = {
    a: 2
  }
  let filterValue = tabInfo.jsonFilter(key, value)
  expect(filterValue).toEqual(`[object]`)
})

test('TabInfo: addTargetToExternalLinks', () => {
  let element = $('#target')
  let el = tabInfo.addTargetToExternalLinks(element)
  expect(el).toBeDefined()
})

test('TabInfo: refresh', () => {
  let node = {};
  tabInfo.sections = $("<div></div>");
  tabInfo.nodeSection = {
    contents: $('<div><laleb></label></div>'),
    title: $('<div></div>')
  };
  tabInfo.infoSection = {
    contents: $("<div><laleb></label></div>")
  };
  let refreshed = tabInfo.refresh(node)
  expect(refreshed).toBe(tabInfo)
})

test('TabInfo: setInfoText', () => {
  let infoText = 'hello'
  tabInfo.infoSection = {
    content: $("<div></div>")
  }
  let updated = tabInfo.setInfoText(infoText)
  expect(updated).toBe(tabInfo)
})

test('TabInfo: clear', () => {
  tabInfo.sections = $('<div></div>');
  let cleared = tabInfo.clear()
  expect(cleared).toBe(tabInfo)
})

test('TabInfo: set', () => {
  let html = '<b>hello</b>';
  tabInfo.sections = $('<div></div>');
  tabInfo.nodeSection = {
    container: $('<div></div>')
  }
  tabInfo.infoSection = {
    content: $('<div></div>')
  }
  let set = tabInfo.set(html)
  expect(set).toBe(tabInfo)
})
