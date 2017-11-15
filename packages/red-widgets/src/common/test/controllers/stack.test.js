import {
  readPage,
  ctx,
  RED,
  controllers
} from '../imports'

const {
  Stack
} = controllers

const clazz = Stack

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
  widgetElem = new Stack({
    container: $('#stack')
  })
})

test('Stack: is a class', () => {
  expect(typeof clazz).toBe('function')
})

test('Stack: widget can NOT be created without container elem', () => {
  try {
    let badElem = new Stack({})
    expect(badElem).not.toBeDefined()
  } catch (err) {
    expect(err).toBeDefined()
  }
})

test('Stack: widget can be created from target elem', () => {
  expect(widgetElem).toBeDefined()
})

test('Stack: add(entry)', () => {
  let entry = {}
  let addedEntry = widgetElem.add(entry)
  expect(addedEntry).toBeDefined()
})


test('Stack: hide()', () => {
  let shown = widgetElem.show()
  expect(shown).toBeDefined()
  expect(shown.visible).toBeTruthy()
})

test('Stack: show()', () => {
  let hidden = widgetElem.hide()
  expect(hidden).toBeDefined()
  expect(hidden.visible).toBeFalsy()
})
