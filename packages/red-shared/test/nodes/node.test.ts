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
  expect(node.node_defs).toEqual({})
})

test('Node: .nodes', () => {
  expect(node.nodes).toEqual([])
})

test('Node: .links', () => {
  expect(node.links).toEqual([])
})

test('Node: .defaultWorkspace', () => {
  expect(node.defaultWorkspace).toBeUndefined()
})

test('Node: .defaultWorkspace', () => {
  expect(node.workspaces).toEqual({})
})

test('Node: .defaultWorkspace', () => {
  expect(node.workspacesOrder).toEqual([])
})

test('Node: .subflows', () => {
  expect(node.subflows).toEqual({})
})

test('Node: .loadedFlowVersion', () => {
  expect(node.loadedFlowVersion).toEqual(null)
})

test('Node: .initialLoad', () => {
  expect(node.initialLoad).toBeUndefined()
})

test('Node: .dirty', () => {
  expect(node.dirty).toEqual(false)
})


