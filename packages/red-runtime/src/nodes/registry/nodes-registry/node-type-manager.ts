import {
  NodesRegistry
} from '.'

export interface INodeTypeManager {
  registerNodeType(nt: string, def: any): NodesRegistry
  removeNodeType(nt: string): NodesRegistry
  getNodeType(nt: string): any
}

import {
  Context,
  lazyInject,
  $TYPES,
  delegateTarget,
} from '../../_base'

import {
  IEvents,
  II18n,
  INodeSet
} from '../../../interfaces';

const TYPES = $TYPES.all
const { log } = console

@delegateTarget()
export class NodeTypeManager extends Context implements INodeTypeManager {
  @lazyInject(TYPES.events) $events: IEvents
  @lazyInject(TYPES.i18n) $i18n: II18n

  constructor(public registry: NodesRegistry) {
    super()
  }

  registerNodeType(nt: string, def: any): NodesRegistry {
    const {
      registry,
      $i18n,
      $events
    } = this
    const {
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

      let nodeSet: INodeSet = nodeSets[id]

      log({
        nodeSet
      })


      /* edited code start*/
      def.set = {}
      if (nodeSet)
        def.set = nodeSet
      else
        def.set = {}
      /* edited code end*/


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
        var result = $i18n.t.apply(null, args);
        if (result === args[0]) {
          result = original;
        }
        return result;
      }

      // TODO: too tightly coupled into palette UI
    }
    $events.emit("registry:node-type-added", nt);
    return registry
  }

  removeNodeType(nt: string): NodesRegistry {
    const {
      registry,
      $events
    } = this

    let {
      nodeDefinitions
    } = registry

    if (nt.substring(0, 8) != "subflow:") {
      // NON-NLS - internal debug message
      throw new Error(`this api is subflow only (ie. 'subflow:xyz'). called with: ${nt}`);
    }
    delete nodeDefinitions[nt];
    $events.emit("registry:node-type-removed", nt);
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
