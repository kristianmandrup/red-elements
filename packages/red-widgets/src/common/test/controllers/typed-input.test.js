import {
  readPage,
  ctx,
  RED,
  controllers
} from '../imports'

const {
  TypedInput
} = controllers

const clazz = TypedInput

const {
  log
} = console

beforeAll(() => {
  // Popover has no widget factory, just a class
  TypedInput(RED)
  // load document with placeholder elements to create widgets (for testing)
  document.documentElement.innerHTML = readPage('simple')
})

let widgetElem

beforeEach(() => {
  widgetElem = new TypedInput({
    container: $('#stack')
  })
})

test('TypedInput: is a class', () => {
  expect(typeof clazz).toBe('function')
})

test('TypedInput: widget can be created', () => {
  let elem = $('#typed-input')
  // log({
  //   elem
  // })
  let widgetElem = elem.typedInput()
  // log({
  //   widgetElem
  // })
  expect(widgetElem).toBeDefined()
})

test('TypedInput: widget can be resize', () => {
  let elem = $('#typed-input')
  let resize = elem.typedInput('types', [ 'msg',
  'flow',
  'global',
  'str',
  'num',
  'bool',
  'json',
  're',
  'date',
  'jsonata',
  'bin' ]);
  expect(resize).toBeDefined()
})
test('TypedInput: option can be clicked', () => {
  let elem = $('#typeOpt')
 
  let click = elem.click();
  
  expect(typeof click).toBe('object')
})