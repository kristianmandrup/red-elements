import {
  Context
} from '../../context'
import { Canvas } from '../../';

export class CanvasSelectionManager extends Context {
  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * select All
   */
  selectAll() {
    this.RED.nodes.eachNode(function (n) {
      if (n.z == this.RED.workspaces.active()) {
        if (!n.selected) {
          n.selected = true;
          n.dirty = true;
          this.moving_set.push({
            n: n
          });
        }
      }
    });
    if (this.activeSubflow) {
      this.activeSubflow.in.forEach(function (n) {
        if (!n.selected) {
          n.selected = true;
          n.dirty = true;
          this.moving_set.push({
            n: n
          });
        }
      });
      this.activeSubflow.out.forEach(function (n) {
        if (!n.selected) {
          n.selected = true;
          n.dirty = true;
          this.moving_set.push({
            n: n
          });
        }
      });
    }

    this.selected_link = null;
    this.updateSelection();
    this.redraw();
  }

  /**
   * clear Selection
   */
  clearSelection() {
    for (var i = 0; i < this.moving_set.length; i++) {
      var n = this.moving_set[i];
      n.n.dirty = true;
      n.n.selected = false;
    }
    this.moving_set = [];
    this.selected_link = null;
  }

  /**
   * update Selection
   */
  updateSelection() {
    var selection: any = {};

    if (this.moving_set.length > 0) {
      selection.nodes = this.moving_set.map(function (n) {
        return n.n;
      });
    }
    if (this.selected_link != null) {
      selection.link = this.selected_link;
    }
    var activeWorkspace = this.RED.workspaces.active();
    this.activeLinks = this.RED.nodes.filterLinks({
      source: {
        z: activeWorkspace
      },
      target: {
        z: activeWorkspace
      }
    });
    var tabOrder = this.RED.nodes.getWorkspaceOrder();
    var currentLinks = this.activeLinks;
    var addedLinkLinks = {};
    this.activeFlowLinks = [];
    for (var i = 0; i < this.moving_set.length; i++) {
      if (this.moving_set[i].n.type === 'link out' || this.moving_set[i].n.type === 'link in') {
        var linkNode = this.moving_set[i].n;
        var offFlowLinks = {};
        linkNode.links.forEach(function (id) {
          var target = this.RED.nodes.node(id);
          if (target) {
            if (linkNode.type === 'link out') {
              if (target.z === linkNode.z) {
                if (!addedLinkLinks[linkNode.id + ':' + target.id]) {
                  this.activeLinks.push({
                    source: linkNode,
                    sourcePort: 0,
                    target: target,
                    link: true
                  });
                  addedLinkLinks[linkNode.id + ':' + target.id] = true;
                }
              } else {
                offFlowLinks[target.z] = offFlowLinks[target.z] || [];
                offFlowLinks[target.z].push(target);
              }
            } else {
              if (target.z === linkNode.z) {
                if (!addedLinkLinks[target.id + ':' + linkNode.id]) {
                  this.activeLinks.push({
                    source: target,
                    sourcePort: 0,
                    target: linkNode,
                    link: true
                  });
                  addedLinkLinks[target.id + ':' + linkNode.id] = true;
                }
              } else {
                offFlowLinks[target.z] = offFlowLinks[target.z] || [];
                offFlowLinks[target.z].push(target);
              }
            }
          }
        });
        var offFlows = Object.keys(offFlowLinks);
        // offFlows.sort(function(A,B) {
        //     return tabOrder.indexOf(A) - tabOrder.indexOf(B);
        // });
        if (offFlows.length > 0) {
          this.activeFlowLinks.push({
            refresh: Math.floor(Math.random() * 10000),
            node: linkNode,
            links: offFlowLinks //offFlows.map(function(i) { return {id:i,links:offFlowLinks[i]};})
          });
        }
      }
    }

    var selectionJSON = activeWorkspace + ':' + JSON.stringify(selection, function (key, value) {
      if (key === 'nodes') {
        return value.map(function (n) {
          return n.id
        })
      } else if (key === 'link') {
        return value.source.id + ':' + value.sourcePort + ':' + value.target.id;
      }
      return value;
    });
    if (selectionJSON !== this.lastSelection) {
      this.lastSelection = selectionJSON;
      this.RED.events.emit('view:selection-changed', selection);
    }
  }

  /**
   * move Selection
   * @param dx
   * @param dy
   */
  moveSelection(dx, dy) {
    if (this.moving_set.length > 0) {
      if (!this.endMoveSet) {
        $(document).one('keyup', this.endKeyboardMove);
        this.endMoveSet = true;
      }
      var minX = 0;
      var minY = 0;
      var node;

      for (var i = 0; i < this.moving_set.length; i++) {
        node = this.moving_set[i];
        node.n.moved = true;
        node.n.dirty = true;
        if (node.ox == null && node.oy == null) {
          node.ox = node.n.x;
          node.oy = node.n.y;
        }
        node.n.x += dx;
        node.n.y += dy;
        node.n.dirty = true;
        minX = Math.min(node.n.x - node.n.w / 2 - 5, minX);
        minY = Math.min(node.n.y - node.n.h / 2 - 5, minY);
      }

      if (minX !== 0 || minY !== 0) {
        for (var n = 0; n < this.moving_set.length; n++) {
          node = this.moving_set[n];
          node.n.x -= minX;
          node.n.y -= minY;
        }
      }

      this.redraw();
    }
  }


