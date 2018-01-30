import { Diff } from './'
import {
  log,
  $,
  Context,
  container,
  delegate
} from './_base'


@delegate({
  container,
})
export class NodesParser extends Context {
  constructor(public diff: Diff) {
    super()
  }


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
