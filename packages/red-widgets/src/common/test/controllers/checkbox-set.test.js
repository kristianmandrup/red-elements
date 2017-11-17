import {
  readPage,
  ctx,
  RED,
  controllers
} from '../imports'

const {
  CheckboxSet
} = controllers

const clazz = CheckboxSet

const {
  log
} = console

beforeAll(() => {
  // registers jquery UI widget via factory (ie. make available on jQuery elements)
  CheckboxSet(RED)

  // load document with placeholder elements to create widgets (for testing)
  document.documentElement.innerHTML = readPage('simple')
})

test('CheckboxSet: is a class', () => {
  expect(typeof clazz).toBe('function')
})

test('CheckboxSet: widget can be created', () => {
  let elem = $('#checkbox-set')
  // log({
  //   elem
  // })
  let widgetElem = elem.checkboxSet()
  // log({
  //   widgetElem
  // })

  expect(widgetElem).toBeDefined()
})
