import {
  Context,
  delegator,
  delegateTarget,
  $TYPES,
  lazyInject,
  todo,
  IRedUtils,
  clone
} from './_base'
const TYPES = $TYPES.all

import { Flow } from './index';

export interface IFlowBuilder {
  createNode(type: string, config: any)
  createSubflow(sf, sfn, subflows, globalSubflows, activeNodes)
}

@delegateTarget()
export class FlowBuilder extends Context implements IFlowBuilder {
  @lazyInject(TYPES.redUtils) $redUtils: IRedUtils

  constructor(protected flow: Flow) {
    super()
  }

  /**
   * create Node in flow
   * @param type
   * @param config
   */
  createNode(type: string, config: any) {
    const {
      flow
    } = this

    const {
      keys,
      logger,
      typeRegistry,
      flowUtil
    } = flow
    const {
      log,
      error,
    } = this.rebind([
        'log',
        'error'
      ], flow)

    var nn = null;
    // TODO: Fix - see node-red Flow.js
    // Registry:
    // function getNodeConstructor(type) {
    //   var id = nodeTypeToId[type];

    var nt = typeRegistry.get(type);
    if (nt) {
      var conf = clone(config);
      delete conf.credentials;
      for (var p in conf) {
        if (conf.hasOwnProperty(p)) {
          flowUtil.mapEnvVarProperties(conf, p);
        }
      }
      try {
        nn = new nt(conf);
      } catch (err) {
        log({
          level: keys.ERROR,
          id: conf.id,
          type: type,
          msg: err
        });
      }
    } else {
      error(logger._("nodes.flow.unknown-type", {
        type: type
      }));
    }
    return nn;
  }

