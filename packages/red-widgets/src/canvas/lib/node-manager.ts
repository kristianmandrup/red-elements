import { Canvas } from './'

import {
  d3,
  Context,
  container,
  delegateTarget
} from './_base'

export interface ICanvasNodeManager {
  /**
   * get element position of node
   * @param node
   */
  getNodeElementPosition(node)

  /**
   * update Active Nodes
   */
  updateActiveNodes()

  /**
   * Add node
   * @param type
   * @param x
   * @param y
   */
  addNode(type: any, x: any, y: any)
}

@delegateTarget({
  container,
})
export class CanvasNodeManager extends Context implements ICanvasNodeManager {
  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * get element position of node
   * @param node
   */
  getNodeElementPosition(node) {
    const {
      rebind,
      canvas
    } = this
    const {
      getNodeElementPosition
    } = rebind([
        'getNodeElementPosition'
      ], canvas)

    var d3Node = d3.select(node);
    if (d3Node.attr('class') === 'innerCanvas') {
      return [0, 0];
    }
    var result = [];
    var localPos = [0, 0];
    if (node.nodeName.toLowerCase() === 'g') {
      // SEE: https://github.com/trinary/d3-transform#usage
      const transform = d3Node.attr('transform');
      if (transform) {
        // use d3-transform package
        localPos = d3.transform()[transform].translate();
      }
    } else {
      // TODO: FIX
      const x: number = parseInt(d3Node.attr('x')) || 0
      const y: number = parseInt(d3Node.attr('y')) || 0
      localPos = [x, y];
    }
    var parentPos = getNodeElementPosition(node.parentNode);
    return [localPos[0] + parentPos[0], localPos[1] + parentPos[1]]
  }

  /**
   * update Active Nodes
   */
  updateActiveNodes() {
    const {
      RED,
      canvas
    } = this
    let {
      activeNodes,
      activeLinks
    } = canvas

    var activeWorkspace = RED.workspaces.active();

    activeNodes = RED.nodes.filterNodes({
      z: activeWorkspace
    });

    activeLinks = RED.nodes.filterLinks({
      source: {
        z: activeWorkspace
      },
      target: {
        z: activeWorkspace
      }
    });
  }

  /**
   * Add node
   * @param type
   * @param x
   * @param y
   */
  addNode(type: any, x: any, y: any) {
    const {
      RED,
      canvas
    } = this
    const {
      activeSubflow,
      node_width,
      node_height
    } = canvas

    var m = /^subflow:(.+)$/.exec(type);

    if (activeSubflow && m) {
      var subflowId = m[1];
      if (subflowId === activeSubflow.id) {
        RED.notify(RED._('notification.error', {
          message: RED._('notification.errors.cannotAddSubflowToItself')
        }), 'error');
        return;
      }
      if (RED.nodes.subflowContains(m[1], activeSubflow.id)) {
        RED.notify(RED._('notification.error', {
          message: RED._('notification.errors.cannotAddCircularReference')
        }), 'error');
        return;
      }
    }

    var nn: any = {
      id: RED.nodes.id(),
      z: RED.workspaces.active()
    };

    nn.type = type;
    nn._def = RED.nodes.getType(nn.type);

    if (!m) {
      nn.inputs = nn._def.inputs || 0;
      nn.outputs = nn._def.outputs;

      for (var d in nn._def.defaults) {
        if (nn._def.defaults.hasOwnProperty(d)) {
          if (nn._def.defaults[d].value !== undefined) {
            nn[d] = JSON.parse(JSON.stringify(nn._def.defaults[d].value));
          }
        }
      }

      if (nn._def.onadd) {
        try {
          nn._def.onadd.call(nn);
        } catch (err) {
          console.log('Definition error: ' + nn.type + '.onadd:', err);
        }
      }
    } else {
      var subflow = RED.nodes.subflow(m[1]);
      nn.inputs = subflow.in.length;
      nn.outputs = subflow.out.length;
    }

    nn.changed = true;
    nn.moved = true;

    nn.w = node_width;
    nn.h = Math.max(node_height, (nn.outputs || 0) * 15);

    var historyEvent: any = {
      t: 'add',
      nodes: [nn.id],
      dirty: RED.nodes.dirty()
    }
    if (activeSubflow) {
      var subflowRefresh = RED.subflow.refresh(true);
      if (subflowRefresh) {
        historyEvent.subflow = {
          id: activeSubflow.id,
          changed: activeSubflow.changed,
          instances: subflowRefresh.instances
        }
      }
    }
    return {
      node: nn,
      historyEvent: historyEvent
    }

  }
}
