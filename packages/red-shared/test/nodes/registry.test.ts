import {
  NodesRegistry
} from '../..'


function create() {
  return new NodesRegistry()
}

let registry
test.beforeEach(() => {
  registry = create()
})


test('NodesRegistry: create', () => {
  t.is(typeof registry, 'object')
})

test('registry: setModulePendingUpdated', () => {
  let module = 'x'
  let version = 1
  registry.setModulePendingUpdated(module, version)
  let v = registry.moduleList[module].pending_version
  t.is(v, version)
})

test('registry: getModule', () => {
  let registry = create(ctx)
  let module = {
    id: 'x'
  }
  let ns = {
    module
  }
  registry.addNodeSet(ns)
  let registered = registry.getModule(module)
  t.is(registered, module)
})

test('registry: getNodeSetForType', () => {
  let registry = create(ctx)
  let nodeType = 'io'
  registry.getNodeSetForType(nodeType)

})

test('registry: getModuleList', () => {
  let registry = create(ctx)
  registry.getModuleList()

})

test('registry: getNodeList', () => {
  let registry = create(ctx)
  registry.getNodeList()
})

test('registry: getNodeTypes', () => {
  let registry = create(ctx)
  registry.getNodeTypes()
})

test('registry: setNodeList', () => {
  let registry = create(ctx)
  registry.setNodeList(list)
})

test('registry: removeNodeSet', () => {
  let registry = create(ctx)
  registry.removeNodeSet(id)
})

test('registry: addNodeSet', () => {
  let registry = create(ctx)
  let module = {
    id: 'x'
  }
  let ns = {
    id: 'a',
    module
  }
  registry.addNodeSet(ns)
  let set = registry.getNodeSet(ns.id)
  t.is(set, ns)
})

test('registry: getNodeSet', () => {
  let registry = create(ctx)
  let module = {
    id: 'x'
  }
  let ns = {
    id: 'a',
    module
  }
  registry.addNodeSet(ns)
  let set = registry.getNodeSet(ns.id)
  t.is(set, ns)
})

test('registry: enableNodeSet', () => {
  let registry = create(ctx)
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
  t.truthy(set.enabled)
})

test('registry: disableNodeSet', () => {
  let registry = create(ctx)
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
  t.truthy(set.enabled)
  registry.disableNodeSet(ns.id)
  t.falsy(set.enabled)
})

test('registry: registerNodeType', () => {
  let registry = create(ctx)
  let nt = 'io'
  let def = {
    id: 'x'
  }
  registry.registerNodeType(nt, def)
  t.is(registry.nodeDefinitions[nt], def)
})

test('registry: removeNodeType', () => {
  let registry = create(ctx)
  let nt = 'io'
  let def = {
    id: 'x'
  }
  registry.registerNodeType(nt, def)
  registry.removeNodeType(nt)
  t.falsy(registry.nodeDefinitions[nt])
})

test('registry: getNodeType', () => {
  let registry = create(ctx)
  let nt = 'io'
  let def = {
    id: 'x'
  }
  registry.registerNodeType(nt, def)
  let node = registry.getNodeType(nt)
  t.is(node, def)
})
