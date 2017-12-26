import {
  NodesRegistry
} from '../..'


function create() {
  return new NodesRegistry()
}

let registry
beforeEach(() => {
  registry = create()
})


test('NodesRegistry: create', () => {
  expect(typeof registry).toBe('object')
})

test('registry: setModulePendingUpdated', () => {
  let module = 'x'
  let version = 1
  registry.setModulePendingUpdated(module, version)
  let v = registry.moduleList[module].pending_version
  expect(v).toBe(version)
})

test('registry: getModule', () => {
  let _module = {
    id: 'x'
  }
  let ns = {
    module: _module
  }
  registry.addNodeSet(ns)
  let registered = registry.getModule(_module)
  expect(registered).toBe(_module)
})

test('registry: getNodeSetForType', () => {
  let nodeType = 'io'
  registry.getNodeSetForType(nodeType)

})

test('registry: getModuleList', () => {
  registry.getModuleList()
})

test('registry: getNodeList', () => {
  registry.getNodeList()
})

test('registry: getNodeTypes', () => {
  registry.getNodeTypes()
})

test('registry: setNodeList', () => {
  let list = []
  registry.setNodeList(list)
})

test('registry: removeNodeSet', () => {
  let id = 'a'
  registry.removeNodeSet(id)
})

test('registry: addNodeSet', () => {
  let module = {
    id: 'x'
  }
  let ns = {
    id: 'a',
    module
  }
  registry.addNodeSet(ns)
  let set = registry.getNodeSet(ns.id)
  expect(set).toBe(ns)
})

test('registry: getNodeSet', () => {
  let module = {
    id: 'x'
  }
  let ns = {
    id: 'a',
    module
  }
  registry.addNodeSet(ns)
  let set = registry.getNodeSet(ns.id)
  expect(set).toBe(ns)
})

test('registry: enableNodeSet', () => {
  let module = {
    id: 'x'
  }
  let ns = {
    id: 'a',
    module
  }
  registry.addNodeSet(ns)
  registry.enableNodeSet(ns.id)
  let set = registry.getNodeSet(ns.id)
  expect(set.enabled).toBeTruthy()
})

test('registry: disableNodeSet', () => {
  let module = {
    id: 'x'
  }
  let ns = {
    id: 'a',
    module
  }
  registry.addNodeSet(ns)
  registry.enableNodeSet(ns.id)
  let set = registry.getNodeSet(ns.id)
  expect(set.enabled).toBeTruthy()
  registry.disableNodeSet(ns.id)
  expect(set.enabled).toBeFalsy()
})

test('registry: registerNodeType', () => {
  let nt = 'io'
  let def = {
    id: 'x'
  }
  registry.registerNodeType(nt, def)
  expect(registry.nodeDefinitions[nt]).toEqual(def)
})

test('registry: removeNodeType', () => {
  let nt = 'io'
  let def = {
    id: 'x'
  }
  registry.registerNodeType(nt, def)
  registry.removeNodeType(nt)
  expect(registry.nodeDefinitions[nt]).toBeFalsy()
})

test('registry: getNodeType', () => {
  let nt = 'io'
  let def = {
    id: 'x'
  }
  registry.registerNodeType(nt, def)
  let node = registry.getNodeType(nt)
  expect(node).toBe(def)
})
