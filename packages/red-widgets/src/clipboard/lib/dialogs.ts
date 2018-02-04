import {
  Context,
  container,
  delegateTarget,
  Clipboard,
  lazyInject,
  $TYPES
} from './_base'
import { II18n } from '../../../../red-runtime/src/i18n/index';
import { ICanvas } from '../../canvas/index';
import { INotifications } from '../../notifications/lib/index';

interface IDialog extends JQuery<HTMLElement> {
  dialog: Function
}

export interface IClipboardDialogs {
  setupDialogs()
}

const TYPES = $TYPES.all

@delegateTarget()
export class ClipboardDialogs extends Context implements IClipboardDialogs {
  disabled: boolean

  @lazyInject(TYPES.i18n) $i18n: II18n
  @lazyInject(TYPES.notifications) $notifications: INotifications
  @lazyInject(TYPES.view) $view: ICanvas

  constructor(protected clipboard: Clipboard) {
    super()
  }

  setupDialogs() {
    const {
      $i18n,
      $notifications,
      $view
    } = this
    let {
      dialog,
      dialogContainer,
      exportNodesDialog,
      importNodesDialog
    } = this.clipboard

    dialog = <IDialog>$('<div id="clipboard-dialog" class="hide node-red-dialog"><form class="dialog-form form-horizontal"></form></div>')

    dialog.appendTo("body")
      .dialog({
        modal: true,
        autoOpen: false,
        width: 500,
        resizable: false,
        buttons: [{
          id: "clipboard-dialog-cancel",
          text: $i18n.t("common.label.cancel"),
          click: function () {
            dialog.dialog("close");
          }
        },
        {
          id: "clipboard-dialog-close",
          class: "primary",
          text: $i18n.t("common.label.close"),
          click: function () {
            dialog.dialog("close");
          }
        },
        {
          id: "clipboard-dialog-copy",
          class: "primary",
          text: $i18n.t("clipboard.export.copy"),
          click: function () {
            $("#clipboard-export").select();
            document.execCommand("copy");
            document.getSelection().removeAllRanges();
            const msg = $i18n.t("clipboard.nodesExported")
            $notifications.notify(msg);
            dialog.dialog("close");
          }
        },
        {
          id: "clipboard-dialog-ok",
          class: "primary",
          text: $i18n.t("common.label.import"),
          click: function () {
            $view.importNodes($("#clipboard-import").val(), $("#import-tab > a.selected").attr('id') === 'import-tab-new');
            dialog.dialog("close");
          }
        }
        ],
        open: function (e) {
          $(this).parent().find(".ui-dialog-titlebar-close").hide();
        },
        close: function (e) { }
      });

    dialogContainer = dialog.children(".dialog-form");

    exportNodesDialog =
      '<div class="form-row">' +
      '<label style="width:auto;margin-right: 10px;" data-i18n="clipboard.export.copy"></label>' +
      '<span id="export-range-group" class="button-group">' +
      '<a id="export-range-selected" class="editor-button toggle" href="#" data-i18n="clipboard.export.selected"></a>' +
      '<a id="export-range-flow" class="editor-button toggle" href="#" data-i18n="clipboard.export.current"></a>' +
      '<a id="export-range-full" class="editor-button toggle" href="#" data-i18n="clipboard.export.all"></a>' +
      '</span>' +
      '</div>' +
      '<div class="form-row">' +
      '<textarea readonly style="resize: none; width: 100%; border-radius: 4px;font-family: monospace; font-size: 12px; background:#f3f3f3; padding-left: 0.5em; box-sizing:border-box;" id="clipboard-export" rows="5"></textarea>' +
      '</div>' +
      '<div class="form-row" style="text-align: right;">' +
      '<span id="export-format-group" class="button-group">' +
      '<a id="export-format-mini" class="editor-button editor-button-small toggle" href="#" data-i18n="clipboard.export.compact"></a>' +
      '<a id="export-format-full" class="editor-button editor-button-small toggle" href="#" data-i18n="clipboard.export.formatted"></a>' +
      '</span>' +
      '</div>';

    importNodesDialog = '<div class="form-row">' +
      '<textarea style="resize: none; width: 100%; border-radius: 0px;font-family: monospace; font-size: 12px; background:#eee; padding-left: 0.5em; box-sizing:border-box;" id="clipboard-import" rows="5" placeholder="' +
      $i18n.t("clipboard.pasteNodes") +
      '"></textarea>' +
      '</div>' +
      '<div class="form-row">' +
      '<label style="width:auto;margin-right: 10px;" data-i18n="clipboard.import.import"></label>' +
      '<span id="import-tab" class="button-group">' +
      '<a id="import-tab-current" class="editor-button toggle selected" href="#" data-i18n="clipboard.export.current"></a>' +
      '<a id="import-tab-new" class="editor-button toggle" href="#" data-i18n="clipboard.import.newFlow"></a>' +
      '</span>' +
      '</div>';

    this.setInstanceVars({
      dialog,
      dialogContainer,
      importNodesDialog,
      exportNodesDialog
    })
  }
}
