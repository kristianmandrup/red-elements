import {
  NodesRegistry
} from '.'

import {
  INodeSet,
  IEvents
} from '../../../interfaces'

export interface INodeSetManager {
  addNodeSet(ns: INodeSet): NodesRegistry
  removeNodeSet(id: string): INodeSet
  getNodeSet(id: string): INodeSet
  enableNodeSet(id: string): NodesRegistry
  disableNodeSet(id: string): NodesRegistry
  getNodeSetForType(nodeType: string): INodeSet
}

import {
  Context,
  lazyInject,
  $TYPES,
  delegateTarget,
} from '../../_base'

const TYPES = $TYPES.all

const { log } = console

@delegateTarget()
export class NodeSetManager extends Context implements INodeSetManager {
  @lazyInject(TYPES.events) $events: IEvents

  constructor(public registry: NodesRegistry) {
    super()
  }

  addNodeSet(ns: INodeSet): NodesRegistry {
    const {
      registry,
      $events
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

    log('addINodeSet: populate typeToId with type map for node set ids')
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
    $events.emit("registry:node-set-added", ns);

    this.setInstanceVars({
      typeToId,
      nodeList,
      moduleList
    })
    return registry
  }

  removeNodeSet(id: string): INodeSet {
    const {
      registry,
      $events
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
    $events.emit("registry:node-set-removed", ns);
    return ns;
  }

  getNodeSet(id: string): INodeSet {
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
      registry,
      $events
    } = this
    const {
      RED,
      nodeSets
    } = registry

    var ns = nodeSets[id];
    ns.enabled = true;
    $events.emit("registry:node-set-enabled", ns);
    return registry
  }

  disableNodeSet(id: string): NodesRegistry {
    const {
      registry,
      $events
    } = this
    const {
      RED,
      nodeSets
    } = registry

    var ns = nodeSets[id];
    ns.enabled = false;
    $events.emit("registry:node-set-disabled", ns);
    return registry
  }

  getNodeSetForType(nodeType: string): INodeSet {
    const {
      registry
    } = this
    const {
      typeToId
    } = registry

    this._validateStr(nodeType, 'nodeType', 'getINodeSetForType')

    const {
      getNodeSet,
    } = this.rebind([
        'getNodeSet'
      ])

    return getNodeSet(typeToId[nodeType]);
  }

}
