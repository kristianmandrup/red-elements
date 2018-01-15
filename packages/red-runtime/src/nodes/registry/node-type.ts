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

export interface INodeTypeManager {
  registerNodeType(nt: string, def: any): NodesRegistry
  removeNodeType(nt: string): NodesRegistry
  getNodeType(nt: string): any
}

import {
  Context
} from '../../context'

const { log } = console

export class NodeTypeManager extends Context implements INodeTypeManager {
  constructor(public registry: NodesRegistry) {
    super()
  }

  registerNodeType(nt: string, def: any): NodesRegistry {
    const {
      registry
    } = this
    const {
      RED,
      typeToId
    } = registry
    let {
      nodeSets,
      nodeDefinitions
    } = registry

    this._validateObj(def, 'def', 'registerNodeType')

    nodeDefinitions = nodeDefinitions || {}
    nodeDefinitions[nt] = def;
    def.type = nt;
    if (def.category != "subflows") {
      const id = typeToId[nt]

      log({
        id,
        nt,
        typeToId,
        nodeSets,
      })

      let nodeSet = nodeSets[id]

      log({
        nodeSet
      })

      def.set = nodeSet
      this._validateObj(def.set, 'def.set', 'registerNodeType')

      if (nodeSet) {
        nodeSet.added = true;
        nodeSet.enabled = true;
      } else {
        this.logWarning(`no nodeSet found for: ${id}`, {
          id,
          nodeSets
        })
      }

      var ns;

      if (def.set.module === "node-red") {
        ns = "node-red";
      } else {
        ns = def.set.id;
      }

      this._validateStr(ns, 'ns', 'registerNodeType', {
        set: def.set
      })

      def["_"] = function () {
        var args = Array.prototype.slice.call(arguments, 0);
        var original = args[0];
        if (args[0].indexOf(":") === -1) {
          args[0] = ns + ":" + args[0];
        }
        var result = RED._.apply(null, args);
        if (result === args[0]) {
          result = original;
        }
        return result;
      }

      // TODO: too tightly coupled into palette UI
    }
    RED.events.emit("registry:node-type-added", nt);
    return registry
  }

  removeNodeType(nt: string): NodesRegistry {
    const {
      registry
    } = this

    let {
      RED,
      nodeDefinitions
    } = registry

    if (nt.substring(0, 8) != "subflow:") {
      // NON-NLS - internal debug message
      throw new Error(`this api is subflow only (ie. 'subflow:xyz'). called with: ${nt}`);
    }
    delete nodeDefinitions[nt];
    RED.events.emit("registry:node-type-removed", nt);
    return registry
  }

  getNodeType(nt: string): any {
    const {
      registry
    } = this
    let {
      nodeDefinitions
    } = registry

    return nodeDefinitions[nt];
  }
}
