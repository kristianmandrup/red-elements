import {
  Validators
} from '../'

function create() {
  return new Validators()
}

test('validators: create', () => {
  t.is(typeof v, 'object')
})

test('validators: number', () => {
  let withBlanks = v.number(true)
  t.true(withBlanks('2'))
  t.true(withBlanks(' 5'))

  let noBlanks = v.number(false)
  t.true(noBlanks('2'))
  t.false(noBlanks(' 5 '))
})

test('validators: regex', () => {
  let exp = /\d+/
  let re = v.regex(exp)
  t.true(re('2'))
  t.false(re(' 5'))
})

test('validators: typedInput - number', () => {
  let num = v.typedInput('num', true)
  t.true(num('2'))
})

test('validators: typedInput - flow', () => {
  let flow = v.typedInput('flow', false)
  t.false(flow('2'))
})
