import {
  Nodes
} from '../..'

function create() {
  return new Nodes()
}

let nodes
beforeEach(() => {
  nodes = create()
})

const FAKE_RED = {}

function merge(a, b) {
  return Object.assign(a, b)
}

function fakeNode(override = {}) {
  return Object.assign({
    id: 'x',
    in: {},
    out: {},
    type: 'subflow',
    _def: {
      credentials: {},
      defaults: {},
      set: {
        module: 'node-red'
      }
    }
  }, override)
}

test('Nodes: create', () => {
  expect(typeof nodes).toBe('object')
})

test('Nodes: create - has registry', () => {
  expect(typeof nodes.registry).toBe('object')
})

test('Nodes: create - has empty configNodes collection object', () => {
  expect(nodes.configNodes).toEqual({})
})

test('Nodes: create - has empty nodes list', () => {
  expect(nodes.nodes).toEqual({})
})

test('Nodes: getID is a 14+ char string', () => {
  const id = nodes.getID()
  expect(typeof id).toBe('string')
  expect(id.length).toBeGreaterThanOrEqual(14)
})

test('Nodes: addNode - category: config', () => {
  let node = fakeNode()
  nodes.addNode(node)
  expect(nodes.configNodes[node.id]).toBe(node)
})

test('Nodes: getNode - finds it', () => {
  let id = 'a'
  let found = nodes.getNode('id')
  expect(found).toBeFalsy()

  // TODO: use node factory function
  // See: node-editor/test/editor.test.ts
  let node = fakeNode({
    id
  })

  nodes.addNode(node)
  found = nodes.getNode(node.id)
  expect(found).toBe(node)
})

test.only('Nodes: removeNode - removes it', () => {
  let id = 'a'
  let node = fakeNode({
    id
  })
  nodes.addNode(node)
  let found = nodes.getNode(id)
  expect(found).toBeTruthy()

  let removed = nodes.removeNode(id)

  // TODO: Fix
  const linksRemoved = []
  const nodesRemoved = []
  expect(removed.links).toEqual(linksRemoved)
  expect(removed.nodes).toEqual(nodesRemoved)

  found = nodes.getNode(id)
  expect(found).toBeFalsy()
})

test('Nodes: addLink', () => {
  let link = {
    id: 'a'
  }
  nodes.addLink(link)
  let found = nodes.links.find(link)
  expect(found).toBeTruthy()
})

test('Nodes: removeLink - removes it', () => {
  let link = {
    id: 'a'
  }
  nodes.removeLink(link)
  let found = nodes.links.find(link)
  expect(found).toBeFalsy()
})

test('Nodes: addWorkspace - adds it', () => {
  let ws = {
    id: 'a'
  }
  nodes.addWorkspace(ws)
  let found = nodes.getWorkspace(ws.id)
  expect(found).toBeTruthy()
})

test('Nodes: getWorkspace - finds it', () => {
  let ws = {
    id: 'a'
  }
  nodes.addWorkspace(ws)
  let found = nodes.getWorkspace(ws.id)
  expect(found).toBeTruthy()
})

test('Nodes: removeWorkspace - removes it', () => {
  let ws = {
    id: 'a'
  }
  nodes.addWorkspace(ws)
  nodes.removeWorkspace(ws.id)
  let found = nodes.getWorkspace(ws.id)
  expect(found).toBeFalsy()
})

test('Nodes: addSubflow - adds it', () => {
  let subflow = {
    id: 'a'
  }
  nodes.addSubflow(subflow)
  let found = nodes.getSubflow(subflow.id)
  expect(found).toBeTruthy()
})

test('Nodes: getSubflow - finds it', () => {
  let subflow = {
    id: 'a'
  }
  nodes.addSubflow(subflow)
  let found = nodes.getSubflow(subflow.id)
  expect(found).toBeTruthy()
})

test('Nodes: removeSubflow - removes it', () => {
  let subflow = {
    id: 'a'
  }
  nodes.addSubflow(subflow)
  nodes.removeSubflow(subflow.id)
  let found = nodes.getSubflow(subflow.id)
  expect(found).toBeFalsy()
})

test('Nodes: subflowContains', () => {
  let sfid = 'x'
  let nodeid = 'a'
  let subflow = {
    id: sfid
  }
  nodes.addSubflow(subflow)

  let found = nodes.subflowContains(sfid, nodeid)
  expect(found).toBeTruthy()
})

test('Nodes: getAllFlowNodes', () => {

  // todo: add flow nodes

  let flowNodes = nodes.getAllFlowNodes()
  expect(flowNodes).toBeTruthy()
})

