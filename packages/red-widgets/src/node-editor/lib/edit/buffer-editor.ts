import { NodeEditor } from '../'

import {
  Context, $,
  container,
  delegateTarget
} from './_base'

export interface IBufferEditor {
  editBuffer(options)
}

/**
 * Node Validator for NodeEditor
 */
@delegateTarget({
  container,
})
export class BufferEditor extends Context implements IBufferEditor {
  constructor(public editor: NodeEditor) {
    super()
  }

  editBuffer(options) {
    const {
      RED,
      editor,
      rebind
    } = this

    const {
      editStack,
      editTrayWidthCache,
    } = editor

    const {
      buildEditForm,
      getEditStackTitle,
      stringToUTF8Array
    } = rebind([
        'buildEditForm',
        'getEditStackTitle',
        'stringToUTF8Array'
      ], editor)

    this._validateProps(options, ['value', 'complete'], 'editExpression')

    var value = options.value;
    var onComplete = options.complete;
    var type = "_buffer"

    editStack.push({
      type: type
    });
    RED.view.state(RED.state.EDITING);
    var bufferStringEditor, bufferBinValue, bufferBinEditor;

    var panels;

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
          onComplete(JSON.stringify(bufferBinValue));
          RED.tray.close();
        }
      }
      ],
      resize: function (dimensions) {
        if (dimensions) {
          editTrayWidthCache[type] = dimensions.width;
        }
        var height = $("#dialog-form").height();
        if (panels) {
          panels.resize(height);
        }
      },
      open: (tray) => {
        var trayBody = tray.find('.editor-tray-body');
        var dialogForm = buildEditForm(tray.find('.editor-tray-body'), 'dialog-form', type, 'editor');

        bufferStringEditor = RED.editor.createEditor({
          id: 'node-input-buffer-str',
          value: "",
          mode: "ace/mode/text"
        });

        bufferStringEditor.getSession().setValue(value || "", -1);

        bufferBinEditor = RED.editor.createEditor({
          id: 'node-input-buffer-bin',
          value: "",
          mode: "ace/mode/text",
          readOnly: true
        });

        var changeTimer;
        var buildBuffer = (data) => {
          if (!data) {
            this.handleError('editBuffer:trayOptions:buildBuffer(data) data is invalid', {
              data
            })
          }
          var valid = true;
          var isString = typeof data === 'string';
          var binBuffer = [];
          bufferBinValue = isString ? stringToUTF8Array(data) : data
          var i = 0,
            l = bufferBinValue.length;
          var c = 0;
          for (i = 0; i < l; i++) {
            var d = parseInt(bufferBinValue[i]);
            if (!isString && (isNaN(d) || d < 0 || d > 255)) {
              valid = false;
              break;
            }
            if (i > 0) {
              if (i % 8 === 0) {
                if (i % 16 === 0) {
                  binBuffer.push("\n");
                } else {
                  binBuffer.push("  ");
                }
              } else {
                binBuffer.push(" ");
              }
            }
            binBuffer.push((d < 16 ? "0" : "") + d.toString(16).toUpperCase());
          }
          if (valid) {
            $("#node-input-buffer-type-string").toggle(isString);
            $("#node-input-buffer-type-array").toggle(!isString);
            bufferBinEditor.setValue(binBuffer.join(""), 1);
          }
          return valid;
        }
        var bufferStringUpdate = function () {
          var value = bufferStringEditor.getValue();
          var isValidArray = false;
          if (/^[\s]*\[[\s\S]*\][\s]*$/.test(value)) {
            isValidArray = true;
            try {
              var data = JSON.parse(value);
              isValidArray = buildBuffer(data);
            } catch (err) {
              isValidArray = false;
            }
          }
          if (!isValidArray) {
            buildBuffer(value);
          }

        }
        bufferStringEditor.getSession().on('change', function () {
          clearTimeout(changeTimer);
          changeTimer = setTimeout(bufferStringUpdate, 200);
        });

        bufferStringUpdate();

        dialogForm.i18n();

        panels = RED.panels.create({
          id: "node-input-buffer-panels",
          resize: function (p1Height, p2Height) {
            var p1 = $("#node-input-buffer-panel-str");
            p1Height -= $(p1.children()[0]).outerHeight(true);
            var editorRow = $(p1.children()[1]);
            p1Height -= (parseInt(editorRow.css("marginTop")) + parseInt(editorRow.css("marginBottom")));
            $("#node-input-buffer-str").css("height", (p1Height - 5) + "px");
            bufferStringEditor.resize();

            var p2 = $("#node-input-buffer-panel-bin");
            editorRow = $(p2.children()[0]);
            p2Height -= (parseInt(editorRow.css("marginTop")) + parseInt(editorRow.css("marginBottom")));
            $("#node-input-buffer-bin").css("height", (p2Height - 5) + "px");
            bufferBinEditor.resize();
          }
        });

        $(".node-input-buffer-type").click(function (e) {
          e.preventDefault();
          RED.sidebar.info.set(RED._("bufferEditor.modeDesc"));
          RED.sidebar.info.show();
        })


      },
      close: function () {
        editStack.pop();
        bufferStringEditor.destroy();
        bufferBinEditor.destroy();
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
