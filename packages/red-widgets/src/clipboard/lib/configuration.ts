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
  INodes,
} from '@tecla5/red-runtime'

import {
  IMenu,
  IActions,
  IEvents,
  IKeyboard,
  ICanvas
} from '../../_interfaces'

const TYPES = $TYPES.all

export interface IClipboardConfiguration {
  configure()
}

@delegateTarget()
export class ClipboardConfiguration extends Context implements IClipboardConfiguration {
  // you need to define these types in red-runtime, src/_container just like for NODES,
  // then export up the hierarchy (see index.ts files)
  @lazyInject(TYPES.common.menu) menu: IMenu
  @lazyInject(TYPES.actions) actions: IActions
  @lazyInject(TYPES.events) events: IEvents
  @lazyInject(TYPES.keyboard) keyboard: IKeyboard
  @lazyInject(TYPES.canvas) view: ICanvas

  disabled: boolean

  constructor(protected clipboard: Clipboard) {
    super()
  }

  configure() {
    const {
      RED,
      rebind,
      clipboard,
      // services injected - no longer use RED :)
      menu,
      actions,
      events
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

    events.on("view:selection-changed", function (selection) {
      if (!selection.nodes) {
        menu.setDisabled("menu-item-export", true);
        menu.setDisabled("menu-item-export-clipboard", true);
        menu.setDisabled("menu-item-export-library", true);
      } else {
        menu.setDisabled("menu-item-export", false);
        menu.setDisabled("menu-item-export-clipboard", false);
        menu.setDisabled("menu-item-export-library", false);
      }
    });

    actions.add("core:show-export-dialog", exportNodes);
    actions.add("core:show-import-dialog", importNodes);


    events.on("editor:open", () => {
      disabled = true;
    });
    events.on("editor:close", () => {
      disabled = false;
    });
    events.on("search:open", () => {
      disabled = true;
    });
    events.on("search:close", () => {
      disabled = false;
    });
    events.on("type-search:open", () => {
      disabled = true;
    });
    events.on("type-search:close", () => {
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
        keyboard.add("*", "escape", hideDropTarget);
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
          view.importNodes(data);
        } else if ($.inArray("Files", originalEvent.dataTransfer.types) != -1) {
          var files = originalEvent.dataTransfer.files;
          if (files.length === 1) {
            var file = files[0];
            var reader = new FileReader();
            reader.onload = (function (theFile) {
              return function (e) {
                view.importNodes(e.target.result);
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
