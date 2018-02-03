import {
  NodeEditor,
  Context,
  $,
  container,
  delegateTarget
} from '../_base'

export interface ISubflowDialog {
  showEditSubflowDialog(subflow)
}

/**
 * Subflow Dialog for NodeEditor
 */
@delegateTarget({
  container,
})
export class SubflowDialog extends Context {
  constructor(public editor: NodeEditor) {
    super()
  }

  showEditSubflowDialog(subflow) {
    const {
      RED,
      rebind,
      editor
    } = this
    const {
      editStack,
    } = editor

    let {
      getEditStackTitle,
      buildEditForm,
      updateNodeProperties,
      buildLabelForm,
      validateArray
    } = rebind([
        'getEditStackTitle',
        'buildEditForm',
        'updateNodeProperties',
        'buildLabelForm',
        'validateArray'
      ], editor)


    var editing_node = subflow;

    validateArray(editStack, 'editStack', 'showEditSubflowDialog')

    editStack.push(subflow);
    RED.view.state(RED.state.EDITING);
    var subflowEditor;

    var title = getEditStackTitle()
    var trayOptions = {
      title,
      buttons: [{
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
        click: function () {
          var i;
          var changes: any = {};
          var changed = false;
          var wasDirty = RED.nodes.dirty();

          var newName = $("#subflow-input-name").val();

          if (newName != editing_node.name) {
            changes['name'] = editing_node.name;
            editing_node.name = newName;
            changed = true;
          }

          var newDescription = subflowEditor.getValue();

          if (newDescription != editing_node.info) {
            changes['info'] = editing_node.info;
            editing_node.info = newDescription;
            changed = true;
          }
          var inputLabels = $("#node-label-form-inputs").children().find("input");
          var outputLabels = $("#node-label-form-outputs").children().find("input");

          var newValue = inputLabels.map(function () {
            return $(this).val();
          }).toArray().slice(0, editing_node.inputs);
          if (JSON.stringify(newValue) !== JSON.stringify(editing_node.inputLabels)) {
            changes.inputLabels = editing_node.inputLabels;
            editing_node.inputLabels = newValue;
            changed = true;
          }
          newValue = outputLabels.map(function () {
            return $(this).val();
          }).toArray().slice(0, editing_node.outputs);
          if (JSON.stringify(newValue) !== JSON.stringify(editing_node.outputLabels)) {
            changes.outputLabels = editing_node.outputLabels;
            editing_node.outputLabels = newValue;
            changed = true;
          }

          RED.palette.refresh();

          if (changed) {
            var subflowInstances = [];
            RED.nodes.eachNode(function (n) {
              if (n.type == "subflow:" + editing_node.id) {
                subflowInstances.push({
                  id: n.id,
                  changed: n.changed
                })
                n.changed = true;
                n.dirty = true;
                updateNodeProperties(n);
              }
            });
            var wasChanged = editing_node.changed;
            editing_node.changed = true;
            RED.nodes.dirty(true);
            var historyEvent = {
              t: 'edit',
              node: editing_node,
              changes: changes,
              dirty: wasDirty,
              changed: wasChanged,
              subflow: {
                instances: subflowInstances
              }
            };

            RED.history.push(historyEvent);
          }
          editing_node.dirty = true;
          RED.tray.close();
        }
      }
      ],
      resize: (dimensions) => {
        $(".editor-tray-content").height(dimensions.height - 78);
        var form = $(".editor-tray-content form").height(dimensions.height - 78 - 40);

        var rows = $("#dialog-form>div:not(.node-text-editor-row)");
        var editorRow = $("#dialog-form>div.node-text-editor-row");
        var height = $("#dialog-form").height();
        var rowCount = rows.length

        for (var i = 0; i < rowCount; i++) {
          height -= $(rows[i]).outerHeight(true);
        }
        height -= (parseInt($("#dialog-form").css("marginTop")) + parseInt($("#dialog-form").css("marginBottom")));
        $(".node-text-editor").css("height", height + "px");
        subflowEditor.resize();
      },
      open: function (tray) {
        var trayFooter = tray.find(".editor-tray-footer");
        var trayBody = tray.find('.editor-tray-body');
        trayBody.parent().css('overflow', 'hidden');

        var stack = RED.stack.create({
          container: trayBody,
          singleExpanded: true
        });
        var nodeProperties = stack.add({
          title: RED._("editor.nodeProperties"),
          expanded: true
        });
        nodeProperties.content.addClass("editor-tray-content");
        var portLabels = stack.add({
          title: RED._("editor.portLabels")
        });
        portLabels.content.addClass("editor-tray-content");

        if (editing_node) {
          RED.sidebar.info.refresh(editing_node);
        }
        var dialogForm = buildEditForm(nodeProperties.content, "dialog-form", "subflow-template");
        subflowEditor = RED.editor.createEditor({
          id: 'subflow-input-info-editor',
          mode: 'ace/mode/markdown',
          value: ""
        });

        $("#subflow-input-name").val(subflow.name);
        RED.text.bidi.prepareInput($("#subflow-input-name"));
        subflowEditor.getSession().setValue(subflow.info || "", -1);
        var userCount = 0;
        var subflowType = "subflow:" + editing_node.id;

        RED.nodes.eachNode(function (n) {
          if (n.type === subflowType) {
            userCount++;
          }
        });
        $("#subflow-dialog-user-count").html(RED._("subflow.subflowInstances", {
          count: userCount
        })).show();

        buildLabelForm(portLabels.content, subflow);
        trayBody.i18n();
      },
      close: function () {
        if (RED.view.state() != RED.state.IMPORT_DRAGGING) {
          RED.view.state(RED.state.DEFAULT);
        }
        RED.sidebar.info.refresh(editing_node);
        RED.workspaces.refresh();
        subflowEditor.destroy();
        editStack.pop();
        editing_node = null;
      },
      show: function () { }
    }
    RED.tray.show(trayOptions);
    return this
  }
}
