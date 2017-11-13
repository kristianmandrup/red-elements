import test from 'ava'
import {
  Validators
} from './api'

const ctx = {}

function create(ctx) {
  return new Validators(ctx)
}

test('validators: create', () => {
  let v = create(ctx)
  t.is(typeof v, 'object')
})

test('validators: number', () => {
  let v = create(ctx)
  let withBlanks = v.number(true)
  t.true(withBlanks('2'))
  t.true(withBlanks(' 5'))

  let noBlanks = v.number(false)
  t.true(noBlanks('2'))
  t.false(noBlanks(' 5 '))
})

test('validators: regex', () => {
  let v = create(ctx)
  let exp = /\d+/
  let re = v.regex(exp)
  t.true(re('2'))
  t.false(re(' 5'))
})

test('validators: typedInput - number', () => {
  let v = create(ctx)
  let num = v.typedInput('num', true)
  t.true(num('2'))
})

test('validators: typedInput - flow', () => {
  let v = create(ctx)
  let flow = v.typedInput('flow', false)
  t.false(flow('2'))
})
