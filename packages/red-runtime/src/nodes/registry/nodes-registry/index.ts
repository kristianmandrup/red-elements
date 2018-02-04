import {
  Context,
  lazyInject,
  delegator,
  delegateTarget,
  $TYPES
} from '../../_base'

const { log } = console

import {
  INodeSetManager,
  NodeSetManager
} from './node-set-manager'

import {
  INodeSet,
  INode,
  IEvents
} from '../../../interfaces'

import {
  INodeTypeManager,
  NodeTypeManager
} from './node-type-manager'

const TYPES = $TYPES.all

export interface INodesRegistry {
  // delegating to NodeSetManager
  addNodeSet(ns: INodeSet): INodesRegistry
  removeNodeSet(id: string): INodeSet
  getNodeSet(id: string): INodeSet
  getNodeSet(id: string): INodeSet
  enableNodeSet(id: string): INodesRegistry
  disableNodeSet(id: string): INodesRegistry
  getNodeSetForType(nodeType: string): INodeSet

  // delegating to NodeTypeManager
  registerNodeType(nt: string, def: any)
  removeNodeType(nt: string): INodesRegistry
  getNodeType(nt: string): any
  setModulePendingUpdated(moduleId, version)
  getModule(moduleId: string)
  getModuleList()
  getNodeList()
  getNodeTypes()
  setNodeList(list: INode[])
}

@delegateTarget()
@delegator({
  map: {
    nodeSetManager: 'INodeSetManager',
    nodeTypeManager: 'INodeTypeManager'
  }
})
export class NodesRegistry extends Context {
  public moduleList = {};
  public nodeList = [];
  public nodeSets = {};
  public typeToId = {};
  public nodeDefinitions: any = {
    tab: {
      defaults: {
        label: {
          value: ""
        },
        disabled: {
          value: false
        },
        info: {
          value: ""
        }
      }
    }
  }

  @lazyInject(TYPES.events) $events: IEvents

  protected nodeSetManager: INodeSetManager
  protected nodeTypeManager: INodeTypeManager

  constructor() {
    super()
  }

  // delegating to NodeSetManager
  addNodeSet(ns: INodeSet): INodesRegistry {
    return this.nodeSetManager.addNodeSet(ns)
  }
  removeNodeSet(id: string): INodeSet {
    return this.nodeSetManager.removeNodeSet(id)
  }
  getNodeSet(id: string): INodeSet {
    return this.nodeSetManager.getNodeSet(id)
  }
  enableNodeSet(id: string): INodesRegistry {
    return this.nodeSetManager.enableNodeSet(id)
  }

  disableNodeSet(id: string): INodesRegistry {
    return this.nodeSetManager.disableNodeSet(id)
  }

  getNodeSetForType(nodeType: string): INodeSet {
    return this.nodeSetManager.getNodeSetForType(nodeType)
  }

  // delegating to NodeTypeManager
  registerNodeType(nt: string, def: any) {
    return this.nodeTypeManager.registerNodeType(nt, def)
  }

  removeNodeType(nt: string): INodesRegistry {
    return this.nodeTypeManager.removeNodeType(nt)
  }

  getNodeType(nt: string): any {
    return this.nodeTypeManager.getNodeType(nt)
  }

  setModulePendingUpdated(moduleId, version) {
    const {
      $events,
      moduleList
    } = this

    let $module = this.getModule(moduleId)
    $module.pending_version = version;
    $events.emit("registry:module-updated", {
      module: moduleId,
      version: version
    });
  }

  getModule(moduleId: string) {
    const {
      moduleList
    } = this

    this._validateStr(moduleId, 'moduleId', 'getModule')

    let $module = moduleList[moduleId]
    if (!$module) {
      this.handleError(`no such module registered: ${moduleId}`, {
        moduleId,
        module: $module
      })
      return this
    }

    return $module
  }

  getModuleList() {
    return this.moduleList;
  }

  getNodeList() {
    return this.nodeList;
  }

  getNodeTypes() {
    return Object.keys(this.nodeDefinitions);
  }

  setNodeList(list: INode[]) {
    let {
      nodeList,
      addNodeSet
    } = this.rebind([
        'addNodeSet'
      ])

    nodeList = [];
    for (var i = 0; i < list.length; i++) {
      var ns = list[i];
      addNodeSet(ns);
    }
  }
}
