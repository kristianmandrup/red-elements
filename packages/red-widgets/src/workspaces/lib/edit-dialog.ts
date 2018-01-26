import { Workspaces } from './'
import { Context } from '../../context'

interface IDialogForm extends JQuery<HTMLElement> {
  i18n: Function
}

export class WorkspaceEditDialog extends Context {
  constructor(public workspaces: Workspaces) {
    super()
  }


  /**
   * show rename Workspace Dialog
   * @param id
   */
  showRenameWorkspaceDialog(id: string | number) {
    let {
      RED,
      workspace_tabs,
    } = this.workspaces

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
          var label = this.nameInput.val();
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
            workspace_tabs.renameTab(workspace.id, label);
          }
          var disabled = this.disabledInput.prop("checked");
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

          this.setWorkspaceTab(workspace)
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
      resize: (dimensions) => {
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
      open: (tray) => {
        var trayBody = tray.find('.editor-tray-body');
        const dialogForm = this.buildDialogForm(trayBody)

        tabflowEditor = RED.editor.createEditor({
          id: 'node-input-info',
          mode: 'ace/mode/markdown',
          value: ""
        });

        this.addFormTips(dialogForm)

        dialogForm.find('#node-input-disabled-btn').on("click", (e) => {
          var i = $(this).find("i");
          if (i.hasClass('fa-toggle-off')) {
            this.toggleOn(i)
          } else {
            this.toggleOff(i)
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
        dialogForm.submit((e) => {
          e.preventDefault();
        });
        $("#node-input-name").val(workspace.label);
        RED.text.bidi.prepareInput($("#node-input-name"));
        tabflowEditor.getSession().setValue(workspace.info || "", -1);
        dialogForm.i18n();
      },
      close: () => {
        if (RED.view.state() != RED.state.IMPORT_DRAGGING) {
          RED.view.state(RED.state.DEFAULT);
        }
        RED.sidebar.info.refresh(workspace);
        tabflowEditor.destroy();
      }
    }
    RED.tray.show(trayOptions);
    return this
  }

  // protected

  protected toggleOn(i) {
    const {
      RED
    } = this
    i.addClass('fa-toggle-on');
    i.removeClass('fa-toggle-off');
    $("#node-input-disabled").prop("checked", false);
    $("#node-input-disabled-label").html(RED._("editor:workspace.enabled"));
  }

  protected toggleOff(i) {
    const {
      RED
    } = this
    i.addClass('fa-toggle-off');
    i.removeClass('fa-toggle-on');
    $("#node-input-disabled").prop("checked", true);
    $("#node-input-disabled-label").html(RED._("editor:workspace.disabled"));
  }


  protected get disabledInput() {
    return $("#node-input-disabled")
  }

  protected get nameInput() {
    return $("#node-input-name")
  }

  protected setWorkspaceTab(workspace) {
    $("#red-ui-tab-" + (workspace.id.replace(".", "-"))).toggleClass('workspace-disabled', workspace.disabled);
  }

  protected buildDialogForm(trayBody) {
    const dialogForm = <IDialogForm>$('<form id="dialog-form" class="form-horizontal"></form>').appendTo(trayBody);

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
    return dialogForm
  }

  protected addFormTips(dialogForm) {
    $('<div class="form-tips" data-i18n="editor:workspace.tip"></div>').appendTo(dialogForm);
  }

}
