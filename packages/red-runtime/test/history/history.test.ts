import {
  History
} from '../..'

function create() {
  return new History()
}

let history
beforeEach(() => {
  history = create()
})

test('history: create', () => {
  expect(history.undo_history).toEqual([])
})

test('history: peek', () => {
  let ev = {
    id: 'a'
  }
  history.push(ev)
  let latest = history.peek()
  expect(latest).toBe(ev)
})

test('history: push', () => {
  let ev = {
    id: 'a'
  }
  history.push(ev)
  let latest = history.peek()
  expect(latest).toBe(ev)
})

test('history: pop', () => {
  let evA = {
    id: 'a'
  }
  let evB = {
    id: 'b'
  }
  history.push(evA)
  history.pop()

  let latest = history.peek()
  expect(latest).toBeFalsy()

  history.push(evA)
  history.push(evB)
  history.pop()
  latest = history.peek()
  expect(latest).toBe(evA)
})

test('history: list', () => {
  let evA = {
    id: 'a'
  }
  let evB = {
    id: 'b'
  }
  history.push(evA)
  history.push(evB)
  let list = history.list()
  expect(list[0]).toBe(evA)
  expect(list[1]).toBe(evB)
})

test('history: depth', () => {
  let evA = {
    id: 'a'
  }
  let evB = {
    id: 'b'
  }
  history.push(evA)
  history.push(evB)
  let depth = history.depth()
  expect(depth).toBe(2)
})

test('history: markAllDirty', () => {
  let evA = {
    id: 'a'
  }
  let evB = {
    id: 'b'
  }
  history.push(evA)
  history.push(evB)
  history.markAllDirty()
  let list = history.list()
  let item = list[0]
  expect(item.dirty).toBeTruthy()
})


test('history: undo', () => {
  let ev = {
    id: 'a',
    events: [
      {}
    ]
  }

  history.push(ev)
  let latest = history.peek()
  expect(latest).toBe(ev)
  history.undo()

  latest = history.peek()
  expect(latest).toBeFalsy()
})
