import {
  History,
  UndoEvent
} from '../..'

function create() {
  return new UndoEvent()
}

let undo
beforeEach(() => {
  undo = create()
})

test('Undo: create', () => {
  expect(typeof undo).toBe('object')
})

test('Undo: create - has nodes', () => {
  expect(undo.nodes).toBeDefined()
})

test('Undo: undoEvent(ev) - missing .t - throws', () => {
  let ev = {
    id: 'a'
  }
  expect(() => undo.undoEvent(ev)).toThrow()
})

test(`Undo: undoEvent(ev) - t: 'multi' missing .events - throws`, () => {
  let ev = {
    id: 'a',
    t: 'multi'
  }
  expect(() => undo.undoEvent(ev)).toThrow()
})

test(`Undo: undoEvent(ev) - t: 'replace'`, () => {
  let ev = {
    id: 'a',
    t: 'replace'
  }
  undo.undoEvent(ev)
})
