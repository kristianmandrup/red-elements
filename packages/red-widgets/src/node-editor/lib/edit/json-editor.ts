import { NodeEditor } from '../'

import {
  Context, $,
  container,
  delegateTarget
} from './_base'

/**
 * Node Validator for NodeEditor
 */
@delegateTarget({
  container,
})
export class JsonEditor extends Context {
  constructor(public editor: NodeEditor) {
    super()
  }

  editJSON(options) {
    const {
      RED,
      editor,
      rebind
    } = this
    let {
      editStack,
      editTrayWidthCache
    } = editor

    const {
      getEditStackTitle,
      buildEditForm
    } = rebind([
        'getEditStackTitle',
        'buildEditForm'
      ], editor)

    this._validateProps(options, ['value', 'complete'], 'editExpression')

    var value = options.value;
    var onComplete = options.complete;
    var type = "_json"
    editStack.push({
      type: type
    });
    RED.view.state(RED.state.EDITING);
    var expressionEditor;

    var trayOptions = {
      title: getEditStackTitle(),
      buttons: [{
        id: "node-dialog-cancel",
        text: RED._("common.label.cancel"),
        click: function () {
          RED.tray.close();
        }
      },
      {
        id: "node-dialog-ok",
        text: RED._("common.label.done"),
        class: "primary",
        click: function () {
          onComplete(expressionEditor.getValue());
          RED.tray.close();
        }
      }
      ],
      resize: function (dimensions) {
        editTrayWidthCache[type] = dimensions.width;

        var rows = $("#dialog-form>div:not(.node-text-editor-row)");
        var editorRow = $("#dialog-form>div.node-text-editor-row");
        var height = $("#dialog-form").height();
        var rowCount = rows.length

        for (var i = 0; i < rowCount; i++) {
          height -= $(rows[i]).outerHeight(true);
        }
        height -= (parseInt($("#dialog-form").css("marginTop")) + parseInt($("#dialog-form").css("marginBottom")));
        $(".node-text-editor").css("height", height + "px");
        expressionEditor.resize();
      },
      open: function (tray) {
        var trayBody = tray.find('.editor-tray-body');
        var dialogForm = buildEditForm(tray.find('.editor-tray-body'), 'dialog-form', type, 'editor');
        expressionEditor = RED.editor.createEditor({
          id: 'node-input-json',
          value: "",
          mode: "ace/mode/json"
        });
        expressionEditor.getSession().setValue(value || "", -1);
        $("#node-input-json-reformat").click(function (evt) {
          evt.preventDefault();
          var v = expressionEditor.getValue() || "";
          try {
            v = JSON.stringify(JSON.parse(v), null, 4);
          } catch (err) {
            // TODO: do an optimistic auto-format
          }
          expressionEditor.getSession().setValue(v || "", -1);
        });
        dialogForm.i18n();
      },
      close: function () {
        editStack.pop();
        expressionEditor.destroy();
      },
      show: function () { },
      width: null
    }
    if (editTrayWidthCache.hasOwnProperty(type)) {
      trayOptions.width = editTrayWidthCache[type];
    }
    RED.tray.show(trayOptions);
    return this
  }

}