// TODO: test conversion
test('Nodes: convertWorkspace', () => {
  let node = {
    id: 'a'
  }
  let convertedNode = nodes.convertWorkspace(node)
  expect(convertedNode).toBeTruthy()
})

// TODO: test conversion
test('Nodes: convertNode', () => {
  let node = {
    id: 'a'
  }
  let exportCreds = false
  let convertedNode = nodes.convertNode(node, exportCreds)
  expect(convertedNode).toBeTruthy()
})

// TODO: test conversion
test('Nodes: convertSubflow', () => {
  let node = {
    id: 'a'
  }
  let convertedNode = nodes.convertSubflow(node)
  expect(convertedNode).toBeTruthy()
})

test('Nodes: createExportableNodeSet', () => {
  let node = {
    id: 'a'
  }
  // TODO: test real data
  let set = [node]
  let exportedSubflows = {}
  let exportedConfigNodes = {}

  let convertedSet = nodes.createExportableNodeSet(set, exportedSubflows, exportedConfigNodes)
  expect(convertedSet).toBeTruthy()
})

test('Nodes: createExportableNodeSet', () => {
  let exportCredentials = {}
  let set = nodes.createCompleteNodeSet(exportCredentials)
  expect(set).toBeTruthy()
})

test('Nodes: checkForMatchingSubflow', () => {
  let node = {
    id: 'a'
  }
  let subflow = {}
  let subflowNodes = [node]
  let set = nodes.checkForMatchingSubflow(subflow, subflowNodes)
  expect(set).toBeTruthy()
})

test('Nodes: compareNodes', () => {
  let nodeA = {
    id: 'a'
  }
  let nodeB = {
    id: 'b'
  }
  let idMustMatch = true
  let result = nodes.compareNodes(nodeA, nodeB, idMustMatch)
  expect(result).toBeFalsy()

  result = nodes.compareNodes(nodeA, nodeA, false)
  expect(result).toBeTruthy()
})

test('Nodes: importNodes', () => {
  let newNodesObj = {
    id: 'a'
  }
  let createMissingWorkspace = true
  let createNewIds = true
  let results = nodes.importNodes(newNodesObj, createNewIds, createMissingWorkspace)
  // return [new_nodes, new_links, new_workspaces, new_subflows, missingWorkspace];

  // TODO: test result...
  let node = results[0]
  expect(node).toBe(newNodesObj)
})

test('Nodes: filterNodes', () => {
  let filter = {
    type: 'x'
  }
  let nodeA = {
    id: 'a',
    type: 'x'
  }
  let nodeB = {
    id: 'b'
  }
  nodes.addNode(nodeA)
  nodes.addNode(nodeB)
  let filtered = nodes.filterNodes(filter)
  expect(filtered.length).toBe(1)
  expect(filtered[0]).toBe(nodeA)
})

test('Nodes: filterLinks', () => {
  let filter = {
    type: 'x'
  }
  let linkA = {
    type: 'x'
  }
  let linkB = {
    type: 'y'
  }

  nodes.addLink()
  let filtered = nodes.filterLinks(filter)
  expect(filtered.length).toBe(1)
  expect(filtered[0]).toBe(linkA)
})

test('Nodes: updateConfigNodeUsers', () => {
  let node = {
    id: 'a',
    type: 'x'
  }
  nodes.updateConfigNodeUsers(node)
  let user = nodes.configNodes.users[0]
  let expectedUser = {}
  expect(user).toEqual(expectedUser)
})

test('Nodes: flowVersion', () => {
  let version = nodes.flowVersion()
  expect(version).toBe('1')
})

test('Nodes: clear', () => {
  nodes.clear()
  expect(nodes.nodes).toEqual([])
  expect(nodes.links).toEqual([])
})

test('Nodes: getWorkspaceOrder', () => {
  let expected = nodes.workspacesOrder
  let order = nodes.getWorkspaceOrder()
  expect(order).toBe(expected)
})

test('Nodes: setWorkspaceOrder', () => {
  let expected = 2
  let order = nodes.setWorkspaceOrder(expected)
  expect(order).toBe(expected)
})

test('Nodes: eachNode', () => {

})
test('Nodes: eachLink', () => {

})
test('Nodes: eachConfig', () => {

})
test('Nodes: eachSubflow', () => {

})
test('Nodes: eachWorkspace', () => {

})
test('Nodes: originalFlow', () => {

})
test('Nodes: dirty', () => {

})
