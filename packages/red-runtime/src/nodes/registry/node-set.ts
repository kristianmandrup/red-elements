import {
  NodesRegistry
} from '.'

export interface NodeSet {
  id: string
  name: string
  added: boolean
  module: any
  local: boolean
  types: string[]
  version: string
  pending_version: string
}

export interface INodeSetManager {
  addNodeSet(ns: NodeSet): NodesRegistry
  removeNodeSet(id: string): NodeSet
  getNodeSet(id: string): NodeSet
  enableNodeSet(id: string): NodesRegistry
  disableNodeSet(id: string): NodesRegistry
  getNodeSetForType(nodeType: string): NodeSet
}

import {
  Context
} from '../../context'

const { log } = console

export class NodeSetManager extends Context implements INodeSetManager {
  constructor(public registry: NodesRegistry) {
    super()
  }

  addNodeSet(ns: NodeSet): NodesRegistry {
    const {
      registry
    } = this

    let {
      RED,
      moduleList,
      nodeSets,
      typeToId,
      nodeList
    } = registry

    const id = ns.id
    ns.added = false;
    nodeSets[id] = ns;

    this._validateNodeSet(ns, 'ns', 'addNodeSet')

    log('addNodeSet: populate typeToId with type map for node set ids')
    for (var j = 0; j < ns.types.length; j++) {
      const type = ns.types[j]
      log({
        id,
        type,
        typeToId
      })
      typeToId[type] = ns.id;
    }

    nodeList.push(ns);
    log('pushed ns to nodeList', {
      typeToId,
      nodeList,
      ns
    })

    moduleList[ns.module] = moduleList[ns.module] || {
      name: ns.module,
      version: ns.version,
      local: ns.local,
      sets: {}
    };
    if (ns.pending_version) {
      moduleList[ns.module].pending_version = ns.pending_version;
    }
    moduleList[ns.module].sets[ns.name] = ns;
    RED.events.emit("registry:node-set-added", ns);

    this.setInstanceVars({
      typeToId,
      nodeList,
      moduleList
    })
    return registry
  }

  removeNodeSet(id: string): NodeSet {
    const {
      registry
    } = this

    let {
      RED,
      nodeSets,
      typeToId,
      nodeList,
      moduleList
    } = registry

    var ns = nodeSets[id];
    for (var j = 0; j < ns.types.length; j++) {
      delete typeToId[ns.types[j]];
    }
    delete nodeSets[id];
    for (var i = 0; i < nodeList.length; i++) {
      if (nodeList[i].id === id) {
        nodeList.splice(i, 1);
        break;
      }
    }
    delete moduleList[ns.module].sets[ns.name];
    if (Object.keys(moduleList[ns.module].sets).length === 0) {
      delete moduleList[ns.module];
    }
    RED.events.emit("registry:node-set-removed", ns);
    return ns;
  }

  getNodeSet(id: string): NodeSet {
    const {
      registry
    } = this

    const {
      nodeSets
    } = registry
    return nodeSets[id];
  }

  enableNodeSet(id: string): NodesRegistry {
    const {
      registry
    } = this
    const {
      RED,
      nodeSets
    } = registry

    var ns = nodeSets[id];
    ns.enabled = true;
    RED.events.emit("registry:node-set-enabled", ns);
    return registry
  }

  disableNodeSet(id: string): NodesRegistry {
    const {
      registry
    } = this
    const {
      RED,
      nodeSets
    } = registry

    var ns = nodeSets[id];
    ns.enabled = false;
    RED.events.emit("registry:node-set-disabled", ns);
    return registry
  }

  getNodeSetForType(nodeType: string): NodeSet {
    const {
      registry
    } = this
    const {
      typeToId
    } = registry

    this._validateStr(nodeType, 'nodeType', 'getNodeSetForType')

    const {
      getNodeSet,
    } = this.rebind([
        'getNodeSet'
      ])

    return getNodeSet(typeToId[nodeType]);
  }

}
