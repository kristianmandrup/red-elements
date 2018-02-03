import {
  INodes
} from '../'

import {
  INode,
} from '../../../interfaces'

import {
  Context,
  lazyInject,
  $TYPES,
  delegateTarget
} from '../_base'

import { ISerializer } from './index';

const TYPES = $TYPES.all

export interface IExporter {
  createExportableNodeSet(set: INode[], exportedSubflows: object, exportedConfigNodes: object)
  createCompleteNodeSet(exportCredentials: boolean)
}

@delegateTarget()
export class Exporter extends Context {
  nodes: INodes

  @lazyInject(TYPES.nodes) $nodes: INodes

  constructor(public serializer: ISerializer) {
    super()
    this.nodes = serializer.nodes
  }

  /**
   * Converts the current node selection to an exportable JSON Object
   * @param set { Node[] } set of nodes to export
   * @param exportedSubflows { object } map of subflows by ID to be exported
   * @param exportedConfigNodes { object } map of config nodes by ID to be exported
   */
  createExportableNodeSet(set: INode[], exportedSubflows: object, exportedConfigNodes: object) {
    const {
      $nodes,
      nodes
    } = this

    const {
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

    var nns = [];
    exportedConfigNodes = exportedConfigNodes || {};
    exportedSubflows = exportedSubflows || {};
    for (var n = 0; n < set.length; n++) {
      var node: INode = set[n];

      this._validateNode(node, 'node', 'createExportableNodeSet', 'iterate node set')
      this._validateStr(node.type, 'node.type', 'createExportableNodeSet', 'iterate node set')

      if (node.type.substring(0, 8) == "subflow:") {
        var subflowId = node.type.substring(8);
        if (!exportedSubflows[subflowId]) {
          exportedSubflows[subflowId] = true;
          var subflow = getSubflow(subflowId);
          var subflowSet = [subflow];
          $nodes.eachNode(function (n) {
            if (n.z == subflowId) {
              subflowSet.push(n);
            }
          });
          var exportableSubflow = createExportableNodeSet(subflowSet, exportedSubflows, exportedConfigNodes);
          nns = exportableSubflow.concat(nns);
        }
      }
      if (node.type != "subflow") {
        var convertedNode = $nodes.convertNode(node);
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
      const index = workspacesOrder[i]
      const ws = workspaces[index]
      if (ws.type == "tab") {
        nns.push(convertWorkspace(ws));
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
