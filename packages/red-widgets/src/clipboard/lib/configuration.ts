import {
  Context,
  container,
  delegateTarget
} from './_base'

import { Clipboard } from '../'

import {
  lazyInject,
  $TYPES
} from '../../_container'

import {
  INodes
} from '@tecla5/red-runtime'

const TYPES = $TYPES.runtime

@delegateTarget({
  container,
})
export class ClipboardConfiguration extends Context {
  @lazyInject(TYPES.NODES) nodes: INodes

  disabled: boolean

  constructor(protected clipboard: Clipboard) {
    super()
  }

  configure() {
    const {
      RED,
      rebind,
      clipboard
    } = this

    let {
      disabled,
    } = this

    const {
      exportNodes,
      importNodes,
      hideDropTarget,
      setupDialogs
    } = rebind([
        'exportNodes',
        'importNodes',
        'hideDropTarget',
        'setupDialogs'
      ], clipboard)

    disabled = false;

    setupDialogs()

    $('<input type="text" id="clipboard-hidden">').appendTo("body");

    RED.events.on("view:selection-changed", function (selection) {
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

    RED.actions.add("core:show-export-dialog", exportNodes);
    RED.actions.add("core:show-import-dialog", importNodes);


    RED.events.on("editor:open", () => {
      disabled = true;
    });
    RED.events.on("editor:close", () => {
      disabled = false;
    });
    RED.events.on("search:open", () => {
      disabled = true;
    });
    RED.events.on("search:close", () => {
      disabled = false;
    });
    RED.events.on("type-search:open", () => {
      disabled = true;
    });
    RED.events.on("type-search:close", () => {
      disabled = false;
    });

    this.disabled = disabled

    $('#chart').on("dragenter", (event) => {
      const originalEvent: any = event.originalEvent
      if ($.inArray("text/plain", originalEvent.dataTransfer.types) != -1 ||
        $.inArray("Files", originalEvent.dataTransfer.types) != -1) {
        $("#dropTarget").css({
          display: 'table'
        });
        RED.keyboard.add("*", "escape", hideDropTarget);
      }
    });

    $('#dropTarget').on("dragover", function (event) {
      const originalEvent: any = event.originalEvent
      if ($.inArray("text/plain", originalEvent.dataTransfer.types) != -1 ||
        $.inArray("Files", originalEvent.dataTransfer.types) != -1) {
        event.preventDefault();
      }
    })
      .on("dragleave", function (event) {
        hideDropTarget();
      })
      .on("drop", function (event) {
        const originalEvent: any = event.originalEvent
        if ($.inArray("text/plain", originalEvent.dataTransfer.types) != -1) {
          var data = originalEvent.dataTransfer.getData("text/plain");
          data = data.substring(data.indexOf('['), data.lastIndexOf(']') + 1);
          RED.view.importNodes(data);
        } else if ($.inArray("Files", originalEvent.dataTransfer.types) != -1) {
          var files = originalEvent.dataTransfer.files;
          if (files.length === 1) {
            var file = files[0];
            var reader = new FileReader();
            reader.onload = (function (theFile) {
              return function (e) {
                RED.view.importNodes(e.target.result);
              };
            })(file);
            reader.readAsText(file);
          }
        }
        hideDropTarget();
        event.preventDefault();
      });
  }
}
