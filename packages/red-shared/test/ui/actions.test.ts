import {
  Actions
} from '../..'

const evt = 'hello'

function create() {
  return new Actions()
}

function func(event) {
  return ':'
}

let actions
beforeEach(() => {
  actions = create()
})

test('Actions: create', () => {
  expect(typeof actions).toBe('object')
})

test('Actions: addAction', () => {
  actions.addAction('a', func)
  expect(actions.actions['a']).toBe(func)
})

test('Actions: removeAction', () => {
  actions.addAction('a', func)
  actions.removeAction('a')
  expect(actions.length).toBe(0)
})

test('Actions: getAction', () => {
  actions.addAction('a', func)
  let action = actions.getAction('a')
  expect(action).toBe(func)
})

test('Actions: invokeAction', () => {
  actions.addAction('a', func)
  let result = actions.invokeAction('a')
  expect(result).toBe(':')
})

test('Actions: listActions', () => {
  actions.addAction('a', func)
  let list = actions.listActions()
  let item = list[0]
  expect(item.id).toBe('a')
})
