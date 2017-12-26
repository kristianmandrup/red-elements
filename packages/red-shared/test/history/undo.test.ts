import {
  History,
} from '../..'

// function createUndo() {
//   return new Undo()
// }

function createHistory() {
  return new History()
}


// let undo
let history
beforeEach(() => {
  // undo = createUndo()
  history = createHistory()
})

test('history: undo', () => {
  let ev = {
    id: 'a'
  }

  history.push(ev)
  let latest = history.peek()
  expect(latest).toBe(ev)
  history.undo()

  latest = history.peek()
  expect(latest).toBeFalsy()
})
