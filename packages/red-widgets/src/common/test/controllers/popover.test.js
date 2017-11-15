import {
  readPage,
  ctx,
  RED,
  controllers
} from '../imports'

const {
  Popover
} = controllers

const clazz = Popover

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
  widgetElem = new Popover({
    target: $('#popover'),
    content: 'My popover'
  })
})


test('Popover: is a class', () => {
  expect(typeof clazz).toBe('function')
})

test('Popover: widget can NOT be created without target elem', () => {
  try {
    let badElem = new Popover({
      content: 'My popover'
    })
    expect(badElem).not.toBeDefined()
  } catch (err) {
    expect(err).toBeDefined()
  }
})

test('Popover: widget can be created from target elem', () => {
  expect(widgetElem).toBeDefined()
})

test('Popover: closePopup', () => {
  let closed = widgetElem.closePopup()
  expect(closed).toBe(widgetElem)
})

test('Popover: openPopup', () => {
  let opened = widgetElem.openPopup()
  expect(opened).toBe(widgetElem)
})

test('Popover: setContent', () => {
  let newContent = widgetElem.setContent('hello world')
  expect(newContent).toBe(widgetElem)
})
test('Popover: close', () => {
  let closed = widgetElem.close()
  expect(closed).toBe(widgetElem)
  expect(closed.active).toBeFalsy()
})

test('Popover: open', () => {
  let opened = widgetElem.open()
  expect(opened).toBe(widgetElem)
  expect(opened.active).toBeTruthy()
})
