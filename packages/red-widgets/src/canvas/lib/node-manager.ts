import {
  Canvas,
  d3,
  Context,
  container,
  delegateTarget,
  lazyInject,
  $TYPES,
} from './_base'

import {
  INodes,
  INotifications,
  IWorkspaces,
  ISubflow
} from '../../_interfaces'

const TYPES = $TYPES.all

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

@delegateTarget()
export class CanvasNodeManager extends Context implements ICanvasNodeManager {
  @lazyInject(TYPES.nodes) nodes: INodes
  @lazyInject(TYPES.notification) notification: INotifications
  @lazyInject(TYPES.workspaces) workspaces: IWorkspaces
  @lazyInject(TYPES.subflow) subflow: ISubflow

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
      canvas,
      nodes
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
      //RED,
      canvas,
      nodes,
      workspaces
    } = this
    let {
      activeNodes,
      activeLinks
    } = canvas

    var activeWorkspace = workspaces.active();

    activeNodes = nodes.filterNodes({
      z: activeWorkspace
    });

    activeLinks = nodes.filterLinks({
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
      //RED,
      canvas,
      nodes,
      notification,
      workspaces,
      subflow
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
        notification.notify(RED._('notification.error', {
          message: RED._('notification.errors.cannotAddSubflowToItself')
        }), 'error', "", 0);
        return;
      }
      if (nodes.subflowContains(m[1], activeSubflow.id)) {
        notification.notify(RED._('notification.error', {
          message: RED._('notification.errors.cannotAddCircularReference')
        }), 'error', "", 0);
        return;
      }
    }

    var nn: any = {
      id: nodes.id(),
      z: workspaces.active()
    };

    nn.type = type;
    nn._def = nodes.getType(nn.type);

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
      var subflow = nodes.subflow(m[1]);
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
      dirty: nodes.dirty()
    }
    if (activeSubflow) {
      var subflowRefresh = subflow.refresh(true);
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
