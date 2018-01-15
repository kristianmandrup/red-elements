import {
  Nodes,
} from '../nodes'

import {
  Node,
} from '../interfaces'

import {
  Context
} from '../../context'

export class Exporter extends Context {
  constructor(public nodes: Nodes) {
    super()
  }

  /**
   * Converts the current node selection to an exportable JSON Object
   * @param set { Node[] } set of nodes to export
   * @param exportedSubflows { object } map of subflows by ID to be exported
   * @param exportedConfigNodes { object } map of config nodes by ID to be exported
   */
  createExportableNodeSet(set: Node[], exportedSubflows: object, exportedConfigNodes: object) {
    const {
      nodes
    } = this

    const {
      RED,
      registry,
      configNodes,
    } = nodes
    const {
      getSubflow,
      createExportableNodeSet,
      convertSubflow,
    } = this.rebind([
        'getSubflow',
        'createExportableNodeSet',
        'convertSubflow'
      ], nodes)

    const $nodes = this

    var nns = [];
    exportedConfigNodes = exportedConfigNodes || {};
    exportedSubflows = exportedSubflows || {};
    for (var n = 0; n < set.length; n++) {
      var node: Node = set[n];

      this._validateNode(node, 'node', 'createExportableNodeSet', 'iterate node set')
      this._validateStr(node.type, 'node.type', 'createExportableNodeSet', 'iterate node set')

      if (node.type.substring(0, 8) == "subflow:") {
        var subflowId = node.type.substring(8);
        if (!exportedSubflows[subflowId]) {
          exportedSubflows[subflowId] = true;
          var subflow = getSubflow(subflowId);
          var subflowSet = [subflow];
          RED.nodes.eachNode(function (n) {

            $nodes._validateNode(n, 'n', 'iterate RED nodes')

            if (n.z == subflowId) {
              subflowSet.push(n);
            }
          });
          var exportableSubflow = createExportableNodeSet(subflowSet, exportedSubflows, exportedConfigNodes);
          nns = exportableSubflow.concat(nns);
        }
      }
      if (node.type != "subflow") {
        var convertedNode = RED.nodes.convertNode(node);
        for (var d in node._def.defaults) {
          if (node._def.defaults[d].type && node[d] in configNodes) {
            var confNode = configNodes[node[d]];
            var exportable = registry.getNodeType(node._def.defaults[d].type).exportable;
            if ((exportable == null || exportable)) {
              if (!(node[d] in exportedConfigNodes)) {
                exportedConfigNodes[node[d]] = true;
                set.push(confNode);
              }
            } else {
              convertedNode[d] = "";
            }
          }
        }
        nns.push(convertedNode);
      } else {
        var convertedSubflow = convertSubflow(node);
        nns.push(convertedSubflow);
      }
    }
    return nns;
  }

  /**
   * Create a complete node set for export
   * @param exportCredentials { boolean } whether credentials should also be exported
   */
  createCompleteNodeSet(exportCredentials: boolean) {
    const {
      workspacesOrder,
      workspaces,
      subflows,
      nodes,
      configNodes
    } = this.nodes

    const {
      convertWorkspace,
      convertSubflow,
      convertNode
    } = this.rebind([
        'convertWorkspace',
        'convertSubflow',
        'convertNode'
      ], this.nodes)

    if (exportCredentials === undefined) {
      exportCredentials = true;
    }
    var nns = [];
    for (let i = 0; i < workspacesOrder.length; i++) {
      if (workspaces[workspacesOrder[i]].type == "tab") {
        nns.push(convertWorkspace(workspaces[workspacesOrder[i]]));
      }
    }
    for (let flowId in subflows) {
      if (subflows.hasOwnProperty(flowId)) {
        nns.push(convertSubflow(subflows[flowId]));
      }
    }
    for (let nodeId in configNodes) {
      if (configNodes.hasOwnProperty(nodeId)) {
        const configNode = configNodes[nodeId]
        this._validateNode(configNode, 'configNode', 'createCompleteNodeSet', 'iterate configNodes')

        nns.push(convertNode(configNode, exportCredentials));
      }
    }
    for (let nodeId = 0; nodeId < nodes.length; nodeId++) {
      var node = nodes[nodeId];
      this._validateNode(node, 'node', 'createCompleteNodeSet', 'iterate nodes')

      nns.push(convertNode(node, exportCredentials));
    }
    return nns;
  }
}
