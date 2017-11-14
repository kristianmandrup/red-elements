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

test('Popover: is a class', () => {
  expect(typeof clazz).toBe('function')
})

test('Popover: widget can be created from id', () => {
  let widgetElem = new Popover({
    id: 'popover',
  })

  expect(widgetElem).toBeDefined()
})
