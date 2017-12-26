import {
  Nodes
} from '../..'

function create() {
  return new Nodes()
}

let nodes
test.beforeEach(() => {
  nodes = create()
})

test('nodes: create', () => {
  t.is(typeof nodes, 'object')
})

test('nodes: getID', () => {
  t.is(typeof nodes.getID(), 'number')
})

test('nodes: addNode', () => {
  let node = {
    id: 'a'
  }
  nodes.addNode(node)
  t.is(nodes.configNodes[node.id], node)
})

test('nodes: getNode - finds it', () => {
  let found = nodes.getNode('b')
  t.falsy(found)

  let node = {
    id: 'a'
  }
  let found = nodes.getNode(node.id)
  t.is(found, node)
})

test('nodes: removeNode - removes it', () => {
  let node = {
    id: 'a'
  }
  nodes.removeNode(node)
  let found = nodes.getNode(node.id)
  t.falsy(found)
})

test('nodes: addLink', () => {
  let link = {
    id: 'a'
  }
  nodes.addLink(link)
  let found = nodes.links.find(link)
  expect(found).toBeTruthy()
})

test('nodes: removeLink - removes it', () => {
  let link = {
    id: 'a'
  }
  nodes.removeLink(link)
  let found = nodes.links.find(link)
  expect(found).toBeFalsy()
})

test('nodes: addWorkspace - adds it', () => {
  let ws = {
    id: 'a'
  }
  nodes.addWorkspace(ws)
  let found = nodes.getWorkspace(ws.id)
  t.truthy(found)
})

test('nodes: getWorkspace - finds it', () => {
  let ws = {
    id: 'a'
  }
  nodes.addWorkspace(ws)
  let found = nodes.getWorkspace(ws.id)
  t.truthy(found)
})

test('nodes: removeWorkspace - removes it', () => {
  let ws = {
    id: 'a'
  }
  nodes.addWorkspace(ws)
  nodes.removeWorkspace(ws.id)
  let found = nodes.getWorkspace(ws.id)
  t.falsy(found)
})

test('nodes: addSubflow - adds it', () => {
  let subflow = {
    id: 'a'
  }
  nodes.addSubflow(subflow)
  let found = nodes.getSubflow(subflow.id)
  t.truthy(found)
})

test('nodes: getSubflow - finds it', () => {
  let subflow = {
    id: 'a'
  }
  nodes.addSubflow(subflow)
  let found = nodes.getSubflow(subflow.id)
  t.truthy(found)
})

test('nodes: removeSubflow - removes it', () => {
  let subflow = {
    id: 'a'
  }
  nodes.addSubflow(subflow)
  nodes.removeSubflow(subflow.id)
  let found = nodes.getSubflow(ws.id)
  t.falsy(found)
})

test('nodes: subflowContains', () => {
  let sfid = 'x'
  let nodeid = 'a'
  let subflow = {
    id: sfid
  }
  nodes.addSubflow(subflow)

  let found = nodes.subflowContains(sfid, nodeid)
  t.truthy(found)
})

test('nodes: getAllFlowNodes', () => {

  // todo: add flow nodes

  let flowNodes = nodes.getAllFlowNodes(node)
  t.truthy(flowNodes)
})

// TODO: test conversion
test('nodes: convertWorkspace', () => {
  let node = {
    id: 'a'
  }
  let convertedNode = nodes.convertWorkspace(node)
  t.truthy(convertedNode)
})

// TODO: test conversion
test('nodes: convertNode', () => {
  let node = {
    id: 'a'
  }
  let exportCreds = false
  let convertedNode = nodes.convertNode(node, exportCreds)
  t.truthy(convertedNode)
})

// TODO: test conversion
test('nodes: convertSubflow', () => {
  let node = {
    id: 'a'
  }
  let convertedNode = nodes.convertSubflow(node)
  t.truthy(convertedNode)
})

test('nodes: createExportableNodeSet', () => {
  let node = {
    id: 'a'
  }
  // TODO: test real data
  let set = [node]
  let exportedSubflows = {}
  let exportedConfigNodes = {}

  let convertedSet = nodes.createExportableNodeSet(set, exportedSubflows, exportedConfigNodes)
  t.truthy(convertedSet)
})

test('nodes: createExportableNodeSet', () => {
  let exportCredentials = {}
  let set = nodes.createCompleteNodeSet(exportCredentials)
  t.truthy(set)
})

test('nodes: checkForMatchingSubflow', () => {
  let node = {
    id: 'a'
  }
  let subflow = {}
  let subflowNodes = [node]
  let set = nodes.checkForMatchingSubflow(subflow, subflowNodes)
  t.truthy(set)
})

test('nodes: compareNodes', () => {
  let nodeA = {
    id: 'a'
  }
  let nodeB = {
    id: 'b'
  }
  let idMustMatch = true
  let result = nodes.compareNodes(nodeA, nodeB, idMustMatch)
  t.falsy(result)

  result = nodes.compareNodes(nodeA, nodeA, false)
  t.truthy(result)
})

test('nodes: importNodes', () => {
  let newNodesObj = {
    id: 'a'
  }
  let createMissingWorkspace = true
  let createNewIds = true
  let result = nodes.importNodes(newNodesObj, createNewIds, createMissingWorkspace)
  // return [new_nodes, new_links, new_workspaces, new_subflows, missingWorkspace];

  // TODO: test result...
  t.is(result[0], newNodesObj)
})

test('nodes: filterNodes', () => {
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
  t.is(filtered.length, 1)
  t.is(filtered[0], nodeA)
})

test('nodes: filterLinks', () => {
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
  t.is(filtered.length, 1)
  t.is(filtered[0], linkA)
})

test('nodes: updateConfigNodeUsers', () => {
  let node = {
    id: 'a',
    type: 'x'
  }
  nodes.updateConfigNodeUsers(node)
  let user = nodes.configNodes.users[0]
  let expectedUser = {}
  t.deepEqual(user, expectedUser)
})

test('nodes: flowVersion', () => {
  let version = nodes.flowVersion()
  t.is(version, '1')
})

test('nodes: clear', () => {
  nodes.clear()
  t.deepEqual(nodes.nodes, [])
  t.deepEqual(nodes.links, [])
})

test('nodes: getWorkspaceOrder', () => {
  let expected = nodes.workspacesOrder
  let order = nodes.getWorkspaceOrder()
  t.is(order, expected)
})

test('nodes: setWorkspaceOrder', () => {
  let expected = 2
  let order = nodes.setWorkspaceOrder(expected)
  t.is(order, expected)
})

test('nodes: eachNode', () => {

})
test('nodes: eachLink', () => {

})
test('nodes: eachConfig', () => {

})
test('nodes: eachSubflow', () => {

})
test('nodes: eachWorkspace', () => {

})
test('nodes: originalFlow', () => {

})
test('nodes: dirty', () => {

})
