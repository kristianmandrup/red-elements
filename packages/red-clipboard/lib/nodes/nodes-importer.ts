import {
  Context
} from '../../../context'

import { Clipboard } from '../../';

interface IButton extends JQuery<HTMLElement> {
  button: Function
}

export class ClipboardNodesImporter extends Context {
  disabled: boolean

  constructor(protected clipboard: Clipboard) {
    super()
  }

  importNodes() {
    const {
      RED,
      disabled,
      dialog,
      dialogContainer,
    } = this.clipboard

    let {
    validateImport,
      importNodesDialog,
      validateDialogContainer
  } = this.rebind([
        'validateImport',
        'importNodesDialog',
        'validateDialogContainer'
      ])

    if (disabled) {
      return;
    }

    validateDialogContainer()

    dialogContainer.empty();
    dialogContainer.append($(importNodesDialog));
    dialogContainer.i18n();

    const dialogOk = <IButton>$("#clipboard-dialog-ok")
    dialogOk.show();
    $("#clipboard-dialog-cancel").show();
    $("#clipboard-dialog-close").hide();
    $("#clipboard-dialog-copy").hide();
    dialogOk.button("disable");

    const clipBoardImport = $("#clipboard-import")
    clipBoardImport.keyup(validateImport);
    clipBoardImport.on('paste', function () {
      setTimeout(validateImport, 10)
    });

    $("#import-tab > a").click(function (evt) {
      evt.preventDefault();
      if ($(this).hasClass('disabled') || $(this).hasClass('selected')) {
        return;
      }
      $(this).parent().children().removeClass('selected');
      $(this).addClass('selected');
    });

    dialog.dialog("option", "title", RED._("clipboard.importNodes")).dialog("open");
  }

  protected validateImport() {
    var importInput = $("#clipboard-import");
    var v = importInput.val();
    const vStr = String(v)
    v = String(vStr).substring(vStr.indexOf('['), vStr.lastIndexOf(']') + 1);
    const okButton = <IButton>$("#clipboard-dialog-ok")
    try {
      JSON.parse(v);
      importInput.removeClass("input-error");
      importInput.val(v);
      okButton.button("enable");
    } catch (err) {
      if (v !== "") {
        importInput.addClass("input-error");
      }
      okButton.button("disable");
    }
  }
}
