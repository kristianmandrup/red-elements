import {
  readPage,
  ctx,
  RED,
  controllers
} from '../imports'

const {
  Menu
} = controllers

const clazz = Menu

const {
  log
} = console

beforeAll(() => {
  // Menu has no widget factory, just a class

  // load document with placeholder elements to create widgets (for testing)
  document.documentElement.innerHTML = readPage('simple')
})

test('Menu: is a class', () => {
  expect(typeof clazz).toBe('function')
})

test('Menu: can be created from id with NO options', () => {
  let elem = $('#menu')

  // note: inside Menu constructor
  //  var menuParent = $("#" + options.id);

  let widgetElem = new Menu({
    id: 'menu',
    options: []
  })

  expect(widgetElem).toBeDefined()
})


test('Menu: can be created from id with NO options', () => {
  let widgetElem = new Menu({
    id: 'menu',
    options: [
      'a',
      'b'
    ]
  })
  expect(widgetElem).toBeDefined()
})
