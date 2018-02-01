import { Canvas } from './'

import {
  Context,
  container,
  delegateTarget
} from './_base'

export interface ICanvasSelectionManager {
  /**
     * select All
     */
  selectAll()

  /**
   * clear Selection
   */
  clearSelection()

  /**
   * update Selection
   */
  updateSelection()

  /**
   * move Selection
   * @param dx
   * @param dy
   */
  moveSelection(dx, dy)

  /**
     * edit Selection
     */
  editSelection()

  /**
   * delete Selection
   */
  deleteSelection()

  /**
   * copy Selection
   */
  copySelection()

  /**
   * Select a selection
   * @param selection
   */
  select(selection)

  /**
   * make a selection
   */
  selection()
}

@delegateTarget()
export class CanvasSelectionManager extends Context implements ICanvasSelectionManager {
  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * select All
   */
  selectAll() {
    const {
      RED,
      canvas,
      rebind
    } = this
    const {
      moving_set,
      activeSubflow
    } = canvas
    let {
      selected_link
    } = canvas
    const {
      updateSelection,
      redraw,
    } = rebind([
        'updateSelection',
        'redraw',
      ])

    RED.nodes.eachNode(function (n) {
      if (n.z == RED.workspaces.active()) {
        if (!n.selected) {
          n.selected = true;
          n.dirty = true;
          moving_set.push({
            n: n
          });
        }
      }
    });
    if (activeSubflow) {
      activeSubflow.in.forEach(function (n) {
        if (!n.selected) {
          n.selected = true;
          n.dirty = true;
          moving_set.push({
            n: n
          });
        }
      });
      activeSubflow.out.forEach(function (n) {
        if (!n.selected) {
          n.selected = true;
          n.dirty = true;
          moving_set.push({
            n: n
          });
        }
      });
    }

    selected_link = null;
    updateSelection();
    redraw();
  }

  /**
   * clear Selection
   */
  clearSelection() {
    const {
      canvas
    } = this
    let {
      moving_set,
      selected_link
    } = canvas

    for (var i = 0; i < moving_set.length; i++) {
      var n = moving_set[i];
      n.n.dirty = true;
      n.n.selected = false;
    }
    moving_set = [];
    selected_link = null;
  }

