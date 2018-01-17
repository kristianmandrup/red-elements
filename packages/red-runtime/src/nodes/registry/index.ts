import {
  Context
} from '../../context'

const { log } = console

import {
  INodeSetManager,
  NodeSetManager
} from './node-set-manager'

import {
  INodeSet
} from '../interfaces'

import {
  INodeTypeManager,
  NodeTypeManager
} from './node-type-manager'

import {
  INode
} from '../../interfaces'

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

  // TODO: lazy injection!?
  protected nodeSetManager: INodeSetManager
  protected nodeTypeManager: INodeTypeManager

  constructor() {
    super()
    this.nodeSetManager = new NodeSetManager(this)
    this.nodeTypeManager = new NodeTypeManager(this)
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
      RED,
      moduleList
    } = this

    let $module = this.getModule(moduleId)
    $module.pending_version = version;
    RED.events.emit("registry:module-updated", {
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
