/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
import {
  Context
} from '../../common'
import {
  Tabs
} from '../../common/controllers'

const { log } = console

interface IDialogForm extends JQuery<HTMLElement> {
  i18n: Function
}

export class Workspaces extends Context {
  // TODO: should be static
  createTabs(options) {
    return new Tabs(options)
  }

  public activeWorkspace: number = 0
  public workspaceIndex: number = 0
  public workspace_tabs: any // TODO: Array<Tab> ??

  constructor() {
    super()
    const { RED } = this
    this.createWorkspaceTabs();

    let {
      workspace_tabs,
      activeWorkspace
    } = this

    const {
      addWorkspace,
      editWorkspace,
      removeWorkspace,
      deleteWorkspace
    } = this.rebind([
        'addWorkspace',
        'editWorkspace',
        'removeWorkspace',
        'deleteWorkspace',
        'createWorkspaceTabs'
      ])

    if (typeof workspace_tabs !== 'object') {
      this.handleError('createWorkspaceTabs needs to create workspace_tabs', {
        workspace_tabs
      })
    }

    RED.events.on("sidebar:resize", workspace_tabs.resize);

    RED.actions.add("core:show-next-tab", workspace_tabs.nextTab);
    RED.actions.add("core:show-previous-tab", workspace_tabs.previousTab);

    RED.menu.setAction('menu-item-workspace-delete', function () {
      deleteWorkspace(RED.nodes.workspace(activeWorkspace));
    });

    $(window).resize(function () {
      workspace_tabs.resize();
    });

    RED.actions.add("core:add-flow", addWorkspace);
    RED.actions.add("core:edit-flow", editWorkspace);
    RED.actions.add("core:remove-flow", removeWorkspace);

    log('Workspaces created')
  }

  workspaceTabAt(workspaceIndex) {
    const { RED } = this
    return $("#workspace-tabs a[title='" + RED._('workspace.defaultName', {
      number: workspaceIndex
    }) + "']")
  }

  addWorkspace(ws, skipHistoryEntry) {
    let {
      RED,
      workspace_tabs,
      workspaceIndex,
    } = this

    const {
      workspaceTabAt
    } = this.rebind([
        'workspaceTabAt'
      ])

    if (ws) {
      workspace_tabs.addTab(ws);
      workspace_tabs.resize();
    } else {
      var tabId = RED.nodes.id();
      do {
        workspaceIndex += 1;
      } while (workspaceTabAt(workspaceIndex).length !== 0);

      ws = {
        type: "tab",
        id: tabId,
        disabled: false,
        info: "",
        label: RED._('workspace.defaultName', {
          number: workspaceIndex
        })
      };
      RED.nodes.addWorkspace(ws);
      workspace_tabs.addTab(ws);
      workspace_tabs.activateTab(tabId);
      if (!skipHistoryEntry) {
        RED.history.push({
          t: 'add',
          workspaces: [ws],
          dirty: RED.nodes.dirty()
        });
        RED.nodes.dirty(true);
      }
    }
    RED.view.focus();
    return ws;
  }

  deleteWorkspace(ws) {
    const {
      RED,
      workspace_tabs
    } = this

    const {
      removeWorkspace
    } = this.rebind([
        'removeWorkspace'
      ])

    if (workspace_tabs.count() == 1) {
      return;
    }
    removeWorkspace(ws);
    var historyEvent = RED.nodes.removeWorkspace(ws.id);
    historyEvent.t = 'delete';
    historyEvent.dirty = RED.nodes.dirty();
    historyEvent.workspaces = [ws];
    RED.history.push(historyEvent);
    RED.nodes.dirty(true);
    RED.sidebar.config.refresh();
  }

