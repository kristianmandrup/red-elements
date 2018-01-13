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

test('registry: setModulePendingUpdated - module not registered', () => {
  let moduleId = 'x'
  let version = 1
  expect(() => registry.setModulePendingUpdated(moduleId, version)).toThrow()
})

test('registry: setModulePendingUpdated', () => {
  let moduleId = 'x'
  let version = 1
  // add fake (empty) module
  registry.moduleList[moduleId] = {

  }
  registry.setModulePendingUpdated(moduleId, version)
  let v = registry.getModule(moduleId).pending_version
  expect(v).toBe(version)
})

test('registry: getModule', () => {
  let name = 'hello'
  let ns = {
    module: name,
    types: [
      'string'
    ]
  }
  registry.addNodeSet(ns)

  // {
  //   "local": undefined,
  //   "name": {"id": "x"},
  //   "sets": {
  //     "undefined": {"added": false, "module": {"id": "x"}, "types": ["string"]}
  //   },
  //   "version": undefined
  // }
  let registered = registry.getModule(name)
  expect(registered.name).toEqual(name)
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
  let ns = {
    id,
    module,
    types: [
      'string'
    ]
  }
  registry.addNodeSet(ns)
  registry.removeNodeSet(id)
  let set = registry.getNodeSet(ns.id)
  expect(set).toBeFalsy()
})

test('registry: addNodeSet', () => {
  let id = 'a'
  let module = 'hello'
  let ns = {
    id,
    module,
    types: [
      'string'
    ]

  }
  registry.addNodeSet(ns)
  let set = registry.getNodeSet(ns.id)
  expect(set).toBe(ns)
})

test('registry: getNodeSet', () => {
  let id = 'a'
  let module = 'hello'
  let ns = {
    id,
    module,
    types: [
      'string'
    ]
  }
  registry.addNodeSet(ns)
  let set = registry.getNodeSet(ns.id)
  expect(set).toBe(ns)
})

test('registry: enableNodeSet', () => {
  let id = 'a'
  let module = 'hello'
  let ns = {
    id,
    module,
    types: [
      'string'
    ]
  }
  registry.addNodeSet(ns)
  registry.enableNodeSet(ns.id)
  let set = registry.getNodeSet(ns.id)
  expect(set.enabled).toBeTruthy()
})

test('registry: disableNodeSet', () => {
  let id = 'a'
  let module = 'hello'
  let ns = {
    id,
    module,
    types: [
      'string'
    ]
  }
  registry.addNodeSet(ns)
  registry.enableNodeSet(ns.id)
  let set = registry.getNodeSet(ns.id)
  expect(set.enabled).toBeTruthy()
  registry.disableNodeSet(ns.id)
  expect(set.enabled).toBeFalsy()
})

test('registry: registerNodeType', () => {
  let nt = 'config' // must match name in NodeSet types
  let def = {
    id: 'my-def'
  }

  let module = 'hello'
  let id = 'blip'
  let ns = {
    id,
    set: {
      module
    },
    types: [
      'config'
    ]
  }
  registry.addNodeSet(ns)

  registry.registerNodeType(nt, def)
  expect(registry.nodeDefinitions[nt]).toEqual(def)
})

test('registry: removeNodeType - subflow', () => {
  let nt = 'subflow:config'
  let def = {
    id: 'x',
  }

  let module = 'hello'
  let id = 'blip'
  let ns = {
    id,
    set: {
      module
    },
    types: [
      'subflow:config'
    ]
  }

  registry.addNodeSet(ns)

  registry.registerNodeType(nt, def)
  registry.removeNodeType(nt)
  expect(registry.nodeDefinitions[nt]).toBeFalsy()
})

test('registry: removeNodeType - not a subflow throws', () => {
  let nt = 'config'
  let def = {
    id: 'x',
  }
  let module = 'hello'
  let id = 'blip'
  let ns = {
    id,
    set: {
      module
    },
    types: [
      'config'
    ]
  }
  registry.addNodeSet(ns)
  registry.registerNodeType(nt, def)

  expect(() => registry.removeNodeType(nt)).toThrow()
})


test('registry: getNodeType', () => {
  let nt = 'config'
  let def = {
    id: 'x',
  }
  let module = 'hello'
  let id = 'blip'
  let ns = {
    id,
    set: {
      module
    },
    types: [
      'config'
    ]
  }
  registry.addNodeSet(ns)
  registry.registerNodeType(nt, def)
  let node = registry.getNodeType(nt)
  expect(node).toBe(def)
})
