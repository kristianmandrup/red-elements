import {
  Validators
} from '../'

function create() {
  return new Validators()
}

let v
beforeEach(() => {
  v = create()
})


test('validators: create', () => {
  expect(typeof v).toBe('object')
})

test('validators: number', () => {
  let withBlanks = v.number(true)
  expect(withBlanks('2')).toBeTruthy()
  expect(withBlanks(' 5')).toBeTruthy()

  let noBlanks = v.number(false)
  expect(noBlanks('2')).toBeTruthy()
  expect(noBlanks(' 5 ')).toBeFalsy()
})

test('validators: regex', () => {
  let exp = /\d+/
  let re = v.regex(exp)
  expect(re('2')).toBeTruthy()
  expect(re(' 5')).toBeFalsy()
})

test('validators: typedInput - number', () => {
  let num = v.typedInput('num', true)
  expect(num('2')).toBeTruthy()
})

test('validators: typedInput - flow', () => {
  let flow = v.typedInput('flow', false)
  expect(flow('2')).toBeFalsy()
})
