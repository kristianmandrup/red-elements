import {
  Keyboard
} from '../..'

function create() {
  return new Keyboard()
}

let kb
beforeEach(() => {
  kb = create()
})

test('Keyboard: create - is an object', () => {
  expect(typeof kb).toBe('object')
})

test('Keyboard: create - empty handlers', () => {
  expect(kb.handlers).toEqual({})
})

test('Keyboard: create - no partialState', () => {
  expect(kb.partialState).toBe(null)
})

test('Keyboard: create - no partialState', () => {
  expect(kb.partialState).toBe(null)
})

test('Keyboard: create - empty actionToKeyMap', () => {
  expect(kb.actionToKeyMap).toBe({})
})

test('Keyboard: create - empty defaultKeyMap', () => {
  expect(kb.defaultKeyMap).toBe({})
})