  /**
   * update Selection
   */
  updateSelection() {
    const {
      canvas,
      RED
    } = this
    const {
      moving_set,
      selected_link
    } = canvas
    let {
      activeLinks,
      activeFlowLinks,
      lastSelection
    } = canvas

    var selection: any = {};

    if (moving_set.length > 0) {
      selection.nodes = moving_set.map(function (n) {
        return n.n;
      });
    }
    if (selected_link != null) {
      selection.link = selected_link;
    }
    var activeWorkspace = RED.workspaces.active();
    activeLinks = RED.nodes.filterLinks({
      source: {
        z: activeWorkspace
      },
      target: {
        z: activeWorkspace
      }
    });
    var tabOrder = RED.nodes.getWorkspaceOrder();
    var currentLinks = activeLinks;
    var addedLinkLinks = {};
    activeFlowLinks = [];
    for (var i = 0; i < moving_set.length; i++) {
      if (moving_set[i].n.type === 'link out' || moving_set[i].n.type === 'link in') {
        var linkNode = moving_set[i].n;
        var offFlowLinks = {};
        linkNode.links.forEach(function (id) {
          var target = RED.nodes.node(id);
          if (target) {
            if (linkNode.type === 'link out') {
              if (target.z === linkNode.z) {
                if (!addedLinkLinks[linkNode.id + ':' + target.id]) {
                  activeLinks.push({
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
                  activeLinks.push({
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
          activeFlowLinks.push({
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
    if (selectionJSON !== lastSelection) {
      lastSelection = selectionJSON;
      RED.events.emit('view:selection-changed', selection);
    }
  }

  /**
   * move Selection
   * @param dx
   * @param dy
   */
  moveSelection(dx, dy) {
    const {
      canvas,
      rebind
    } = this
    const {
      moving_set,

      endKeyboardMove
    } = canvas
    let {
      endMoveSet,
    } = canvas
    const {
      redraw
    } = rebind([
        'redraw'
      ])

    if (moving_set.length > 0) {
      if (!endMoveSet) {
        $(document).one('keyup', endKeyboardMove);
        endMoveSet = true;
      }
      var minX = 0;
      var minY = 0;
      var node;

      for (var i = 0; i < moving_set.length; i++) {
        node = moving_set[i];
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
        for (var n = 0; n < moving_set.length; n++) {
          node = moving_set[n];
          node.n.x -= minX;
          node.n.y -= minY;
        }
      }

      redraw();
    }
  }


  /**
   * edit Selection
   */
  editSelection() {
    const {
      RED,
      canvas
    } = this
    const {
      moving_set,
      activeSubflow
    } = canvas

    if (moving_set.length > 0) {
      var node = moving_set[0].n;
      if (node.type === 'subflow') {
        RED.editor.editSubflow(activeSubflow);
      } else {
        RED.editor.edit(node);
      }
    }
  }

  /**
   * delete Selection
   */
  deleteSelection() {
    const {
      RED,
      canvas,
      rebind
    } = this
    const {
      activeSubflow,
    } = canvas
    let {
      moving_set,
      selected_link
    } = canvas
    const {
      updateActiveNodes,
      updateSelection,
      redraw
    } = rebind([
        'redraw',
        'updateActiveNodes',
        'updateSelection',
      ])

    if (moving_set.length > 0 || selected_link != null) {
      var result;
      var removedNodes = [];
      var removedLinks = [];
      var removedSubflowOutputs = [];
      var removedSubflowInputs = [];
      var subflowInstances = [];

      var startDirty = RED.nodes.dirty();
      var startChanged = false;
      if (moving_set.length > 0) {
        for (var i = 0; i < moving_set.length; i++) {
          var node = moving_set[i].n;
          node.selected = false;
          if (node.type != 'subflow') {
            if (node.x < 0) {
              node.x = 25
            }
            var removedEntities = RED.nodes.remove(node.id);
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
          result = RED.subflow.removeOutput(removedSubflowOutputs);
          if (result) {
            removedLinks = removedLinks.concat(result.links);
          }
        }
        // Assume 0/1 inputs
        if (removedSubflowInputs.length == 1) {
          result = RED.subflow.removeInput();
          if (result) {
            removedLinks = removedLinks.concat(result.links);
          }
        }
        var instances = RED.subflow.refresh(true);
        if (instances) {
          subflowInstances = instances.instances;
        }
        moving_set = [];
        if (removedNodes.length > 0 || removedSubflowOutputs.length > 0 || removedSubflowInputs.length > 0) {
          RED.nodes.dirty(true);
        }
      }
      if (selected_link) {
        RED.nodes.removeLink(selected_link);
        removedLinks.push(selected_link);
        RED.nodes.dirty(true);
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
      RED.history.push(historyEvent);

      selected_link = null;
      updateActiveNodes();
      updateSelection();
      redraw();
    }
  }

  /**
   * copy Selection
   */
  copySelection() {
    const {
      RED,
      canvas
    } = this
    const {
      activeSubflow,
      selected_link
    } = canvas
    let {
      moving_set,
      clipboard
    } = canvas

    if (moving_set.length > 0) {
      var nns = [];
      for (var n = 0; n < moving_set.length; n++) {
        var node = moving_set[n].n;
        // The only time a node.type == subflow can be selected is the
        // input/output 'proxy' nodes. They cannot be copied.
        if (node.type != 'subflow') {
          for (var d in node._def.defaults) {
            if (node._def.defaults.hasOwnProperty(d)) {
              if (node._def.defaults[d].type) {
                var configNode = RED.nodes.node(node[d]);
                if (configNode && configNode._def.exclusive) {
                  nns.push(RED.nodes.convertNode(configNode));
                }
              }
            }
          }
          nns.push(RED.nodes.convertNode(node));
          //TODO: if the node has an exclusive config node, it should also be copied, to ensure it remains exclusive...
        }
      }
      clipboard = JSON.stringify(nns);
      RED.notify(RED._('clipboard.nodeCopied', {
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
      RED,
      canvas,
      rebind
    } = this
    const {
      clearSelection,
      updateSelection,
      redraw
    } = rebind([
        'clearSelection',
        'updateSelection',
        'redraw'
      ], canvas)
    let {
        moving_set
      } = canvas

    if (typeof selection !== 'undefined') {
      clearSelection();
      if (typeof selection == 'string') {
        var selectedNode = RED.nodes.node(selection);
        if (selectedNode) {
          selectedNode.selected = true;
          selectedNode.dirty = true;
          moving_set = [{
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
    const {
      canvas,
    } = this
    const {
      moving_set,
      selected_link
    } = canvas

    var selection: any = {};
    if (moving_set.length > 0) {
      selection.nodes = moving_set.map(function (n) {
        return n.n;
      });
    }
    if (selected_link != null) {
      selection.link = selected_link;
    }
    return selection;
  }
}
