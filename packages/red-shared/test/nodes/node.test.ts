import {
  Node
} from '../..'

function create() {
  return new Node()
}

let node
beforeEach(() => {
  node = create()
})

test('Node: create', () => {
  expect(typeof node).toBe('object')
})

test('Node: .node_defs', () => {
  expect(typeof node.node_defs).toEqual({})
})

test('Node: .nodes', () => {
  expect(typeof node.nodes).toEqual([])
})

// TODO: more...
