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

const { log } = console

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
  expect(nodes.nodes).toEqual([])
})

test('Nodes: create - has empty links list', () => {
  expect(nodes.links).toEqual([])
})

test('Nodes: create - has empty workspaces set', () => {
  expect(nodes.workspaces).toEqual({})
})

test('Nodes: create - has empty workspacesOrder list', () => {
  expect(nodes.workspacesOrder).toEqual([])
})

test('Nodes: create - has empty subflows set', () => {
  expect(nodes.subflows).toEqual({})
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

test('Nodes: removeNode - removes it', () => {
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
  const id = 'a'
  let link = {
    id
  }
  nodes.addLink(link)
  let found = nodes.links.find(link => link.id === id)
  expect(found).toBeTruthy()
})

test('Nodes: removeLink - removes it', () => {
  const id = 'a'
  let link = {
    id
  }
  nodes.removeLink(link)
  let found = nodes.links.find(link => link.id === id)
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
  const id = 'a'
  let ws = {
    id
  }
  nodes.addWorkspace(ws)
  nodes.removeWorkspace(id)
  let found = nodes.getWorkspace(id)
  expect(found).toBeFalsy()
})

test('Nodes: addSubflow - adds it', () => {
  const id = 'a'
  let subflow = fakeNode({
    id
  })
  nodes.addSubflow(subflow)
  let found = nodes.getSubflow(id)
  expect(found).toBeTruthy()
})

test('Nodes: getSubflow - finds it', () => {
  const id = 'a'
  let subflow = fakeNode({
    id
  })
  nodes.addSubflow(subflow)
  let found = nodes.getSubflow(id)
  expect(found).toBeTruthy()
})

test('Nodes: removeSubflow - by id removes it', () => {
  const id = 'a'
  let subflow = fakeNode({
    id
  })
  nodes.addSubflow(subflow)
  nodes.removeSubflow(id)
  let found = nodes.getSubflow(id)
  expect(found).toBeFalsy()
})

test('Nodes: removeSubflow - by subflow node removes it', () => {
  const id = 'a'
  let subflow = fakeNode({
    id
  })
  nodes.addSubflow(subflow)
  nodes.removeSubflow(id)
  let found = nodes.getSubflow(id)
  expect(found).toBeFalsy()
})


test('Nodes: subflowContains', () => {
  let sfid = 'x'
  let nodeid = 'a'
  let subflowConfig = fakeNode({
    z: sfid,
    id: sfid,
    type: 'subflow:config'
  })
  let subflow = fakeNode({
    id: sfid,
    type: 'config'
  })
  nodes.addNode(subflowConfig)
  nodes.addSubflow(subflow)

  let found = nodes.subflowContains(sfid, nodeid)
  expect(found).toBeTruthy()
})

test('Nodes: getAllFlowNodes', () => {
  // TODO: create test factory for setting up flow for testing
  let nodeA = fakeNode({
    id: 'a',
    type: 'subflow'
  })
  let nodeB = fakeNode({
    id: 'b',
    type: 'subflow'
  })

  // todo: add flow nodes
  const id = 'c'
  let node = fakeNode({
    id
  })

  let flowNodes = nodes.getAllFlowNodes(node)
  expect(flowNodes).toBeTruthy()
})

// TODO: test conversion
test('Nodes: convertWorkspace', () => {
  const id = 'a'
  let node = fakeNode({
    id
  })
  let convertedNode = nodes.convertWorkspace(node)
  expect(convertedNode).toBeTruthy()
})

// TODO: test conversion
test('Nodes: convertSubflow', () => {
  const id = 'a'
  let node = fakeNode({
    id,
    in: [],
    out: []
  })
  let convertedNode = nodes.convertSubflow(node)
  expect(convertedNode).toBeTruthy()
})

test('Nodes: convertSubflow - missing in', () => {
  const id = 'a'
  let node = fakeNode({
    id,
    out: []
  })
  expect(() => nodes.convertSubflow(node)).toThrow()
})

test('Nodes: convertSubflow - missing out', () => {
  const id = 'a'
  let node = fakeNode({
    id,
    in: []
  })
  expect(() => nodes.convertSubflow(node)).toThrow()
})

// TODO: test conversion
test('Nodes: convertNode', () => {
  const id = 'a'
  let node = fakeNode({
    id,
    in: [],
    out: []
  })
  let exportCreds = false
  let convertedNode = nodes.convertNode(node, exportCreds)
  expect(convertedNode).toBeTruthy()
})

test('Nodes: createExportableNodeSet - missing in/out', () => {
  const id = 'a'
  let node = fakeNode({
    id
  })
  // TODO: test real data
  let set = [node]
  let exportedSubflows = {}
  let exportedConfigNodes = {}

  expect(() => nodes.createExportableNodeSet(set, exportedSubflows, exportedConfigNodes)).toThrow()
})

test('Nodes: createExportableNodeSet', () => {
  const id = 'a'
  let node = fakeNode({
    id,
    in: [],
    out: []
  })
  // TODO: test real data
  let set = [node]
  let exportedSubflows = {}
  let exportedConfigNodes = {}

  let convertedSet = nodes.createExportableNodeSet(set, exportedSubflows, exportedConfigNodes)
  expect(convertedSet).toBeTruthy()
})

test('Nodes: createCompleteNodeSet with NO/default exportCredentials', () => {
  let exportCredentials = {}

  nodes.configNodes.users = fakeNode({
    id: 'my-user'
  })

  let set = nodes.createCompleteNodeSet()
  expect(set).toBeTruthy()
})

test('Nodes: createCompleteNodeSet w exportCredentials', () => {
  let exportCredentials = {
    username: 'kris',
    password: 'secret'
  }

  nodes.configNodes.users = fakeNode({
    id: 'my-user'
  })

  let set = nodes.createCompleteNodeSet(exportCredentials)
  expect(set).toBeTruthy()
})

test.only('Nodes: checkForMatchingSubflow', () => {
  const id = 'a'
  let node = fakeNode({
    id,
    in: [],
    out: []
  })

  // Fake the eachSubflow iterator
  nodes.RED.nodes.eachSubflow = (cb) => {
    cb(node)
  }

  let subflow = fakeNode({})
  let subflowNodes = [subflow]
  let set = nodes.checkForMatchingSubflow(subflow, subflowNodes)
  expect(set).toBeTruthy()
})

test('Nodes: compareNodes', () => {
  const id = 'a'
  let nodeA = fakeNode({
    id
  })
  let nodeB = fakeNode({
    id: 'b'
  })
  let idMustMatch = true
  let result = nodes.compareNodes(nodeA, nodeB, idMustMatch)
  expect(result).toBeFalsy()

  result = nodes.compareNodes(nodeA, nodeA, false)
  expect(result).toBeTruthy()
})

test('Nodes: importNodes - missing in/out', () => {
  const id = 'a'
  let newNodesObj = fakeNode({
    id
  })
  let createMissingWorkspace = true
  let createNewIds = true
  expect(() => nodes.importNodes(newNodesObj, createNewIds, createMissingWorkspace)).toThrow()
})

test('Nodes: importNodes', () => {
  const id = 'a'
  let newNodesObj = fakeNode({
    id,
    in: [],
    out: []
  })
  let createMissingWorkspace = true
  let createNewIds = true
  let results = nodes.importNodes(newNodesObj, createNewIds, createMissingWorkspace)

  let found = results.filter(imported => Array.isArray(imported) && typeof imported[0] === 'object')

  // return [new_nodes, new_links, new_workspaces, new_subflows, missingWorkspace];
  let node = found[0][0]

  // TODO: test result...
  log('importNodes', {
    results,
    found,
    node,
    newNodesObj
  })

  expect(node.id).toBe(newNodesObj.id)
})

test('Nodes: filterNodes', () => {
  let filter = {
    type: 'x'
  }
  let nodeA = fakeNode({
    id: 'a',
    type: 'x'
  })
  let nodeB = fakeNode({
    id: 'b'
  })

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

  nodes.addLink(linkA)
  let filtered = nodes.filterLinks(filter)
  expect(filtered.length).toBe(1)
  expect(filtered[0]).toBe(linkA)
})

test('Nodes: updateConfigNodeUsers', () => {
  let node = fakeNode({
    id: 'a',
    type: 'x',
    _def: {
      set: {},
      defaults: {
        custom: {
          // registry.getNodeType(property.type) must be able to find the node type
          type: 'age',
          category: 'config'
        }
      }
    }
  })

  // TODO: Fix and also add Type interface for it!?
  const ns = {
    id: 'basic',
    types: {
      age: {

      }
    },
    module: 'demo',
    version: 1,
    local: true,
    pending_version: 2
  }

  nodes.registry.addNodeSet(ns)

  // Note: the node type is looked up in the node sets registered in registry
  nodes.registry.registerNodeType('age', {
    category: 'config'
  })

  nodes.updateConfigNodeUsers(node)
  log({
    users: nodes.configNodes.users
  })
  // TODO: not sure this is correct approach. users might be keyed by ID?
  let user = nodes.configNodes.users[0]
  let expectedUser = {}
  expect(user).toEqual(expectedUser)
})

test('Nodes: flowVersion', () => {
  const versionId = '1'
  let version = nodes.flowVersion(versionId)
  expect(version).toBe(versionId)
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

test.only('Nodes: setWorkspaceOrder - fails if not Array', () => {
  let newOrder = {}
  expect(() => nodes.setWorkspaceOrder(newOrder)).toThrow()
})

test.only('Nodes: setWorkspaceOrder', () => {
  let newOrder = [
    {
      id: 'a'
    }
  ]
  nodes.setWorkspaceOrder(newOrder)
  expect(nodes.workspacesOrder).toBe(newOrder)
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
