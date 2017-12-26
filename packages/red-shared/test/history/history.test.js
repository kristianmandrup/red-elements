import {
  History
} from '../..'

function create() {
  return new History()
}

let history
test.beforeEach(() => {
  history = create()
})

test('history: create', () => {
  t.deepEqual(history.undo_history, [])

})

test('history: peek', () => {
  let ev = {
    id: 'a'
  }
  history.push(ev)
  let latest = nodes.peek()
  t.is(latest, ev)
})

test('history: push', () => {
  let ev = {
    id: 'a'
  }
  history.push(ev)
  let latest = nodes.peek()
  t.is(latest, ev)
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

  let latest = nodes.peek()
  t.falsy(latest)

  history.push(evA)
  history.push(evB)
  history.pop()
  latest = nodes.peek()
  t.is(latest, evA)
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
  t.is(list[0], evA)
  t.is(list[1], evB)
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
  t.is(depth, 2)
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
  t.true(item.dirty)
})
