import {
  Actions
} from '../..'

const evt = 'hello'
const { log } = console

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

test('Actions: add', () => {
  expect(actions.count).toBe(0)
  actions.add('a', func)
  expect(actions.count).toBe(1)
  expect(actions.actions['a']).toBe(func)
})

test('Actions: remove', () => {
  expect(actions.count).toBe(0)
  actions.add('a', func)
  expect(actions.count).toBe(1)
  actions.remove('a')
  expect(actions.count).toBe(0)
})

test('Actions: get', () => {
  expect(actions.count).toBe(0)
  actions.add('a', func)
  expect(actions.count).toBe(1)
  let action = actions.get('a')
  expect(action).toBe(func)
})

test('Actions: invoke - registered', () => {
  actions.add('a', func)
  let result = actions.invoke('a')
  expect(result).toBe(':')
})

test('Actions: invoke - not registered', () => {
  actions.add('a', func)
  let result = actions.invoke('b')
  expect(result).not.toBeDefined()
})

test('Actions: list', () => {
  actions.add('a', func)
  let list = actions.list()
  expect(list.length).toBe(1)
  let item = list[0]
  expect(item.id).toBe('a')
})