  /**
   * create Subflow
   * @param sf
   * @param sfn
   * @param subflows
   * @param globalSubflows
   * @param activeNodes
   */
  createSubflow(sf, sfn, subflows, globalSubflows, activeNodes) {
    const {
      flow,
      rebind,
      $redUtils
    } = this

    const {
      createNode,
      createSubflow
    } = this.rebind([
        'createNode',
        'createSubflow'
      ], flow)

    //console.log("CREATE SUBFLOW",sf.id,sfn.id);
    var nodes = [];
    var node_map = {};
    var newNodes = [];
    var node;
    var wires;
    var i, j, k;

    var createNodeInSubflow = function (def) {
      node = clone(def);
      var nid = $redUtils.generateId();
      node_map[node.id] = node;
      node._alias = node.id;
      node.id = nid;
      node.z = sfn.id;
      newNodes.push(node);
    }

    // Clone all of the subflow node definitions and give them new IDs
    for (i in sf.configs) {
      if (sf.configs.hasOwnProperty(i)) {
        createNodeInSubflow(sf.configs[i]);
      }
    }
    // Clone all of the subflow node definitions and give them new IDs
    for (i in sf.nodes) {
      if (sf.nodes.hasOwnProperty(i)) {
        createNodeInSubflow(sf.nodes[i]);
      }
    }

    // Look for any catch/status nodes and update their scope ids
    // Update all subflow interior wiring to reflect new node IDs
    for (i = 0; i < newNodes.length; i++) {
      node = newNodes[i];
      if (node.wires) {
        var outputs = node.wires;
        for (j = 0; j < outputs.length; j++) {
          wires = outputs[j];
          for (k = 0; k < wires.length; k++) {
            outputs[j][k] = node_map[outputs[j][k]].id
          }
        }
        if ((node.type === 'catch' || node.type === 'status') && node.scope) {
          node.scope = node.scope.map(function (id) {
            return node_map[id] ? node_map[id].id : ""
          })
        } else {
          for (var prop in node) {
            if (node.hasOwnProperty(prop) && prop !== '_alias') {
              if (node_map[node[prop]]) {
                //console.log("Mapped",node.type,node.id,prop,node_map[node[prop]].id);
                node[prop] = node_map[node[prop]].id;
              }
            }
          }
        }
      }
    }

    // Create a subflow node to accept inbound messages and route appropriately
    var Node = require("../Node");

    // TODO: Fix - IFlow
    var subflowInstance: any = {
      id: sfn.id,
      type: sfn.type,
      z: sfn.z,
      name: sfn.name,
      wires: []
    }
    if (sf.in) {
      subflowInstance.wires = sf.in.map(function (n) {
        return n.wires.map(function (w) {
          return node_map[w.id].id;
        })
      })
      subflowInstance._originalWires = clone(subflowInstance.wires);
    }
    var subflowNode = new Node(subflowInstance);

    subflowNode.on("input", function (msg) {
      this.send(msg);
    });


    subflowNode._updateWires = subflowNode.updateWires;

    subflowNode.updateWires = function (newWires) {
      // Wire the subflow outputs
      if (sf.out) {
        var node, wires, i, j;
        // Restore the original wiring to the internal nodes
        subflowInstance.wires = clone(subflowInstance._originalWires);
        for (i = 0; i < sf.out.length; i++) {
          wires = sf.out[i].wires;
          for (j = 0; j < wires.length; j++) {
            if (wires[j].id != sf.id) {
              node = node_map[wires[j].id];
              if (node._originalWires) {
                node.wires = clone(node._originalWires);
              }
            }
          }
        }

        var modifiedNodes = {};
        var subflowInstanceModified = false;

        for (i = 0; i < sf.out.length; i++) {
          wires = sf.out[i].wires;
          for (j = 0; j < wires.length; j++) {
            if (wires[j].id === sf.id) {
              subflowInstance.wires[wires[j].port] = subflowInstance.wires[wires[j].port].concat(newWires[i]);
              subflowInstanceModified = true;
            } else {
              node = node_map[wires[j].id];
              node.wires[wires[j].port] = node.wires[wires[j].port].concat(newWires[i]);
              modifiedNodes[node.id] = node;
            }
          }
        }
        Object.keys(modifiedNodes).forEach(function (id) {
          var node = modifiedNodes[id];
          subflowNode.instanceNodes[id].updateWires(node.wires);
        });
        if (subflowInstanceModified) {
          subflowNode._updateWires(subflowInstance.wires);
        }
      }
    }

    nodes.push(subflowNode);

    // Wire the subflow outputs
    if (sf.out) {
      var modifiedNodes = {};
      for (i = 0; i < sf.out.length; i++) {
        wires = sf.out[i].wires;
        for (j = 0; j < wires.length; j++) {
          if (wires[j].id === sf.id) {
            // A subflow input wired straight to a subflow output
            subflowInstance.wires[wires[j].port] = subflowInstance.wires[wires[j].port].concat(sfn.wires[i])
            subflowNode._updateWires(subflowInstance.wires);
          } else {
            node = node_map[wires[j].id];
            modifiedNodes[node.id] = node;
            if (!node._originalWires) {
              node._originalWires = clone(node.wires);
            }
            node.wires[wires[j].port] = (node.wires[wires[j].port] || []).concat(sfn.wires[i]);
          }
        }
      }
    }

    // Instantiate the nodes
    for (i = 0; i < newNodes.length; i++) {
      node = newNodes[i];
      var type = node.type;

      var m = /^subflow:(.+)$/.exec(type);
      if (!m) {
        var newNode = createNode(type, node);
        if (newNode) {
          activeNodes[node.id] = newNode;
          nodes.push(newNode);
        }
      } else {
        var subflowId = m[1];
        nodes = nodes.concat(createSubflow(subflows[subflowId] || globalSubflows[subflowId], node, subflows, globalSubflows, activeNodes));
      }
    }

    subflowNode.instanceNodes = {};

    nodes.forEach(function (node) {
      subflowNode.instanceNodes[node.id] = node;
    });
    return nodes;
  }
}
