import {
  Library,
  Context,
  container,
  delegateTarget,
  lazyInject,
  $TYPES
} from './_base'

import {
  ISettings
} from '@tecla5/red-runtime'

import {
  IMenu,
  IActions,
  IEvents,
} from '../../../_interfaces'
import { II18n } from '../../../../../red-runtime/src/index';

const TYPES = $TYPES.all

interface IDialog extends JQuery<HTMLElement> {
  dialog: Function
}

export interface ILibraryConfiguration {
  exportToLibraryDialog(value)
  configure(options: any)
}

@delegateTarget()
export class LibraryConfiguration extends Context implements ILibraryConfiguration {

  @lazyInject(TYPES.actions) $actions: IActions
  @lazyInject(TYPES.events) $events: IEvents
  @lazyInject(TYPES.common.menu) $menu: IMenu
  @lazyInject(TYPES.settings) $settings: ISettings
  @lazyInject(TYPES.i18n) $i18n: II18n

  constructor(public library: Library) {
    super()
  }

  set exportToLibraryDialog(value) {
    this.library.exportToLibraryDialog = value
  }

  configure(options: any = {}) {
    const {
      $i18n
    } = this
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

    const {
      $actions,
      $events,
      $menu,
      $settings
    } = this

    $actions.add("core:library-export", exportFlow);

    $events.on("view:selection-changed", (selection) => {
      if (!selection.nodes) {
        $menu.setDisabled("menu-item-export", true);
        $menu.setDisabled("menu-item-export-clipboard", true);
        $menu.setDisabled("menu-item-export-library", true);
      } else {
        $menu.setDisabled("menu-item-export", false);
        $menu.setDisabled("menu-item-export-clipboard", false);
        $menu.setDisabled("menu-item-export-library", false);
      }
    });

    if ($settings.theme("menu.menu-item-import-library") !== false) {
      loadFlowLibrary(true);
    }

    this.exportToLibraryDialog = (<any>$('<div id="library-dialog" class="hide"><form class="dialog-form form-horizontal"></form></div>'))
      .appendTo("body")
      .dialog({
        modal: true,
        autoOpen: false,
        width: 500,
        resizable: false,
        title: $i18n.t("library.exportToLibrary"),
        buttons: [{
          id: "library-dialog-cancel",
          text: $i18n.t("common.label.cancel"),
          click: function () {
            (<any>$(this)).dialog("close");
          }
        },
        {
          id: "library-dialog-ok",
          class: "primary",
          text: $i18n.t("common.label.export"),
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
