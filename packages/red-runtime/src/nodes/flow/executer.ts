import {
  Context
} from '../../context'
import { Flow } from './index';

export interface IFlowExecuter {
  start(diff)
  stop(stopList)
}

export class FlowExecuter extends Context implements IFlowExecuter {
  constructor(protected flow: Flow) {
    super()
  }

  /**
   * Start flow
   * @param diff
   */
  start(diff) {
    const {
      flow,
      rebind
    } = this

    let {
      catchNodeMap,
      statusNodeMap
    } = flow

    const {
      $global,
      activeNodes,
      subflowInstanceNodes
    } = flow
    const {
      createNode,
      createSubflow
    } = rebind([
        'createNode',
        'createSubflow'
      ], flow)

    var node;
    var newNode;
    var id;

    var configNodes = Object.keys(flow.configs);
    var configNodeAttempts = {};
    while (configNodes.length > 0) {
      id = configNodes.shift();
      node = flow.configs[id];
      if (!activeNodes[id]) {
        var readyToCreate = true;
        // This node doesn't exist.
        // Check it doesn't reference another non-existent config node
        for (var prop in node) {
          if (node.hasOwnProperty(prop) && prop !== 'id' && prop !== 'wires' && prop !== '_users' && flow.configs[node[prop]]) {
            if (!activeNodes[node[prop]]) {
              // References a non-existent config node
              // Add it to the back of the list to try again later
              configNodes.push(id);
              configNodeAttempts[id] = (configNodeAttempts[id] || 0) + 1;
              if (configNodeAttempts[id] === 100) {
                throw new Error("Circular config node dependency detected: " + id);
              }
              readyToCreate = false;
              break;
            }
          }
        }
        if (readyToCreate) {
          newNode = createNode(node.type, node);
          if (newNode) {
            activeNodes[id] = newNode;
          }
        }
      }
    }

    if (diff && diff.rewired) {
      for (var j = 0; j < diff.rewired.length; j++) {
        var rewireNode = activeNodes[diff.rewired[j]];
        if (rewireNode) {
          rewireNode.updateWires(flow.nodes[rewireNode.id].wires);
        }
      }
    }

    for (id in flow.nodes) {
      if (flow.nodes.hasOwnProperty(id)) {
        node = flow.nodes[id];
        if (!node.subflow) {
          if (!activeNodes[id]) {
            newNode = createNode(node.type, node);
            if (newNode) {
              activeNodes[id] = newNode;
            }
          }
        } else {
          if (!subflowInstanceNodes[id]) {
            try {
              var nodes = createSubflow(flow.subflows[node.subflow] ||
                $global.subflows[node.subflow], node, flow.subflows, $global.subflows, activeNodes);

              subflowInstanceNodes[id] = nodes.map(function (n) {
                return n.id
              });

              for (var i = 0; i < nodes.length; i++) {
                if (nodes[i]) {
                  activeNodes[nodes[i].id] = nodes[i];
                }
              }
            } catch (err) {
              console.log(err.stack)
            }
          }
        }
      }
    }

    for (id in activeNodes) {
      if (activeNodes.hasOwnProperty(id)) {
        node = activeNodes[id];
        if (node.type === "catch") {
          catchNodeMap[node.z] = catchNodeMap[node.z] || [];
          catchNodeMap[node.z].push(node);
        } else if (node.type === "status") {
          statusNodeMap[node.z] = statusNodeMap[node.z] || [];
          statusNodeMap[node.z].push(node);
        }
      }
    }
  }

  /**
   * Stop flow
   * @param stopList
   */
  async stop(stopList) {
    const {
      flow
    } = this
    const {
      subflowInstanceNodes,
      activeNodes
    } = flow

    var i;
    if (stopList) {
      for (i = 0; i < stopList.length; i++) {
        if (subflowInstanceNodes[stopList[i]]) {
          // The first in the list is the instance node we already
          // know about
          stopList = stopList.concat(subflowInstanceNodes[stopList[i]].slice(1))
        }
      }
    } else {
      stopList = Object.keys(activeNodes);
    }
    var promises = [];
    for (i = 0; i < stopList.length; i++) {
      var node = activeNodes[stopList[i]];
      if (node) {
        delete activeNodes[stopList[i]];
        if (subflowInstanceNodes[stopList[i]]) {
          delete subflowInstanceNodes[stopList[i]];
        }
        try {
          var p = node.close();
          if (p) {
            promises.push(p);
          }
        } catch (err) {
          node.error(err);
        }
      }
    }
    await Promise.all(promises)
  }
}
