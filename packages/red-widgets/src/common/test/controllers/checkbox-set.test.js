import {
  readPage,
  ctx,
  RED,
  controllers
} from '../_imports';

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

test('CheckboxSet: can change', () => {
  let elem = $('#checkbox-set')
  let changes = elem.change();
  expect(typeof elem.change).toBe('function')
})

test('CheckboxSet: can add child', () => {
  let addChild = $('#checkbox-set').checkboxSet('addChild');
  expect(addChild).toBeDefined();
})

test('CheckboxSet: can add remove child', () => {
  let removeChild = $('#checkbox-set').checkboxSet('removeChild');
  expect(removeChild).toBeDefined();
})


test('CheckboxSet: can update child', () => {
  let updateChild = $('#checkbox-set').checkboxSet('updateChild');
  expect(updateChild).toBeDefined();
})

test('CheckboxSet: can disable child', () => {
  let disable = $('#checkbox-set').checkboxSet('disable');
  expect(disable).toBeDefined();
})

test('CheckboxSet: can state child', () => {
  let state = $('#checkbox-set').checkboxSet('state');
  expect(state).toBeDefined();
})