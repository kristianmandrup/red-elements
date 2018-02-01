import { Diff } from './index'

import {
  Context,
  container,
  delegateTarget
} from './_base'

export interface INodesParser {
  parseNodes(nodeList)
}

@delegateTarget({
  container,
})
export class NodesParser extends Context implements INodesParser {
  constructor(public diff: Diff) {
    super()
  }

  /**
   * parse nodes
   * @param nodeList
   */
  parseNodes(nodeList) {
    var tabOrder = [];
    var tabs = {};
    var subflows = {};
    var globals = [];
    var all = {};

    nodeList.forEach((node) => {
      all[node.id] = node;
      if (node.type === 'tab') {
        tabOrder.push(node.id);
        tabs[node.id] = {
          n: node,
          nodes: []
        };
      } else if (node.type === 'subflow') {
        subflows[node.id] = {
          n: node,
          nodes: []
        };
      }
    });
    nodeList.forEach((node) => {
      if (node.type !== 'tab' && node.type !== 'subflow') {
        if (tabs[node.z]) {
          tabs[node.z].nodes.push(node);
        } else if (subflows[node.z]) {
          subflows[node.z].nodes.push(node);
        } else {
          globals.push(node);
        }
      }
    });

    return {
      all: all,
      tabOrder: tabOrder,
      tabs: tabs,
      subflows: subflows,
      globals: globals
    }
  }
}
