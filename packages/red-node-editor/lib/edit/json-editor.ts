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

export interface IJsonEditor {
  editJSON(options)
}

/**
 * Node Validator for NodeEditor
 */
@delegateTarget({
  container,
})
export class JsonEditor extends Context implements IJsonEditor {
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

  editJSON(options) {
    const {
      editor,
      rebind,

      // services
      $view,
      $state,
      $tray,
      $i18n,
      $editor,
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
    $view.state($state.EDITING);
    var expressionEditor;

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
          onComplete(expressionEditor.getValue());
          $tray.close();
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
        expressionEditor = $editor.createEditor({
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
    $tray.show(trayOptions);
    return this
  }

}
