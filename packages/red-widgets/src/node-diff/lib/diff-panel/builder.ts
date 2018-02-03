import {
  Context,
  DiffPanel
} from './_base'


export interface IPanelBuilder {
  /**
   * build Diff Panel
   * @param container
   */
  buildDiffPanel(container)
}

/**
 *
 */
export class PanelBuilder extends Context implements IPanelBuilder {
  constructor(public diffPanel: DiffPanel) {
    super()
  }

  get diff() {
    return this.diffPanel.diff
  }

  /**
   * build Diff Panel
   * @param container
   */
  buildDiffPanel(container) {
    const {
      RED
    } = this

    let {
      diffList,
      currentDiff,
    } = this.diff

    const {
      createNodeIcon,
      createNodePropertiesTable,
      createNodeDiffRow,
      createNodeConflictRadioBoxes,
    } = this.rebind([
        'createNodeConflictRadioBoxes',
        'createNodeIcon',
        'createNodePropertiesTable',
        'createNodeDiffRow'
      ])

    if (!container) {
      this.handleError('buildDiffPanel: missing argument container, the element to build panel on')
    }

    var diffPanel = $('<div id="node-dialog-view-diff"><div id="node-dialog-view-diff-headers"></div><ol id="node-dialog-view-diff-diff"></ol></div>').appendTo(container);

    var toolbar = $('<div class="node-diff-toolbar">' +
      '<span><span id="node-diff-toolbar-resolved-conflicts"></span></span> ' +
      '</div>').prependTo(diffPanel);

    diffList = diffPanel.find("#node-dialog-view-diff-diff")

    diffList.editableList({
      addButton: false,
      scrollOnAdd: false,
      addItem: (container, i, object) => {
        var localDiff = object.diff;
        var remoteDiff = object.remoteDiff;
        var tab = object.tab.n;
        var def = object.def;
        var conflicts = currentDiff.conflicts;

        var tabDiv = $('<div>', {
          class: "node-diff-tab"
        }).appendTo(container);
        tabDiv.addClass('collapsed');
        var titleRow = $('<div>', {
          class: "node-diff-tab-title"
        }).appendTo(tabDiv);
        var nodesDiv = $('<div>').appendTo(tabDiv);
        var originalCell = $('<div>', {
          class: "node-diff-node-entry-cell"
        }).appendTo(titleRow);
        var localCell = $('<div>', {
          class: "node-diff-node-entry-cell node-diff-node-local"
        }).appendTo(titleRow);
        var remoteCell;
        var selectState;

        if (remoteDiff) {
          remoteCell = $('<div>', {
            class: "node-diff-node-entry-cell node-diff-node-remote"
          }).appendTo(titleRow);
        }
        $('<span class="node-diff-chevron"><i class="fa fa-angle-down"></i></span>').appendTo(originalCell);
        createNodeIcon(tab, def).appendTo(originalCell);
        var tabForLabel = (object.newTab || object.tab).n;
        var titleSpan = $('<span>', {
          class: "node-diff-tab-title-meta"
        }).appendTo(originalCell);
        if (tabForLabel.type === 'tab') {
          titleSpan.html(tabForLabel.label || tabForLabel.id);
        } else if (tab.type === 'subflow') {
          titleSpan.html((tabForLabel.name || tabForLabel.id));
        } else {
          titleSpan.html(RED._("diff.globalNodes"));
        }
        var flowStats = {
          local: {
            addedCount: 0,
            deletedCount: 0,
            changedCount: 0,
            unchangedCount: 0
          },
          remote: {
            addedCount: 0,
            deletedCount: 0,
            changedCount: 0,
            unchangedCount: 0
          },
          conflicts: 0
        }
        if (object.newTab || object.remoteTab) {
          var localTabNode = {
            node: localDiff.newConfig.all[tab.id],
            all: localDiff.newConfig.all,
            diff: localDiff
          }
          var remoteTabNode;
          if (remoteDiff) {
            remoteTabNode = {
              node: remoteDiff.newConfig.all[tab.id] || null,
              all: remoteDiff.newConfig.all,
              diff: remoteDiff
            }
          }
          if (tab.type !== undefined) {
            var div = $("<div>", {
              class: "node-diff-node-entry node-diff-node-props collapsed"
            }).appendTo(nodesDiv);
            var row = $("<div>", {
              class: "node-diff-node-entry-header"
            }).appendTo(div);
            var originalNodeDiv = $("<div>", {
              class: "node-diff-node-entry-cell"
            }).appendTo(row);
            var localNodeDiv = $("<div>", {
              class: "node-diff-node-entry-cell node-diff-node-local"
            }).appendTo(row);
            var localChanged = false;
            var remoteChanged = false;

            if (!localDiff.newConfig.all[tab.id]) {
              localNodeDiv.addClass("node-diff-empty");
            } else if (localDiff.added[tab.id]) {
              localNodeDiv.addClass("node-diff-node-added");
              localChanged = true;
              $('<span class="node-diff-status"><i class="fa fa-plus-square"></i> <span data-i18n="diff.type.added"></span></span>').appendTo(localNodeDiv);
            } else if (localDiff.changed[tab.id]) {
              localNodeDiv.addClass("node-diff-node-changed");
              localChanged = true;
              $('<span class="node-diff-status"><i class="fa fa-square"></i> <span data-i18n="diff.type.changed"></span></span>').appendTo(localNodeDiv);
            } else {
              localNodeDiv.addClass("node-diff-node-unchanged");
              $('<span class="node-diff-status"><i class="fa fa-square-o"></i> <span data-i18n="diff.type.unchanged"></span></span>').appendTo(localNodeDiv);
            }

            var remoteNodeDiv;
            if (remoteDiff) {
              remoteNodeDiv = $("<div>", {
                class: "node-diff-node-entry-cell node-diff-node-remote"
              }).appendTo(row);
              if (!remoteDiff.newConfig.all[tab.id]) {
                remoteNodeDiv.addClass("node-diff-empty");
                if (remoteDiff.deleted[tab.id]) {
                  remoteChanged = true;
                }
              } else if (remoteDiff.added[tab.id]) {
                remoteNodeDiv.addClass("node-diff-node-added");
                remoteChanged = true;
                $('<span class="node-diff-status"><i class="fa fa-plus-square"></i> <span data-i18n="diff.type.added"></span></span>').appendTo(remoteNodeDiv);
              } else if (remoteDiff.changed[tab.id]) {
                remoteNodeDiv.addClass("node-diff-node-changed");
                remoteChanged = true;
                $('<span class="node-diff-status"><i class="fa fa-square"></i> <span data-i18n="diff.type.changed"></span></span>').appendTo(remoteNodeDiv);
              } else {
                remoteNodeDiv.addClass("node-diff-node-unchanged");
                $('<span class="node-diff-status"><i class="fa fa-square-o"></i> <span data-i18n="diff.type.unchanged"></span></span>').appendTo(remoteNodeDiv);
              }
            }
            $('<span class="node-diff-chevron"><i class="fa fa-angle-down"></i></span>').appendTo(originalNodeDiv);
            $('<span>').html(RED._("diff.flowProperties")).appendTo(originalNodeDiv);

            row.click((evt) => {
              evt.preventDefault();
              $(this).parent().toggleClass('collapsed');
            });

            createNodePropertiesTable(def, tab, localTabNode, remoteTabNode, conflicts).appendTo(div);
            selectState = "";
            if (conflicts[tab.id]) {
              flowStats.conflicts++;

              if (!localNodeDiv.hasClass("node-diff-empty")) {
                $('<span class="node-diff-node-conflict"><span class="node-diff-status"><i class="fa fa-exclamation"></i></span></span>').prependTo(localNodeDiv);
              }
              if (!remoteNodeDiv.hasClass("node-diff-empty")) {
                $('<span class="node-diff-node-conflict"><span class="node-diff-status"><i class="fa fa-exclamation"></i></span></span>').prependTo(remoteNodeDiv);
              }
              div.addClass("node-diff-node-entry-conflict");
            } else {
              selectState = currentDiff.resolutions[tab.id];
            }
            // Tab properties row
            createNodeConflictRadioBoxes(tab, div, localNodeDiv, remoteNodeDiv, true, !conflicts[tab.id], selectState);
          }
        }
        // var stats = $('<span>',{class:"node-diff-tab-stats"}).appendTo(titleRow);
        var localNodeCount = 0;
        var remoteNodeCount = 0;
        var seen = {};
        object.tab.nodes.forEach((node) => {
          seen[node.id] = true;
          createNodeDiffRow(node, flowStats).appendTo(nodesDiv)
        });
        if (object.newTab) {
          localNodeCount = object.newTab.nodes.length;
          object.newTab.nodes.forEach((node) => {
            if (!seen[node.id]) {
              seen[node.id] = true;
              createNodeDiffRow(node, flowStats).appendTo(nodesDiv)
            }
          });
        }
        if (object.remoteTab) {
          remoteNodeCount = object.remoteTab.nodes.length;
          object.remoteTab.nodes.forEach((node) => {
            if (!seen[node.id]) {
              createNodeDiffRow(node, flowStats).appendTo(nodesDiv)
            }
          });
        }
        titleRow.click((evt) => {
          // if (titleRow.parent().find(".node-diff-node-entry:not(.hide)").length > 0) {
          titleRow.parent().toggleClass('collapsed');
          if ($(this).parent().hasClass('collapsed')) {
            $(this).parent().find('.node-diff-node-entry').addClass('collapsed');
            $(this).parent().find('.debug-message-element').addClass('collapsed');
          }
          // }
        })

        if (localDiff.deleted[tab.id]) {
          $('<span class="node-diff-node-deleted"><span class="node-diff-status"><i class="fa fa-minus-square"></i> <span data-i18n="diff.type.flowDeleted"></span></span></span>').appendTo(localCell);
        } else if (object.newTab) {
          if (localDiff.added[tab.id]) {
            $('<span class="node-diff-node-added"><span class="node-diff-status"><i class="fa fa-plus-square"></i> <span data-i18n="diff.type.flowAdded"></span></span></span>').appendTo(localCell);
          } else {
            if (tab.id) {
              if (localDiff.changed[tab.id]) {
                flowStats.local.changedCount++;
              } else {
                flowStats.local.unchangedCount++;
              }
            }
            var localStats = $('<span>', {
              class: "node-diff-tab-stats"
            }).appendTo(localCell);
            $('<span class="node-diff-status"></span>').html(RED._('diff.nodeCount', {
              count: localNodeCount
            })).appendTo(localStats);

            if (flowStats.conflicts + flowStats.local.addedCount + flowStats.local.changedCount + flowStats.local.deletedCount > 0) {
              $('<span class="node-diff-status"> [ </span>').appendTo(localStats);
              if (flowStats.conflicts > 0) {
                $('<span class="node-diff-node-conflict"><span class="node-diff-status"><i class="fa fa-exclamation"></i> ' + flowStats.conflicts + '</span></span>').appendTo(localStats);
              }
              if (flowStats.local.addedCount > 0) {
                $('<span class="node-diff-node-added"><span class="node-diff-status"><i class="fa fa-plus-square"></i> ' + flowStats.local.addedCount + '</span></span>').appendTo(localStats);
              }
              if (flowStats.local.changedCount > 0) {
                $('<span class="node-diff-node-changed"><span class="node-diff-status"><i class="fa fa-square"></i> ' + flowStats.local.changedCount + '</span></span>').appendTo(localStats);
              }
              if (flowStats.local.deletedCount > 0) {
                $('<span class="node-diff-node-deleted"><span class="node-diff-status"><i class="fa fa-minus-square"></i> ' + flowStats.local.deletedCount + '</span></span>').appendTo(localStats);
              }
              $('<span class="node-diff-status"> ] </span>').appendTo(localStats);
            }

          }
        } else {
          localCell.addClass("node-diff-empty");
        }

        if (remoteDiff) {
          if (remoteDiff.deleted[tab.id]) {
            $('<span class="node-diff-node-deleted"><span class="node-diff-status"><i class="fa fa-minus-square"></i> <span data-i18n="diff.type.flowDeleted"></span></span></span>').appendTo(remoteCell);
          } else if (object.remoteTab) {
            if (remoteDiff.added[tab.id]) {
              $('<span class="node-diff-node-added"><span class="node-diff-status"><i class="fa fa-plus-square"></i> <span data-i18n="diff.type.flowAdded"></span></span></span>').appendTo(remoteCell);
            } else {
              if (tab.id) {
                if (remoteDiff.changed[tab.id]) {
                  flowStats.remote.changedCount++;
                } else {
                  flowStats.remote.unchangedCount++;
                }
              }
              var remoteStats = $('<span>', {
                class: "node-diff-tab-stats"
              }).appendTo(remoteCell);
              $('<span class="node-diff-status"></span>').html(RED._('diff.nodeCount', {
                count: remoteNodeCount
              })).appendTo(remoteStats);
              if (flowStats.conflicts + flowStats.remote.addedCount + flowStats.remote.changedCount + flowStats.remote.deletedCount > 0) {
                $('<span class="node-diff-status"> [ </span>').appendTo(remoteStats);
                if (flowStats.conflicts > 0) {
                  $('<span class="node-diff-node-conflict"><span class="node-diff-status"><i class="fa fa-exclamation"></i> ' + flowStats.conflicts + '</span></span>').appendTo(remoteStats);
                }
                if (flowStats.remote.addedCount > 0) {
                  $('<span class="node-diff-node-added"><span class="node-diff-status"><i class="fa fa-plus-square"></i> ' + flowStats.remote.addedCount + '</span></span>').appendTo(remoteStats);
                }
                if (flowStats.remote.changedCount > 0) {
                  $('<span class="node-diff-node-changed"><span class="node-diff-status"><i class="fa fa-square"></i> ' + flowStats.remote.changedCount + '</span></span>').appendTo(remoteStats);
                }
                if (flowStats.remote.deletedCount > 0) {
                  $('<span class="node-diff-node-deleted"><span class="node-diff-status"><i class="fa fa-minus-square"></i> ' + flowStats.remote.deletedCount + '</span></span>').appendTo(remoteStats);
                }
                $('<span class="node-diff-status"> ] </span>').appendTo(remoteStats);
              }
            }
          } else {
            remoteCell.addClass("node-diff-empty");
          }
          selectState = "";
          if (flowStats.conflicts > 0) {
            titleRow.addClass("node-diff-node-entry-conflict");
          } else {
            selectState = currentDiff.resolutions[tab.id];
          }
          if (tab.id) {
            var hide = !(flowStats.conflicts > 0 && (localDiff.deleted[tab.id] || remoteDiff.deleted[tab.id]));
            // Tab parent row
            createNodeConflictRadioBoxes(tab, titleRow, localCell, remoteCell, false, hide, selectState);
          }
        }

        if (tabDiv.find(".node-diff-node-entry").length === 0) {
          tabDiv.addClass("node-diff-tab-empty");
        }
        container.i18n();
      }
    });
    return diffPanel;
  }
}
