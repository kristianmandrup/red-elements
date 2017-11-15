import {
  readPage,
  ctx,
  RED,
  controllers
} from '../imports'

const {
  Tabs
} = controllers

const clazz = Tabs

const {
  log
} = console

beforeAll(() => {
  // Popover has no widget factory, just a class

  // load document with placeholder elements to create widgets (for testing)
  document.documentElement.innerHTML = readPage('simple')
})

let widgetElem

beforeEach(() => {
  widgetElem = new Tabs({
    id: 'tabs'
  })
})
test('Tabs: is a class', () => {
  expect(typeof clazz).toBe('function')
})

test('Tabs: widget can NOT be created without id: option', () => {
  try {
    let badElem = new Tabs({})
    expect(badElem).not.toBeDefined()
  } catch (err) {
    expect(err).toBeDefined()
  }
})

test('Tabs: widget can be created from target elem', () => {
  expect(widgetElem).toBeDefined()
})

function mockEvent(opts) {
  return {}
}

test('Tabs: scrollEventHandler', () => {
  let event = mockEvent()
  let direction = 'left'
  let scrolled = widgetElem.scrollEventHandler(event, direction)
  expect(scrolled).toBe(widgetElem)
})

test('Tabs: onTabClick', () => {
  let clicked = widgetElem.onTabClick()
  expect(clicked).toBe(widgetElem)
})

test('Tabs: updateScroll', () => {
  let updated = widgetElem.updateScroll()
  expect(updated).toBe(widgetElem)
})

test('Tabs: onTabDblClick', () => {
  let updated = widgetElem.onTabDblClick()
  expect(updated).toBe(widgetElem)
})

test('Tabs: activateTab', () => {
  let link = 'x'
  let activated = widgetElem.activateTab(link)
  expect(activated).toBe(widgetElem)
})

test('Tabs: activatePreviousTab', () => {
  let activated = widgetElem.activatePreviousTab()
  expect(activated).toBe(widgetElem)
})

test('Tabs: activateNextTab', () => {
  let activated = widgetElem.activateNextTab()
  expect(activated).toBe(widgetElem)
})

// updateTabWidths

// removeTab(id)

// addTab(tab)

// count()

// contains(id)

// renameTab(id, label)

// order(order)
