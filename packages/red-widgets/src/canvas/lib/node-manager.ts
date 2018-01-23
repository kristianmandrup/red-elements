import {
  Context
} from '../../context'
import { Canvas } from '../../';

export class CanvasNodeManager extends Context {
  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * get element position of node
   * @param node
   */
  getNodeElementPosition(node) {
    var d3Node = d3.select(node);
    if (d3Node.attr('class') === 'innerCanvas') {
      return [0, 0];
    }
    var result = [];
    var localPos = [0, 0];
    if (node.nodeName.toLowerCase() === 'g') {
      var transform = d3Node.attr('transform');
      if (transform) {
        // Fix: use d3-geo package, geoTransform
        localPos = d3.geoTransform(transform).translate;
      }
    } else {
      // TODO: FIX
      const x: number = parseInt(d3Node.attr('x')) || 0
      const y: number = parseInt(d3Node.attr('y')) || 0
      localPos = [x, y];
    }
    var parentPos = this.getNodeElementPosition(node.parentNode);
    return [localPos[0] + parentPos[0], localPos[1] + parentPos[1]]
  }

  /**
   * update Active Nodes
   */
  updateActiveNodes() {
    var activeWorkspace = this.RED.workspaces.active();

    this.activeNodes = this.RED.nodes.filterNodes({
      z: activeWorkspace
    });

    this.activeLinks = this.RED.nodes.filterLinks({
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
    var m = /^subflow:(.+)$/.exec(type);

    if (this.activeSubflow && m) {
      var subflowId = m[1];
      if (subflowId === this.activeSubflow.id) {
        this.RED.notify(this.RED._('notification.error', {
          message: this.RED._('notification.errors.cannotAddSubflowToItself')
        }), 'error');
        return;
      }
      if (this.RED.nodes.subflowContains(m[1], this.activeSubflow.id)) {
        this.RED.notify(this.RED._('notification.error', {
          message: this.RED._('notification.errors.cannotAddCircularReference')
        }), 'error');
        return;
      }
    }

    var nn: any = {
      id: this.RED.nodes.id(),
      z: this.RED.workspaces.active()
    };

    nn.type = type;
    nn._def = this.RED.nodes.getType(nn.type);

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
      var subflow = this.RED.nodes.subflow(m[1]);
      nn.inputs = subflow.in.length;
      nn.outputs = subflow.out.length;
    }

    nn.changed = true;
    nn.moved = true;

    nn.w = this.node_width;
    nn.h = Math.max(this.node_height, (nn.outputs || 0) * 15);

    var historyEvent: any = {
      t: 'add',
      nodes: [nn.id],
      dirty: this.RED.nodes.dirty()
    }
    if (this.activeSubflow) {
      var subflowRefresh = this.RED.subflow.refresh(true);
      if (subflowRefresh) {
        historyEvent.subflow = {
          id: this.activeSubflow.id,
          changed: this.activeSubflow.changed,
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