  showRenameWorkspaceDialog(id) {
    let {
      RED,
      workspace_tabs,
    } = this

    const {
      deleteWorkspace
    } = this.rebind([
        'deleteWorkspace'
      ])

    var workspace = RED.nodes.workspace(id);

    RED.view.state(RED.state.EDITING);
    var tabflowEditor;
    var trayOptions = {
      title: RED._("workspace.editFlow", {
        name: workspace.label
      }),
      buttons: [{
        id: "node-dialog-delete",
        class: 'leftButton' + ((workspace_tabs.count() == 1) ? " disabled" : ""),
        text: RED._("common.label.delete"), //'<i class="fa fa-trash"></i>',
        click: function () {
          deleteWorkspace(workspace);
          RED.tray.close();
        }
      },
      {
        id: "node-dialog-cancel",
        text: RED._("common.label.cancel"),
        click: function () {
          RED.tray.close();
        }
      },
      {
        id: "node-dialog-ok",
        class: "primary",
        text: RED._("common.label.done"),
        click: () => {
          var label = $("#node-input-name").val();
          var changed = false;
          var changes = {
            label: null,
            disabled: null,
            info: null
          };
          if (workspace.label != label) {
            changes.label = workspace.label;
            changed = true;
            workspace.label = label;
            this.workspace_tabs.renameTab(workspace.id, label);
          }
          var disabled = $("#node-input-disabled").prop("checked");
          if (workspace.disabled !== disabled) {
            changes.disabled = workspace.disabled;
            changed = true;
            workspace.disabled = disabled;
          }
          var info = tabflowEditor.getValue();
          if (workspace.info !== info) {
            changes.info = workspace.info;
            changed = true;
            workspace.info = info;
          }
          $("#red-ui-tab-" + (workspace.id.replace(".", "-"))).toggleClass('workspace-disabled', workspace.disabled);
          // $("#workspace").toggleClass("workspace-disabled",workspace.disabled);

          if (changed) {
            var historyEvent = {
              t: "edit",
              changes: changes,
              node: workspace,
              dirty: RED.nodes.dirty()
            }
            workspace.changed = true;
            RED.history.push(historyEvent);
            RED.nodes.dirty(true);
            RED.sidebar.config.refresh();
            var selection = RED.view.selection();
            if (!selection.nodes && !selection.links) {
              RED.sidebar.info.refresh(workspace);
            }
          }
          RED.tray.close();
        }
      }
      ],
      resize: function (dimensions) {
        var rows = $("#dialog-form>div:not(.node-text-editor-row)");
        var editorRow = $("#dialog-form>div.node-text-editor-row");
        var height = $("#dialog-form").height();
        var rowCount = rows.length
        for (var i = 0; i < rowCount; i++) {
          height -= $(rows[i]).outerHeight(true);
        }
        height -= (parseInt($("#dialog-form").css("marginTop")) + parseInt($("#dialog-form").css("marginBottom")));
        height -= 28;
        $(".node-text-editor").css("height", height + "px");
        tabflowEditor.resize();
      },
      open: function (tray) {
        var trayBody = tray.find('.editor-tray-body');
        var dialogForm = <IDialogForm>$('<form id="dialog-form" class="form-horizontal"></form>').appendTo(trayBody);

        $('<div class="form-row">' +
          '<label for="node-input-name" data-i18n="[append]editor:common.label.name"><i class="fa fa-tag"></i> </label>' +
          '<input type="text" id="node-input-name">' +
          '</div>').appendTo(dialogForm);

        $('<div class="form-row">' +
          '<label for="node-input-disabled-btn" data-i18n="editor:workspace.status"></label>' +
          '<button id="node-input-disabled-btn" class="editor-button"><i class="fa fa-toggle-on"></i> <span id="node-input-disabled-label"></span></button> ' +
          '<input type="checkbox" id="node-input-disabled" style="display: none;"/>' +
          '</div>').appendTo(dialogForm);

        $('<div class="form-row node-text-editor-row">' +
          '<label for="node-input-info" data-i18n="editor:workspace.info" style="width:300px;"></label>' +
          '<div style="height:250px;" class="node-text-editor" id="node-input-info"></div>' +
          '</div>').appendTo(dialogForm);
        tabflowEditor = RED.editor.createEditor({
          id: 'node-input-info',
          mode: 'ace/mode/markdown',
          value: ""
        });

        $('<div class="form-tips" data-i18n="editor:workspace.tip"></div>').appendTo(dialogForm);

        dialogForm.find('#node-input-disabled-btn').on("click", function (e) {
          var i = $(this).find("i");
          if (i.hasClass('fa-toggle-off')) {
            i.addClass('fa-toggle-on');
            i.removeClass('fa-toggle-off');
            $("#node-input-disabled").prop("checked", false);
            $("#node-input-disabled-label").html(RED._("editor:workspace.enabled"));
          } else {
            i.addClass('fa-toggle-off');
            i.removeClass('fa-toggle-on');
            $("#node-input-disabled").prop("checked", true);
            $("#node-input-disabled-label").html(RED._("editor:workspace.disabled"));
          }
        })

        if (workspace.hasOwnProperty("disabled")) {
          $("#node-input-disabled").prop("checked", workspace.disabled);
          if (workspace.disabled) {
            dialogForm.find("#node-input-disabled-btn i").removeClass('fa-toggle-on').addClass('fa-toggle-off');
            $("#node-input-disabled-label").html(RED._("editor:workspace.disabled"));
          } else {
            $("#node-input-disabled-label").html(RED._("editor:workspace.enabled"));
          }
        } else {
          workspace.disabled = false;
          $("#node-input-disabled-label").html(RED._("editor:workspace.enabled"));
        }

        $('<input type="text" style="display: none;" />').prependTo(dialogForm);
        dialogForm.submit(function (e) {
          e.preventDefault();
        });
        $("#node-input-name").val(workspace.label);
        RED.text.bidi.prepareInput($("#node-input-name"));
        tabflowEditor.getSession().setValue(workspace.info || "", -1);
        dialogForm.i18n();
      },
      close: function () {
        if (RED.view.state() != RED.state.IMPORT_DRAGGING) {
          RED.view.state(RED.state.DEFAULT);
        }
        RED.sidebar.info.refresh(workspace);
        tabflowEditor.destroy();
      }
    }
    RED.tray.show(trayOptions);
  }

