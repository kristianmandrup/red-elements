interface IDiffWidget extends JQuery<HTMLElement> {
  i18n: Function
}

import { Diff } from './index'

import {
  Context,
  container,
  delegateTarget
} from './_base'

export interface IDiffDisplayer {
  showDiff(diff)
}

@delegateTarget({
  container,
})
export class DiffDisplayer extends Context implements IDiffDisplayer {
  constructor(public diff: Diff) {
    super()
  }

  showDiff(diff) {
    const {
      RED,
      rebind
    } = this.diff

    const {
      refreshConflictHeader,
      mergeDiff,
      buildDiffPanel
    } = rebind([
        'refreshConflictHeader',
        'mergeDiff',
        'buildDiffPanel'
      ])

    let {
      diffVisible,
      diffList,
      currentDiff
    } = this.diff

    if (diffVisible) {
      return;
    }

    let {
      localDiff,
      remoteDiff,
      conflicts
    } = diff

    currentDiff = diff;

    var trayOptions = {
      title: "Review Changes", //TODO: nls
      width: Infinity,
      buttons: [{
        text: RED._("common.label.cancel"),
        click: () => {
          RED.tray.close();
        }
      },
      {
        id: "node-diff-view-diff-merge",
        text: RED._("deploy.confirm.button.merge"),
        class: "primary disabled",
        click: () => {
          if (!$("#node-diff-view-diff-merge").hasClass('disabled')) {
            refreshConflictHeader();
            mergeDiff(currentDiff);
            RED.tray.close();
          }
        }
      }
      ],
      resize: (dimensions) => {
        // trayWidth = dimensions.width;
      },
      open: (tray) => {
        var trayBody = tray.find('.editor-tray-body');
        var diffPanel = buildDiffPanel(trayBody);
        if (currentDiff.remoteDiff) {
          $("#node-diff-view-diff-merge").show();
          if (Object.keys(conflicts).length === 0) {
            $("#node-diff-view-diff-merge").removeClass('disabled');
          } else {
            $("#node-diff-view-diff-merge").addClass('disabled');
          }
        } else {
          $("#node-diff-view-diff-merge").hide();
        }
        refreshConflictHeader();

        $("#node-dialog-view-diff-headers").empty();
        var currentConfig = currentDiff.localDiff.currentConfig;
        var newConfig = currentDiff.localDiff.newConfig;
        conflicts = currentDiff.conflicts || {};

        let el = {
          diff: localDiff,
          def: {
            category: 'config',
            color: '#f0f0f0'
          },
          tab: {
            n: {},
            nodes: currentConfig.globals
          },
          newTab: {
            n: {},
            nodes: newConfig.globals
          },
          remoteTab: {},
          remoteDiff: null
        };

        if (remoteDiff !== undefined) {
          diffPanel.addClass('node-diff-three-way');

          const diffWidget = <IDiffWidget>$('<div data-i18n="diff.local"></div><div data-i18n="diff.remote"></div>').appendTo("#node-dialog-view-diff-headers");
          diffWidget.i18n()

          el.remoteTab = {
            n: {},
            nodes: remoteDiff.newConfig.globals
          };
          el.remoteDiff = remoteDiff;
        } else {
          diffPanel.removeClass('node-diff-three-way');
        }

        diffList.editableList('addItem', el);

        const seenTabs = {};

        currentConfig.tabOrder.forEach((tabId) => {
          var tab = currentConfig.tabs[tabId];
          let el = {
            diff: localDiff,
            def: RED.nodes.getType('tab'),
            tab: tab,
            newTab: null,
            remoteTab: null,
            remoteDiff: null
          };
          if (newConfig.tabs.hasOwnProperty(tabId)) {
            el.newTab = newConfig.tabs[tabId];
          }
          if (remoteDiff !== undefined) {
            el.remoteTab = remoteDiff.newConfig.tabs[tabId];
            el.remoteDiff = remoteDiff;
          }
          seenTabs[tabId] = true;
          diffList.editableList('addItem', el)
        });
        newConfig.tabOrder.forEach((tabId) => {
          if (!seenTabs[tabId]) {
            seenTabs[tabId] = true;
            var tab = newConfig.tabs[tabId];
            var el = {
              diff: localDiff,
              def: RED.nodes.getType('tab'),
              tab: tab,
              newTab: tab,
              remoteDiff: null
            };
            if (remoteDiff !== undefined) {
              el.remoteDiff = remoteDiff;
            }
            diffList.editableList('addItem', el)
          }
        });
        if (remoteDiff !== undefined) {
          remoteDiff.newConfig.tabOrder.forEach((tabId) => {
            if (!seenTabs[tabId]) {
              var tab = remoteDiff.newConfig.tabs[tabId];
              // TODO how to recognise this is a remotely added flow
              var el = {
                diff: localDiff,
                remoteDiff: remoteDiff,
                def: RED.nodes.getType('tab'),
                tab: tab,
                remoteTab: tab
              };
              diffList.editableList('addItem', el)
            }
          });
        }
        var subflowId;
        for (subflowId in currentConfig.subflows) {
          if (currentConfig.subflows.hasOwnProperty(subflowId)) {
            seenTabs[subflowId] = true;
            el = {
              newTab: null,
              remoteTab: null,
              remoteDiff: null,
              diff: localDiff,
              def: {
                // defaults: {},
                // icon: "subflow.png",
                category: "subflows",
                color: "#da9"
              },
              tab: currentConfig.subflows[subflowId]
            }

            // TODO: possibly force invalid properties on el if needed here
            // el.def['defaults'] = {}
            // el.def['icon'] = "subflow.png"

            if (newConfig.subflows.hasOwnProperty(subflowId)) {
              el.newTab = newConfig.subflows[subflowId];
            }
            if (remoteDiff !== undefined) {
              el.remoteTab = remoteDiff.newConfig.subflows[subflowId];
              el.remoteDiff = remoteDiff;
            }
            diffList.editableList('addItem', el)
          }
        }
        for (subflowId in newConfig.subflows) {
          if (newConfig.subflows.hasOwnProperty(subflowId) && !seenTabs[subflowId]) {
            seenTabs[subflowId] = true;
            el = {
              remoteTab: null,
              remoteDiff: null,
              diff: localDiff,
              def: {
                // defaults: {},
                // icon: "subflow.png",
                category: "subflows",
                color: "#da9"
              },
              tab: newConfig.subflows[subflowId],
              newTab: newConfig.subflows[subflowId]
            }
            // TODO: possibly force invalid props on def if needed here (see previous example)

            if (remoteDiff !== undefined) {
              el.remoteDiff = remoteDiff;
            }
            diffList.editableList('addItem', el)
          }
        }
        if (remoteDiff !== undefined) {
          for (subflowId in remoteDiff.newConfig.subflows) {
            if (remoteDiff.newConfig.subflows.hasOwnProperty(subflowId) && !seenTabs[subflowId]) {
              el = {
                newTab: null,
                diff: localDiff,
                remoteDiff: remoteDiff,
                def: {
                  // defaults: {},
                  // icon: "subflow.png",
                  category: "subflows",
                  color: "#da9"
                },
                tab: remoteDiff.newConfig.subflows[subflowId],
                remoteTab: remoteDiff.newConfig.subflows[subflowId]
              }
              diffList.editableList('addItem', el)
            }
          }
        }
        $("#sidebar-shade").show();
      },
      close: () => {
        diffVisible = false;
        $("#sidebar-shade").hide();

      },
      show: () => {

      }
    }
    RED.tray.show(trayOptions);
  }
}
