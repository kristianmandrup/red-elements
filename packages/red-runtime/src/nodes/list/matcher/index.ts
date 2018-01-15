import {
  Nodes
} from '../'

import {
  Context
} from '../../../context'

import {
  Subflow,
  Node
} from '../../interfaces'

const { log } = console

export interface INodeMatcher {
  checkForMatchingSubflow(subflow: Node, subflowNodes: Node[]): Subflow | null
  compareNodes(nodeA: Node, nodeB: Node, idMustMatch: boolean): boolean
}

export class NodeMatcher extends Context {
  constructor(public nodes: Nodes) {
    super()
  }

  /**
   * Check if a subflow has a node that matches a given node
   * @param subflow { Node } node subflow
   * @param subflowNodes list of subflow nodes
   */
  checkForMatchingSubflow(subflow: Node, subflowNodes: Node[]): Subflow | null {
    const {
      RED
    } = this
    const {
      createExportableNodeSet
    } = this.rebind([
        'createExportableNodeSet'
      ])

    this._validateNode(subflow, 'subflow', 'checkForMatchingSubflow')
    this._validateArray(subflowNodes, 'subflowNodes', 'checkForMatchingSubflow')

    var i;
    var match = null;
    try {
      RED.nodes.eachSubflow((sf) => {
        this._validateNode(sf, 'sf', 'checkForMatchingSubflow', 'iterate subflow nodes')

        log('eachSubflow', {
          sf
        })

        if (sf.name != subflow.name ||
          sf.info != subflow.info ||
          sf.in.length != subflow.in.length ||
          sf.out.length != subflow.out.length) {
          return;
        }
        var sfNodes = RED.nodes.filterNodes({
          z: sf.id
        });

        const compareLengths = {
          sfNodes: sfNodes.length,
          subflowNodes: subflowNodes.length
        }

        log('original node sets', {
          sfNodes,
          subflowNodes,
          compareLengths
        })

        if (sfNodes.length != subflowNodes.length) {
          log('no match: incompatible lengths', {
            compareLengths
          })
          return null;
        }

        var subflowNodeSet = [subflow].concat(subflowNodes);
        var sfNodeSet = [sf].concat(sfNodes);

        log('after concat', {
          subflowNodeSet,
          sfNodeSet,
          DEFsubflowNodeSet: subflowNodeSet.map(n => n._def),
          DEFsfNodeSet: sfNodeSet.map(n => n._def)
        })

        var exportableSubflowNodes = JSON.stringify(subflowNodeSet);

        // Seems to cut off the credentials!
        // Test if this is current intended behavior, then make sure test runs without credentials?
        const exportableSFNodeSet = createExportableNodeSet(sfNodeSet)
        log({
          exportableSFNodeSet
        })

        var exportableSFNodes = JSON.stringify(exportableSFNodeSet);
        var nodeMap = {};

        for (i = 0; i < sfNodes.length; i++) {
          exportableSubflowNodes = exportableSubflowNodes.replace(new RegExp("\"" + subflowNodes[i].id + "\"", "g"), '"' + sfNodes[i].id + '"');
        }
        exportableSubflowNodes = exportableSubflowNodes.replace(new RegExp("\"" + subflow.id + "\"", "g"), '"' + sf.id + '"');

        const exportableSubflowNodesObj = JSON.parse(exportableSubflowNodes)
        const exportableSFNodesObj = JSON.parse(exportableSFNodes)

        // TODO: avoid string compare, too fragile!
        log('compare', {
          exportableSubflowNodesObj,
          exportableSFNodesObj
        })

        const nodesMatch = exportableSubflowNodesObj.every((sfNode, index) => {
          return this._isEquivalent(sfNode, exportableSFNodesObj[index])
        })

        if (!nodesMatch) {
          log('no match: not equivalent', {
            exportableSubflowNodesObj,
            exportableSFNodesObj
          })
          return null;
        }
        log('found match', {
          sf
        })

        match = sf;
        throw new Error();
      });
    } catch (err) {
      console.log(err.stack);
    }
    return match;
  }

  /**
   * Compare if nodes match (equality)
   * @param nodeA node to to compare
   * @param nodeB { Node } node to compare with
   * @param idMustMatch { boolean } if IDs must match as well to be truly equal
   */
  compareNodes(nodeA: Node, nodeB: Node, idMustMatch: boolean) {
    if (idMustMatch && nodeA.id != nodeB.id) {
      return false;
    }
    if (nodeA.type != nodeB.type) {
      return false;
    }
    var def = nodeA._def;
    for (var d in def.defaults) {
      if (def.defaults.hasOwnProperty(d)) {
        var vA = nodeA[d];
        var vB = nodeB[d];
        if (typeof vA !== typeof vB) {
          return false;
        }
        if (vA === null || typeof vA === "string" || typeof vA === "number") {
          if (vA !== vB) {
            return false;
          }
        } else {
          if (JSON.stringify(vA) !== JSON.stringify(vB)) {
            return false;
          }
        }
      }
    }
    return true;
  }
}
