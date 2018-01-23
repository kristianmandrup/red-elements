import {
  Context
} from '../../context'
import { Canvas } from '../../';

export class CanvasNodeImporter extends Context {
  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * Imports a new collection of nodes from a JSON String.
   *  - all get new IDs assigned
   *  - all 'selected'
   *  - attached to mouse for placing - 'IMPORT_DRAGGING'
   */
  importNodes(newNodesStr, addNewFlow?, touchImport?) {
    try {
      var activeSubflowChanged;
      if (this.activeSubflow) {
        activeSubflowChanged = this.activeSubflow.changed;
      }
      var result = this.RED.nodes.import(newNodesStr, true, addNewFlow);
      if (result) {
        var new_nodes = result[0];
        var new_links = result[1];
        var new_workspaces = result[2];
        var new_subflows = result[3];
        var new_default_workspace = result[4];
        if (addNewFlow && new_default_workspace) {
          this.RED.workspaces.show(new_default_workspace.id);
        }
        var new_ms = new_nodes.filter(function (n) {
          return n.hasOwnProperty('x') && n.hasOwnProperty('y') && n.z == this.RED.workspaces.active()
        }).map(function (n) {
          return {
            n: n
          };
        });
        var new_node_ids = new_nodes.map(function (n) {
          return n.id;
        });

        // TODO: pick a more sensible root node
        if (new_ms.length > 0) {
          var root_node = new_ms[0].n;
          var dx = root_node.x;
          var dy = root_node.y;

          if (this.mouse_position == null) {
            this.mouse_position = [0, 0];
          }

          var minX = 0;
          var minY = 0;
          var i;
          var node;

          for (i = 0; i < new_ms.length; i++) {
            node = new_ms[i];
            node.n.selected = true;
            node.n.changed = true;
            node.n.moved = true;
            node.n.x -= dx - this.mouse_position[0];
            node.n.y -= dy - this.mouse_position[1];
            node.dx = node.n.x - this.mouse_position[0];
            node.dy = node.n.y - this.mouse_position[1];
            minX = Math.min(node.n.x - this.node_width / 2 - 5, minX);
            minY = Math.min(node.n.y - this.node_height / 2 - 5, minY);
          }
          for (i = 0; i < new_ms.length; i++) {
            node = new_ms[i];
            node.n.x -= minX;
            node.n.y -= minY;
            node.dx -= minX;
            node.dy -= minY;
            if (node.n._def.onadd) {
              try {
                node.n._def.onadd.call(node.n);
              } catch (err) {
                console.log('Definition error: ' + node.n.type + '.onadd:', err);
              }
            }

          }
          if (!touchImport) {
            this.mouse_mode = this.RED.state.IMPORT_DRAGGING;
            this.spliceActive = false;
            if (new_ms.length === 1) {
              node = new_ms[0];
              this.spliceActive = node.n.hasOwnProperty('_def') &&
                node.n._def.inputs > 0 &&
                node.n._def.outputs > 0;
            }
          }
          this.RED.keyboard.add('*', 'escape', function () {
            this.RED.keyboard.remove('escape');
            this.clearSelection();
            this.RED.history.pop();
            this.mouse_mode = 0;
          });
          this.clearSelection();
          this.moving_set = new_ms;
        }

        var historyEvent: any = {
          t: 'add',
          nodes: new_node_ids,
          links: new_links,
          workspaces: new_workspaces,
          subflows: new_subflows,
          dirty: this.RED.nodes.dirty()
        };
        if (new_ms.length === 0) {
          this.RED.nodes.dirty(true);
        }
        if (this.activeSubflow) {
          var subflowRefresh = this.RED.subflow.refresh(true);
          if (subflowRefresh) {
            historyEvent.subflow = {
              id: this.activeSubflow.id,
              changed: activeSubflowChanged,
              instances: subflowRefresh.instances
            }
          }
        }
        this.RED.history.push(historyEvent);

        this.updateActiveNodes();
        this.redraw();
      }
    } catch (error) {
      // if (error.code != 'NODE_RED') {
      //   console.log(error.stack);
      //   this.RED.notify(this.RED._('notification.error', {
      //     message: error.toString()
      //   }), 'error');
      // } else {
      //   this.RED.notify(this.RED._('notification.error', {
      //     message: error.message
      //   }), 'error');
      // }
    }
    return this
  }
}
