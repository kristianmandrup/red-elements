import {
  Library
} from './'
import { Context } from '../../../context';

const { log } = console

interface IDialog extends JQuery<HTMLElement> {
  dialog: Function
}

export class LibraryConfiguration extends Context {
  constructor(public library: Library) {
    super()
  }

  set exportToLibraryDialog(value) {
    this.library.exportToLibraryDialog = value
  }

  configure(options: any = {}) {
    const {
      RED
    } = this.library
    let {
      exportFlow,
      postLibraryFlow,
      loadFlowLibrary
    } = this.rebind([
        'exportFlow',
        'postLibraryFlow',
        'loadFlowLibrary'
      ], this.library)

    RED.actions.add("core:library-export", exportFlow);

    RED.events.on("view:selection-changed", (selection) => {
      if (!selection.nodes) {
        RED.menu.setDisabled("menu-item-export", true);
        RED.menu.setDisabled("menu-item-export-clipboard", true);
        RED.menu.setDisabled("menu-item-export-library", true);
      } else {
        RED.menu.setDisabled("menu-item-export", false);
        RED.menu.setDisabled("menu-item-export-clipboard", false);
        RED.menu.setDisabled("menu-item-export-library", false);
      }
    });

    if (RED.settings.theme("menu.menu-item-import-library") !== false) {
      loadFlowLibrary(true);
    }

    this.exportToLibraryDialog = (<any>$('<div id="library-dialog" class="hide"><form class="dialog-form form-horizontal"></form></div>'))
      .appendTo("body")
      .dialog({
        modal: true,
        autoOpen: false,
        width: 500,
        resizable: false,
        title: RED._("library.exportToLibrary"),
        buttons: [{
          id: "library-dialog-cancel",
          text: RED._("common.label.cancel"),
          click: function () {
            (<any>$(this)).dialog("close");
          }
        },
        {
          id: "library-dialog-ok",
          class: "primary",
          text: RED._("common.label.export"),
          click: () => {
            //TODO: move this to RED.library
            var flowName: any = $("#node-input-library-filename").val();
            if (!/^\s*$/.test(flowName)) {
              postLibraryFlow(flowName)
            }
            (<any>$(this)).dialog("close");
          }
        }
        ],
        open: (e) => {
          $(this).parent().find(".ui-dialog-titlebar-close").hide();
        },
        close: (e) => { }
      });

    this.exportToLibraryDialog.children(".dialog-form").append($(
      '<div class="form-row">' +
      '<label for="node-input-library-filename" data-i18n="[append]editor:library.filename"><i class="fa fa-file"></i> </label>' +
      '<input type="text" id="node-input-library-filename" data-i18n="[placeholder]editor:library.fullFilenamePlaceholder">' +
      '<input type="text" style="display: none;" />' + // Second hidden input to prevent submit on Enter
      '</div>'
    ));
  }
}
