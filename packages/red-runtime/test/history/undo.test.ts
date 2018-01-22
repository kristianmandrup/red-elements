import {
  History,
  Undo
} from '../..'

import { log } from 'util';
import { factories } from '../playbox/shared-tests';

function create() {
  return new Undo()
}

let undo
beforeEach(() => {
  undo = create()
})

function merge(a, b) {
  return Object.assign(a, b)
}

function fakeNode(override = {}, def = true) {
  let base: any = {
    id: 'x',
    in: {},
    out: {},
    type: 'subflow'
  }

  if (def) {
    base._def = {
      credentials: {},
      defaults: {},
      set: {
        module: 'node-red'
      }
    }
  }

  return merge(base, override)
}

function fakeEvent(override = {}) {
  let base: any = {
    id: 'x',
    changed: false
  }
  return merge(base, override)
}

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
  let ev = fakeEvent({
    t: 'multi'
  })
  expect(() => undo.undoEvent(ev)).toThrow()
})

test(`Undo: undoEvent(ev) - t: 'replace'`, () => {
  let ev = fakeEvent({
    t: 'replace'
  })
  log(ev)
  undo.undoEvent(ev)
})

test(`Undo: undoEvent(ev) - t: 'add'`, () => {
  let ev = fakeEvent({
    t: 'add'
  })

  undo.undoEvent(ev)
})

test(`Undo: undoEvent(ev) - t: 'delete'`, () => {
  let ev = fakeEvent({
    t: 'delete'
  })
  undo.undoEvent(ev)
})

test(`Undo: undoEvent(ev) - t: 'move' - missing nodes`, () => {
  let ev = fakeEvent({
    t: 'move'
  })
  expect(() => undo.undoEvent(ev)).toThrow()
})

test(`Undo: undoEvent(ev) - t: 'move' - w nodes`, () => {
  let ev = fakeEvent({
    t: 'move',
    nodes: [
      fakeNode()
    ]
  })
  expect(() => undo.undoEvent(ev)).toThrow()
})

test(`Undo: undoEvent(ev) - t: 'edit'`, () => {
  let ev = fakeEvent({
    t: 'edit',
    changes: {},
    node: fakeNode()
  })
  undo.undoEvent(ev)
})

test(`Undo: undoEvent(ev) - t: 'createSubflow'`, () => {
  let ev = fakeEvent({
    t: 'createSubflow',
    subflow: fakeNode()
  })
  undo.undoEvent(ev)
})

test(`Undo: undoEvent(ev) - t: 'reorder'`, () => {
  let ev = fakeEvent({
    t: 'reorder'
  })
  undo.undoEvent(ev)
})