  createWorkspaceTabs() {
    let {
      RED,
      activeWorkspace,
      workspace_tabs
    } = this

    const {
      showRenameWorkspaceDialog,
      setWorkspaceOrder,
      addWorkspace,
      createTabs
    } = this.rebind([
        'showRenameWorkspaceDialog',
        'setWorkspaceOrder',
        'addWorkspace',
        'createTabs'
      ])

    // see ui/common/tabs
    workspace_tabs = createTabs({
      id: "workspace-tabs",
      onchange: (tab) => {
        var event = {
          old: activeWorkspace,
          workspace: null
        }
        activeWorkspace = tab.id;
        event.workspace = activeWorkspace;
        // $("#workspace").toggleClass("workspace-disabled",tab.disabled);
        RED.events.emit("workspace:change", event);
        window.location.hash = 'flow/' + tab.id;
        RED.sidebar.config.refresh();
        RED.view.focus();
      },
      onclick: (tab) => {
        RED.view.focus();
      },
      ondblclick: (tab) => {
        if (tab.type != "subflow") {
          showRenameWorkspaceDialog(tab.id);
        } else {
          RED.editor.editSubflow(RED.nodes.subflow(tab.id));
        }
      },
      onadd: (tab) => {
        $('<span class="workspace-disabled-icon"><i class="fa fa-ban"></i> </span>').prependTo("#red-ui-tab-" + (tab.id.replace(".", "-")) + " .red-ui-tab-label");
        if (tab.disabled) {
          $("#red-ui-tab-" + (tab.id.replace(".", "-"))).addClass('workspace-disabled');
        }
        RED.menu.setDisabled("menu-item-workspace-delete", workspace_tabs.count() == 1);
      },
      onremove: (tab) => {
        RED.menu.setDisabled("menu-item-workspace-delete", workspace_tabs.count() == 1);
      },
      onreorder: (oldOrder, newOrder) => {
        RED.history.push({
          t: 'reorder',
          order: oldOrder,
          dirty: RED.nodes.dirty()
        });
        RED.nodes.dirty(true);
        setWorkspaceOrder(newOrder);
      },
      minimumActiveTabWidth: 150,
      scrollable: true,
      addButton: () => {
        addWorkspace();
      }
    });

    this.workspace_tabs = workspace_tabs

    RED.tabs = workspace_tabs
  }

  editWorkspace(id) {
    let {
      activeWorkspace
    } = this
    this.showRenameWorkspaceDialog(id || activeWorkspace);
  }

  removeWorkspace(ws) {
    let {
      RED,
      activeWorkspace
    } = this

    let workspace_tabs = this.workspace_tabs
    if (!ws) {
      this.deleteWorkspace(RED.nodes.workspace(activeWorkspace));
    } else {
      if (workspace_tabs.contains(ws.id)) {
        workspace_tabs.removeTab(ws.id);
      }
    }
  }

  setWorkspaceOrder(order) {
    const {
      RED
    } = this

    let workspace_tabs = this.workspace_tabs
    RED.nodes.setWorkspaceOrder(order.filter(function (id) {
      return RED.nodes.workspace(id) !== undefined;
    }));
    workspace_tabs.order(order);
  }

  contains(id) {
    return this.workspace_tabs.contains(id);
  }

  count() {
    return this.workspace_tabs.count();
  }

  active() {
    return this.activeWorkspace
  }

  show(id) {
    const {
      RED,
      addWorkspace
    } = this.rebind([
        'addWorkspace'
      ])

    let workspace_tabs = this.workspace_tabs
    if (!workspace_tabs.contains(id)) {
      var sf = RED.nodes.subflow(id);
      if (sf) {
        addWorkspace({
          type: "subflow",
          id: id,
          icon: "red/images/subflow_tab.png",
          label: sf.name,
          closeable: true
        });
      } else {
        return;
      }
    }
    workspace_tabs.activateTab(id);
  }

  refresh() {
    const {
      RED,
      workspace_tabs
    } = this

    RED.nodes.eachWorkspace(function (ws) {
      workspace_tabs.renameTab(ws.id, ws.label);

    })
    RED.nodes.eachSubflow(function (sf) {
      if (workspace_tabs.contains(sf.id)) {
        workspace_tabs.renameTab(sf.id, sf.name);
      }
    });
    RED.sidebar.config.refresh();
  }

  resize() {
    this.workspace_tabs.resize();
  }
}
