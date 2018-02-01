import {
  Context
} from '../../../context'

import { DiffPanel } from './'

export interface INodeDiffRow {
  /**
   * create Node Diff Row
   * @param node
   * @param stats
   */
  createNodeDiffRow(node, stats)
}

export class NodeDiffRow extends Context implements INodeDiffRow {
  constructor(public diffPanel: DiffPanel) {
    super()
  }

  get diff() {
    return this.diffPanel.diff
  }

  /**
   * create Node Diff Row
   * @param node
   * @param stats
   */
  createNodeDiffRow(node, stats) {
    let {
      RED,
      currentDiff,
    } = this.diff

    const {
      createNode,
      createNodePropertiesTable,
      createNodeConflictRadioBoxes
    } = this.rebind([
        'createNode',
        'createNodePropertiesTable',
        'createNodeConflictRadioBoxes'
      ])

    var localDiff = currentDiff.localDiff || {};
    var remoteDiff = currentDiff.remoteDiff || {};

    // FIX: ensure doesn't break if not defined (empty)
    currentDiff.conflicts = currentDiff.conflicts || {}

    // TODO: generalize to avoid duplication!
    localDiff.added = localDiff.added || {}
    localDiff.deleted = localDiff.deleted || {}
    localDiff.changed = localDiff.changed || {}

    remoteDiff.added = remoteDiff.added || {}
    remoteDiff.deleted = remoteDiff.deleted || {}
    remoteDiff.changed = remoteDiff.changed || {}

    var conflicted = currentDiff.conflicts[node.id];

    var hasChanges = false; // exists in original and local/remote but with changes
    var unChanged = true; // existing in original,local,remote unchanged
    var localChanged = false;

    if (localDiff.added[node.id]) {
      stats.local.addedCount++;
      unChanged = false;
    }
    if (remoteDiff && remoteDiff.added[node.id]) {
      stats.remote.addedCount++;
      unChanged = false;
    }
    if (localDiff.deleted[node.id]) {
      stats.local.deletedCount++;
      unChanged = false;
    }
    if (remoteDiff && remoteDiff.deleted[node.id]) {
      stats.remote.deletedCount++;
      unChanged = false;
    }
    if (localDiff.changed[node.id]) {
      stats.local.changedCount++;
      hasChanges = true;
      unChanged = false;
    }
    if (remoteDiff && remoteDiff.changed[node.id]) {
      stats.remote.changedCount++;
      hasChanges = true;
      unChanged = false;
    }
    // console.log(node.id,localDiff.added[node.id],remoteDiff.added[node.id],localDiff.deleted[node.id],remoteDiff.deleted[node.id],localDiff.changed[node.id],remoteDiff.changed[node.id])
    var def = RED.nodes.getType(node.type);
    if (def === undefined) {
      if (/^subflow:/.test(node.type)) {
        def = {
          icon: "subflow.png",
          category: "subflows",
          color: "#da9",
          defaults: {
            name: {
              value: ""
            }
          }
        }
      } else {
        def = {};
      }
    }
    var div = $("<div>", {
      class: "node-diff-node-entry collapsed"
    });
    var row = $("<div>", {
      class: "node-diff-node-entry-header"
    }).appendTo(div);

    var originalNodeDiv = $("<div>", {
      class: "node-diff-node-entry-cell"
    }).appendTo(row);
    var localNodeDiv = $("<div>", {
      class: "node-diff-node-entry-cell node-diff-node-local"
    }).appendTo(row);
    var remoteNodeDiv;
    var chevron;
    if (remoteDiff) {
      remoteNodeDiv = $("<div>", {
        class: "node-diff-node-entry-cell node-diff-node-remote"
      }).appendTo(row);
    }
    $('<span class="node-diff-chevron"><i class="fa fa-angle-down"></i></span>').appendTo(originalNodeDiv);

    if (unChanged) {
      stats.local.unchangedCount++;
      createNode(node, def).appendTo(originalNodeDiv);
      localNodeDiv.addClass("node-diff-node-unchanged");
      $('<span class="node-diff-status"><i class="fa fa-square-o"></i> <span data-i18n="diff.type.unchanged"></span></span>').appendTo(localNodeDiv);
      if (remoteDiff) {
        stats.remote.unchangedCount++;
        remoteNodeDiv.addClass("node-diff-node-unchanged");
        $('<span class="node-diff-status"><i class="fa fa-square-o"></i> <span data-i18n="diff.type.unchanged"></span></span>').appendTo(remoteNodeDiv);
      }
      div.addClass("node-diff-node-unchanged");
    } else if (localDiff.added[node.id]) {
      localNodeDiv.addClass("node-diff-node-added");
      if (remoteNodeDiv) {
        remoteNodeDiv.addClass("node-diff-empty");
      }
      $('<span class="node-diff-status"><i class="fa fa-plus-square"></i> <span data-i18n="diff.type.added"></span></span>').appendTo(localNodeDiv);
      createNode(node, def).appendTo(originalNodeDiv);
    } else if (remoteDiff && remoteDiff.added[node.id]) {
      localNodeDiv.addClass("node-diff-empty");
      remoteNodeDiv.addClass("node-diff-node-added");
      $('<span class="node-diff-status"><i class="fa fa-plus-square"></i> <span data-i18n="diff.type.added"></span></span>').appendTo(remoteNodeDiv);
      createNode(node, def).appendTo(originalNodeDiv);
    } else {
      createNode(node, def).appendTo(originalNodeDiv);
      if (localDiff.moved[node.id]) {
        var localN = localDiff.newConfig.all[node.id];
        if (!localDiff.deleted[node.z] && node.z !== localN.z && node.z !== "" && !localDiff.newConfig.all[node.z]) {
          localNodeDiv.addClass("node-diff-empty");
        } else {
          localNodeDiv.addClass("node-diff-node-moved");
          var localMovedMessage = "";
          if (node.z === localN.z) {
            localMovedMessage = RED._("diff.type.movedFrom", {
              id: (localDiff.currentConfig.all[node.id].z || 'global')
            });
          } else {
            localMovedMessage = RED._("diff.type.movedTo", {
              id: (localN.z || 'global')
            });
          }
          $('<span class="node-diff-status"><i class="fa fa-caret-square-o-right"></i> ' + localMovedMessage + '</span>').appendTo(localNodeDiv);
        }
        localChanged = true;
      } else if (localDiff.deleted[node.z]) {
        localNodeDiv.addClass("node-diff-empty");
        localChanged = true;
      } else if (localDiff.deleted[node.id]) {
        localNodeDiv.addClass("node-diff-node-deleted");
        $('<span class="node-diff-status"><i class="fa fa-minus-square"></i> <span data-i18n="diff.type.deleted"></span></span>').appendTo(localNodeDiv);
        localChanged = true;
      } else if (localDiff.changed[node.id]) {
        if (localDiff.newConfig.all[node.id].z !== node.z) {
          localNodeDiv.addClass("node-diff-empty");
        } else {
          localNodeDiv.addClass("node-diff-node-changed");
          $('<span class="node-diff-status"><i class="fa fa-square"></i> <span data-i18n="diff.type.changed"></span></span>').appendTo(localNodeDiv);
          localChanged = true;
        }
      } else {
        if (localDiff.newConfig.all[node.id].z !== node.z) {
          localNodeDiv.addClass("node-diff-empty");
        } else {
          stats.local.unchangedCount++;
          localNodeDiv.addClass("node-diff-node-unchanged");
          $('<span class="node-diff-status"><i class="fa fa-square-o"></i> <span data-i18n="diff.type.unchanged"></span></span>').appendTo(localNodeDiv);
        }
      }

      if (remoteDiff) {
        if (remoteDiff.moved[node.id]) {
          var remoteN = remoteDiff.newConfig.all[node.id];
          if (!remoteDiff.deleted[node.z] && node.z !== remoteN.z && node.z !== "" && !remoteDiff.newConfig.all[node.z]) {
            remoteNodeDiv.addClass("node-diff-empty");
          } else {
            remoteNodeDiv.addClass("node-diff-node-moved");
            var remoteMovedMessage = "";
            if (node.z === remoteN.z) {
              remoteMovedMessage = RED._("diff.type.movedFrom", {
                id: (remoteDiff.currentConfig.all[node.id].z || 'global')
              });
            } else {
              remoteMovedMessage = RED._("diff.type.movedTo", {
                id: (remoteN.z || 'global')
              });
            }
            $('<span class="node-diff-status"><i class="fa fa-caret-square-o-right"></i> ' + remoteMovedMessage + '</span>').appendTo(remoteNodeDiv);
          }
        } else if (remoteDiff.deleted[node.z]) {
          remoteNodeDiv.addClass("node-diff-empty");
        } else if (remoteDiff.deleted[node.id]) {
          remoteNodeDiv.addClass("node-diff-node-deleted");
          $('<span class="node-diff-status"><i class="fa fa-minus-square"></i> <span data-i18n="diff.type.deleted"></span></span>').appendTo(remoteNodeDiv);
        } else if (remoteDiff.changed[node.id]) {
          if (remoteDiff.newConfig.all[node.id].z !== node.z) {
            remoteNodeDiv.addClass("node-diff-empty");
          } else {
            remoteNodeDiv.addClass("node-diff-node-changed");
            $('<span class="node-diff-status"><i class="fa fa-square"></i> <span data-i18n="diff.type.changed"></span></span>').appendTo(remoteNodeDiv);
          }
        } else {
          if (remoteDiff.newConfig.all[node.id].z !== node.z) {
            remoteNodeDiv.addClass("node-diff-empty");
          } else {
            stats.remote.unchangedCount++;
            remoteNodeDiv.addClass("node-diff-node-unchanged");
            $('<span class="node-diff-status"><i class="fa fa-square-o"></i> <span data-i18n="diff.type.unchanged"></span></span>').appendTo(remoteNodeDiv);
          }
        }
      }
    }
    var localNode = {
      node: localDiff.newConfig.all[node.id],
      all: localDiff.newConfig.all,
      diff: localDiff
    };
    var remoteNode;
    if (remoteDiff) {
      remoteNode = {
        node: remoteDiff.newConfig.all[node.id] || null,
        all: remoteDiff.newConfig.all,
        diff: remoteDiff
      }
    }
    createNodePropertiesTable(def, node, localNode, remoteNode).appendTo(div);

    var selectState = "";

    if (conflicted) {
      stats.conflicts++;
      if (!localNodeDiv.hasClass("node-diff-empty")) {
        $('<span class="node-diff-node-conflict"><span class="node-diff-status"><i class="fa fa-exclamation"></i></span></span>').prependTo(localNodeDiv);
      }
      if (!remoteNodeDiv.hasClass("node-diff-empty")) {
        $('<span class="node-diff-node-conflict"><span class="node-diff-status"><i class="fa fa-exclamation"></i></span></span>').prependTo(remoteNodeDiv);
      }
      div.addClass("node-diff-node-entry-conflict");
    } else {
      selectState = currentDiff.resolutions[node.id];
    }
    // Node row
    createNodeConflictRadioBoxes(node, div, localNodeDiv, remoteNodeDiv, false, !conflicted, selectState);
    row.click((evt) => {
      $(this).parent().toggleClass('collapsed');
    });

    return div;
  }
}