  /**
   * edit Selection
   */
  editSelection() {
    if (this.moving_set.length > 0) {
      var node = this.moving_set[0].n;
      if (node.type === 'subflow') {
        this.RED.editor.editSubflow(this.activeSubflow);
      } else {
        this.RED.editor.edit(node);
      }
    }
  }

  /**
   * delete Selection
   */
  deleteSelection() {
    if (this.moving_set.length > 0 || this.selected_link != null) {
      var result;
      var removedNodes = [];
      var removedLinks = [];
      var removedSubflowOutputs = [];
      var removedSubflowInputs = [];
      var subflowInstances = [];

      var startDirty = this.RED.nodes.dirty();
      var startChanged = false;
      if (this.moving_set.length > 0) {
        for (var i = 0; i < this.moving_set.length; i++) {
          var node = this.moving_set[i].n;
          node.selected = false;
          if (node.type != 'subflow') {
            if (node.x < 0) {
              node.x = 25
            }
            var removedEntities = this.RED.nodes.remove(node.id);
            removedNodes.push(node);
            removedNodes = removedNodes.concat(removedEntities.nodes);
            removedLinks = removedLinks.concat(removedEntities.links);
          } else {
            if (node.direction === 'out') {
              removedSubflowOutputs.push(node);
            } else if (node.direction === 'in') {
              removedSubflowInputs.push(node);
            }
            node.dirty = true;
          }
        }
        if (removedSubflowOutputs.length > 0) {
          result = this.RED.subflow.removeOutput(removedSubflowOutputs);
          if (result) {
            removedLinks = removedLinks.concat(result.links);
          }
        }
        // Assume 0/1 inputs
        if (removedSubflowInputs.length == 1) {
          result = this.RED.subflow.removeInput();
          if (result) {
            removedLinks = removedLinks.concat(result.links);
          }
        }
        var instances = this.RED.subflow.refresh(true);
        if (instances) {
          subflowInstances = instances.instances;
        }
        this.moving_set = [];
        if (removedNodes.length > 0 || removedSubflowOutputs.length > 0 || removedSubflowInputs.length > 0) {
          this.RED.nodes.dirty(true);
        }
      }
      if (this.selected_link) {
        this.RED.nodes.removeLink(this.selected_link);
        removedLinks.push(this.selected_link);
        this.RED.nodes.dirty(true);
      }
      var historyEvent = {
        t: 'delete',
        nodes: removedNodes,
        links: removedLinks,
        subflowOutputs: removedSubflowOutputs,
        subflowInputs: removedSubflowInputs,
        subflow: {
          instances: subflowInstances
        },
        dirty: startDirty
      };
      this.RED.history.push(historyEvent);

      this.selected_link = null;
      this.updateActiveNodes();
      this.updateSelection();
      this.redraw();
    }
  }

  /**
   * copy Selection
   */
  copySelection() {
    if (this.moving_set.length > 0) {
      var nns = [];
      for (var n = 0; n < this.moving_set.length; n++) {
        var node = this.moving_set[n].n;
        // The only time a node.type == subflow can be selected is the
        // input/output 'proxy' nodes. They cannot be copied.
        if (node.type != 'subflow') {
          for (var d in node._def.defaults) {
            if (node._def.defaults.hasOwnProperty(d)) {
              if (node._def.defaults[d].type) {
                var configNode = this.RED.nodes.node(node[d]);
                if (configNode && configNode._def.exclusive) {
                  nns.push(this.RED.nodes.convertNode(configNode));
                }
              }
            }
          }
          nns.push(this.RED.nodes.convertNode(node));
          //TODO: if the node has an exclusive config node, it should also be copied, to ensure it remains exclusive...
        }
      }
      this.clipboard = JSON.stringify(nns);
      this.RED.notify(this.RED._('clipboard.nodeCopied', {
        count: nns.length
      }), null);
    }
  }

  /**
   * Select a selection
   * @param selection
   */
  select(selection) {
    const {
      clearSelection,
      updateSelection,
      redraw
    } = this

    if (typeof selection !== 'undefined') {
      clearSelection();
      if (typeof selection == 'string') {
        var selectedNode = this.RED.nodes.node(selection);
        if (selectedNode) {
          selectedNode.selected = true;
          selectedNode.dirty = true;
          this.moving_set = [{
            n: selectedNode
          }];
        }
      }
    }
    updateSelection();
    redraw();
    return this
  }

  /**
   * make a selection
   */
  selection() {
    var selection: any = {};
    if (this.moving_set.length > 0) {
      selection.nodes = this.moving_set.map(function (n) {
        return n.n;
      });
    }
    if (this.selected_link != null) {
      selection.link = this.selected_link;
    }
    return selection;
  }
}
