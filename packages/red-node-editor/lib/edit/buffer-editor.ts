import {
  NodeEditor,
  Context,
  $,
  container,
  delegateTarget,
  lazyInject,
  $TYPES
} from './_base'
import { ICanvas, INodeEditor, IPanels } from '../../../../../red-runtime/src/interfaces/index';
import { II18n } from '../../../../../red-runtime/src/i18n/interface';
import { ITray } from '../../../tray/lib/interface';
import { IState } from '../../../_interfaces/index';
import { ISidebar } from '../../../sidebar/lib/sidebar/interface';

const TYPES = $TYPES.all

export interface IBufferEditor {
  editBuffer(options)
}

/**
 * Node Validator for NodeEditor
 */
@delegateTarget()
export class BufferEditor extends Context implements IBufferEditor {
  @lazyInject(TYPES.canvas) $view: ICanvas
  @lazyInject(TYPES.i18n) $i18n: II18n
  @lazyInject(TYPES.tray) $tray: ITray
  @lazyInject(TYPES.state) $state: IState
  @lazyInject(TYPES.editor) $editor: INodeEditor
  @lazyInject(TYPES.state) $panels: IPanels // from common widgets
  @lazyInject(TYPES.sidebar.main) $sidebar: ISidebar


  constructor(public editor: NodeEditor) {
    super()
  }

  editBuffer(options) {
    const {
      editor,
      rebind,

      // services
      $view,
      $state,
      $i18n,
      $tray,
      $editor,
      $panels,
      $sidebar
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
    $view.state($state.EDITING);
    var bufferStringEditor, bufferBinValue, bufferBinEditor;

    var panels;

    var trayOptions = {
      title: getEditStackTitle(),
      buttons: [{
        id: "node-dialog-cancel",
        text: $i18n.t("common.label.cancel"),
        click: function () {
          $tray.close();
        }
      },
      {
        id: "node-dialog-ok",
        text: $i18n.t("common.label.done"),
        class: "primary",
        click: function () {
          onComplete(JSON.stringify(bufferBinValue));
          $tray.close();
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

        bufferStringEditor = $editor.createEditor({
          id: 'node-input-buffer-str',
          value: "",
          mode: "ace/mode/text"
        });

        bufferStringEditor.getSession().setValue(value || "", -1);

        bufferBinEditor = $editor.createEditor({
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

        panels = $panels.create({
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
          $sidebar.info.set($i18n.t("bufferEditor.modeDesc"));
          $sidebar.info.show();
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
    $tray.show(trayOptions);
    return this
  }

}
