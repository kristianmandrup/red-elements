import {
  Context
} from '../../../context'

import { DiffPanel } from './'

export interface INodePropertiesTable {
  /**
   * create Node Properties Table
   * @param def
   * @param node
   * @param localNodeObj
   * @param remoteNodeObj
   */
  createNodePropertiesTable(def, node, localNodeObj, remoteNodeObj)
}

/**
 *
 */
export class NodePropertiesTable extends Context implements INodePropertiesTable {
  constructor(public diffPanel: DiffPanel) {
    super()
  }

  get diff() {
    return this.diffPanel.diff
  }

  /**
   * create Node Properties Table
   * @param def
   * @param node
   * @param localNodeObj
   * @param remoteNodeObj
   */
  createNodePropertiesTable(def, node, localNodeObj, remoteNodeObj) {
    const {
      RED,
      formatWireProperty
    } = this.rebind([
        'formatWireProperty'
      ])

    var propertyElements = {};
    var localNode = localNodeObj.node;
    var remoteNode;
    if (remoteNodeObj) {
      remoteNode = remoteNodeObj.node;
    }

    var nodePropertiesDiv = $("<div>", {
      class: "node-diff-node-entry-properties"
    });
    var nodePropertiesTable = $("<table>").appendTo(nodePropertiesDiv);
    var nodePropertiesTableCols = $('<colgroup><col/><col/></colgroup>').appendTo(nodePropertiesTable);
    if (remoteNode !== undefined) {
      $("<col/>").appendTo(nodePropertiesTableCols);
    }
    var nodePropertiesTableBody = $("<tbody>").appendTo(nodePropertiesTable);

    var row;
    var localCell, remoteCell;
    var element;
    var currentValue, localValue, remoteValue;
    var localChanged = false;
    var remoteChanged = false;
    var localChanges = 0;
    var remoteChanges = 0;
    var conflict = false;
    var status;

    row = $("<tr>").appendTo(nodePropertiesTableBody);
    $("<td>", {
      class: "node-diff-property-cell-label"
    }).html("id").appendTo(row);
    localCell = $("<td>", {
      class: "node-diff-property-cell node-diff-node-local"
    }).appendTo(row);
    if (localNode) {
      localCell.addClass("node-diff-node-unchanged");
      $('<span class="node-diff-status"></span>').appendTo(localCell);
      element = $('<span class="node-diff-element"></span>').appendTo(localCell);
      propertyElements['local.id'] = RED.utils.createObjectElement(localNode.id).appendTo(element);
    } else {
      localCell.addClass("node-diff-empty");
    }
    if (remoteNode !== undefined) {
      remoteCell = $("<td>", {
        class: "node-diff-property-cell node-diff-node-remote"
      }).appendTo(row);
      remoteCell.addClass("node-diff-node-unchanged");
      if (remoteNode) {
        $('<span class="node-diff-status"></span>').appendTo(remoteCell);
        element = $('<span class="node-diff-element"></span>').appendTo(remoteCell);
        propertyElements['remote.id'] = RED.utils.createObjectElement(remoteNode.id).appendTo(element);
      } else {
        remoteCell.addClass("node-diff-empty");
      }
    }


    if (node.hasOwnProperty('x')) {
      if (localNode) {
        if (localNode.x !== node.x || localNode.y !== node.y) {
          localChanged = true;
          localChanges++;
        }
      }
      if (remoteNode) {
        if (remoteNode.x !== node.x || remoteNode.y !== node.y) {
          remoteChanged = true;
          remoteChanges++;
        }
      }
      if ((remoteChanged && localChanged && (localNode.x !== remoteNode.x || localNode.y !== remoteNode.y)) ||
        (!localChanged && remoteChanged && localNodeObj.diff.deleted[node.id]) ||
        (localChanged && !remoteChanged && remoteNodeObj.diff.deleted[node.id])
      ) {
        conflict = true;
      }
      row = $("<tr>").appendTo(nodePropertiesTableBody);
      $("<td>", {
        class: "node-diff-property-cell-label"
      }).html("position").appendTo(row);
      localCell = $("<td>", {
        class: "node-diff-property-cell node-diff-node-local"
      }).appendTo(row);
      if (localNode) {
        localCell.addClass("node-diff-node-" + (localChanged ? "changed" : "unchanged"));
        $('<span class="node-diff-status">' + (localChanged ? '<i class="fa fa-square"></i>' : '') + '</span>').appendTo(localCell);
        element = $('<span class="node-diff-element"></span>').appendTo(localCell);
        propertyElements['local.position'] = RED.utils.createObjectElement({
          x: localNode.x,
          y: localNode.y
        }, {
            path: "position",
            exposeApi: true,
            ontoggle: (path, state) => {
              if (propertyElements['remote.' + path]) {
                propertyElements['remote.' + path].prop('expand')(path, state)
              }
            }
          }).appendTo(element);
      } else {
        localCell.addClass("node-diff-empty");
      }

      if (remoteNode !== undefined) {
        remoteCell = $("<td>", {
          class: "node-diff-property-cell node-diff-node-remote"
        }).appendTo(row);
        remoteCell.addClass("node-diff-node-" + (remoteChanged ? "changed" : "unchanged"));
        if (remoteNode) {
          $('<span class="node-diff-status">' + (remoteChanged ? '<i class="fa fa-square"></i>' : '') + '</span>').appendTo(remoteCell);
          element = $('<span class="node-diff-element"></span>').appendTo(remoteCell);
          propertyElements['remote.position'] = RED.utils.createObjectElement({
            x: remoteNode.x,
            y: remoteNode.y
          }, {
              path: "position",
              exposeApi: true,
              ontoggle: (path, state) => {
                if (propertyElements['local.' + path]) {
                  propertyElements['local.' + path].prop('expand')(path, state);
                }
              }
            }).appendTo(element);
        } else {
          remoteCell.addClass("node-diff-empty");
        }
      }
    }
    //
    localChanged = remoteChanged = conflict = false;
    if (node.hasOwnProperty('wires')) {
      currentValue = JSON.stringify(node.wires);
      if (localNode) {
        localValue = JSON.stringify(localNode.wires);
        if (currentValue !== localValue) {
          localChanged = true;
          localChanges++;
        }
      }
      if (remoteNode) {
        remoteValue = JSON.stringify(remoteNode.wires);
        if (currentValue !== remoteValue) {
          remoteChanged = true;
          remoteChanges++;
        }
      }
      if ((remoteChanged && localChanged && (localValue !== remoteValue)) ||
        (!localChanged && remoteChanged && localNodeObj.diff.deleted[node.id]) ||
        (localChanged && !remoteChanged && remoteNodeObj.diff.deleted[node.id])
      ) {
        conflict = true;
      }
      row = $("<tr>").appendTo(nodePropertiesTableBody);
      $("<td>", {
        class: "node-diff-property-cell-label"
      }).html("wires").appendTo(row);
      localCell = $("<td>", {
        class: "node-diff-property-cell node-diff-node-local"
      }).appendTo(row);
      if (localNode) {
        if (!conflict) {
          localCell.addClass("node-diff-node-" + (localChanged ? "changed" : "unchanged"));
          $('<span class="node-diff-status">' + (localChanged ? '<i class="fa fa-square"></i>' : '') + '</span>').appendTo(localCell);
        } else {
          localCell.addClass("node-diff-node-conflict");
          $('<span class="node-diff-status"><i class="fa fa-exclamation"></i></span>').appendTo(localCell);
        }
        formatWireProperty(localNode.wires, localNodeObj.all).appendTo(localCell);
      } else {
        localCell.addClass("node-diff-empty");
      }

      if (remoteNode !== undefined) {
        remoteCell = $("<td>", {
          class: "node-diff-property-cell node-diff-node-remote"
        }).appendTo(row);
        if (remoteNode) {
          if (!conflict) {
            remoteCell.addClass("node-diff-node-" + (remoteChanged ? "changed" : "unchanged"));
            $('<span class="node-diff-status">' + (remoteChanged ? '<i class="fa fa-square"></i>' : '') + '</span>').appendTo(remoteCell);
          } else {
            remoteCell.addClass("node-diff-node-conflict");
            $('<span class="node-diff-status"><i class="fa fa-exclamation"></i></span>').appendTo(remoteCell);
          }
          formatWireProperty(remoteNode.wires, remoteNodeObj.all).appendTo(remoteCell);
        } else {
          remoteCell.addClass("node-diff-empty");
        }
      }
    }

    var properties = Object.keys(node).filter((p) => {
      return p != 'inputLabels' && p != 'outputLabels' && p != 'z' && p != 'wires' && p !== 'x' && p !== 'y' && p !== 'id' && p !== 'type' && (!def.defaults || !def.defaults.hasOwnProperty(p))
    });
    if (def.defaults) {
      properties = properties.concat(Object.keys(def.defaults));
    }
    if (node.type !== 'tab') {
      properties = properties.concat(['inputLabels', 'outputLabels']);
    }
    properties.forEach((d) => {
      localChanged = false;
      remoteChanged = false;
      conflict = false;
      currentValue = JSON.stringify(node[d]);
      if (localNode) {
        localValue = JSON.stringify(localNode[d]);
        if (currentValue !== localValue) {
          localChanged = true;
          localChanges++;
        }
      }
      if (remoteNode) {
        remoteValue = JSON.stringify(remoteNode[d]);
        if (currentValue !== remoteValue) {
          remoteChanged = true;
          remoteChanges++;
        }
      }

      if ((remoteChanged && localChanged && (localValue !== remoteValue)) ||
        (!localChanged && remoteChanged && localNodeObj.diff.deleted[node.id]) ||
        (localChanged && !remoteChanged && remoteNodeObj.diff.deleted[node.id])
      ) {
        conflict = true;
      }

      row = $("<tr>").appendTo(nodePropertiesTableBody);
      var propertyNameCell = $("<td>", {
        class: "node-diff-property-cell-label"
      }).html(d).appendTo(row);
      localCell = $("<td>", {
        class: "node-diff-property-cell node-diff-node-local"
      }).appendTo(row);
      if (localNode) {
        if (!conflict) {
          localCell.addClass("node-diff-node-" + (localChanged ? "changed" : "unchanged"));
          $('<span class="node-diff-status">' + (localChanged ? '<i class="fa fa-square"></i>' : '') + '</span>').appendTo(localCell);
        } else {
          localCell.addClass("node-diff-node-conflict");
          $('<span class="node-diff-status"><i class="fa fa-exclamation"></i></span>').appendTo(localCell);
        }
        element = $('<span class="node-diff-element"></span>').appendTo(localCell);
        propertyElements['local.' + d] = RED.utils.createObjectElement(localNode[d], {
          path: d,
          exposeApi: true,
          ontoggle: (path, state) => {
            if (propertyElements['remote.' + d]) {
              propertyElements['remote.' + d].prop('expand')(path, state)
            }
          }
        }).appendTo(element);
      } else {
        localCell.addClass("node-diff-empty");
      }
      if (remoteNode !== undefined) {
        remoteCell = $("<td>", {
          class: "node-diff-property-cell node-diff-node-remote"
        }).appendTo(row);
        if (remoteNode) {
          if (!conflict) {
            remoteCell.addClass("node-diff-node-" + (remoteChanged ? "changed" : "unchanged"));
            $('<span class="node-diff-status">' + (remoteChanged ? '<i class="fa fa-square"></i>' : '') + '</span>').appendTo(remoteCell);
          } else {
            remoteCell.addClass("node-diff-node-conflict");
            $('<span class="node-diff-status"><i class="fa fa-exclamation"></i></span>').appendTo(remoteCell);
          }
          element = $('<span class="node-diff-element"></span>').appendTo(remoteCell);
          propertyElements['remote.' + d] = RED.utils.createObjectElement(remoteNode[d], {
            path: d,
            exposeApi: true,
            ontoggle: (path, state) => {
              if (propertyElements['local.' + d]) {
                propertyElements['local.' + d].prop('expand')(path, state)
              }
            }
          }).appendTo(element);
        } else {
          remoteCell.addClass("node-diff-empty");
        }
      }
    });
    return nodePropertiesDiv;
  }

  /**
   * Format wire property
   * @param wires
   * @param allNodes
   */
  protected formatWireProperty(wires, allNodes) {
    const {
      RED,
      createNode
    } = this.rebind([
        'createNode'
      ])

    var result = $("<div>", {
      class: "node-diff-property-wires"
    })
    var list = $("<ol></ol>");
    var c = 0;
    wires.forEach((p, i) => {
      var port = $("<li>").appendTo(list);
      if (p && p.length > 0) {
        $("<span>").html(i + 1).appendTo(port);
        var links = $("<ul>").appendTo(port);
        p.forEach((d) => {
          c++;
          var entry = $("<li>").appendTo(links);
          var node = allNodes[d];
          if (node) {
            var def = RED.nodes.getType(node.type) || {};
            createNode(node, def).appendTo(entry);
          } else {
            entry.html(d);
          }
        })
      } else {
        port.html('none');
      }
    })
    if (c === 0) {
      result.html("none");
    } else {
      list.appendTo(result);
    }
    return result;
  }
}
