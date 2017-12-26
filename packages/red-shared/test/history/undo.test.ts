import {
  History
} from '../..'

function create() {
  return new History()
}

let undo
beforeEach(() => {
  undo = create()
})

test('history: undo', () => {
  let ev = {
    id: 'a'
  }

  history.push(ev)
  let latest = nodes.peek()
  t.is(latest, ev)
  history.undo()

  latest = nodes.peek()
  t.falsy(latest)
})
