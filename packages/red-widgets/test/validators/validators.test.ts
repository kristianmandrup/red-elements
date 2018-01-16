import {
  readPage,
  expectTruthy
} from '../_infra'

import {
  Validators
} from '../../src'

function create() {
  return new Validators()
}

let v
beforeEach(() => {
  v = create()
})

// TODO: load fake web page
// '#node-input-flow'
beforeAll(() => {
  // EditableList(RED)
  document.documentElement.innerHTML = readPage('validators');
})


test('validators: create', () => {
  expect(typeof v).toBe('object')
})

test('validators: number - with blanks', () => {
  let withBlanks = v.number(true)
  expect(withBlanks('')).toBeTruthy()
  expect(withBlanks(' ')).toBeTruthy()
})

test('validators: number - no blanks', () => {
  let noBlanks = v.number(false)
  expect(noBlanks('2')).toBeTruthy()
  expect(noBlanks('')).toBeFalsy()
  expect(noBlanks('  x')).toBeFalsy()
})

test('validators: regex', () => {
  let exp = /^\d+/
  let re = v.regex(exp)
  expect(re('2')).toBeTruthy()
  expect(re(' 5')).toBeFalsy()
})

test('validators: typedInput - number', () => {
  let num = v.typedInput('num', true)
  expect(num('2')).toBeTruthy()
})

test('validators: validatePropertyExpression', () => {
  expect(v.ctx.utils.validatePropertyExpression).toBeDefined()
  expect(v.ctx.utils.validatePropertyExpression('p')).toBeTruthy()
})

test('validators: validateProp', () => {
  let result = v.validateProp(v)
  expect(result).toBeTruthy()
})

test('validators: typedInput - flow', () => {
  let flow = v.typedInput('flow', false)
  v.flow = 'flow'
  expect(flow('2')).toBeTruthy()
})

test('validators: typedInput - num', () => {
  let isNum = v.typedInput('num', false)
  expect(isNum('2')).toBeTruthy()
})
