import {
  Context,
  container,
  delegateTarget,
  lazyInject,
  $TYPES,
  Clipboard,
} from './_base'

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
  @lazyInject(TYPES.common.menu) $menu: IMenu
  @lazyInject(TYPES.actions) $actions: IActions
  @lazyInject(TYPES.events) $events: IEvents
  @lazyInject(TYPES.keyboard) $keyboard: IKeyboard
  @lazyInject(TYPES.canvas) $view: ICanvas

  constructor(protected clipboard: Clipboard) {
    super()
  }

  get $chart() {
    return $('#chart')
  }


  configure() {
    const {
      rebind,
      clipboard,
      // services injected - no longer use RED :)
      $menu,
      $actions,
      $events,
      $keyboard,
      $view,

      // UI
      $chart,
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

    const {
      setDisabled,
      configEvents,
      configDropTarget,
      configChart,
      configActions,
      addClipboardToView
    } = rebind([
        'setDisabled',
        'configEvents',
        'configDropTarget',
        'configChart',
        'configActions',
        'addClipboardToView'
      ])

    setDisabled(false)

    // UI
    setupDialogs()
    addClipboardToView()

    configActions()
    configEvents()
    configChart()
    configDropTarget()
  }

  addClipboardToView() {
    $('<input type="text" id="clipboard-hidden">').appendTo("body");
  }

  get $dropTarget() {
    return $('#dropTarget')
  }

  protected configActions() {
    const {
      rebind,
      clipboard,
      $actions
    } = this
    const {
      exportNodes,
      importNodes,
    } = rebind([
        'exportNodes',
        'importNodes',
      ], clipboard)

    $actions.add("core:show-export-dialog", exportNodes);
    $actions.add("core:show-import-dialog", importNodes);
  }

  protected configChart() {
    const {
      clipboard,
      rebind,
      $chart,
      $keyboard
    } = this
    const {
      hideDropTarget,
    } = rebind([
        'hideDropTarget',
      ], clipboard)


    $chart.on("dragenter", (event) => {
      const originalEvent: any = event.originalEvent
      if ($.inArray("text/plain", originalEvent.dataTransfer.types) != -1 ||
        $.inArray("Files", originalEvent.dataTransfer.types) != -1) {
        $("#dropTarget").css({
          display: 'table'
        });
        $keyboard.add("*", "escape", hideDropTarget);
      }
    });
  }

  protected configDropTarget() {
    const {
      clipboard,
      rebind,
      $view,

      // UI
      $dropTarget
    } = this
    const {
      hideDropTarget,
    } = rebind([
        'hideDropTarget',
      ], clipboard)

    $dropTarget.on("dragover", function (event) {
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
          $view.importNodes(data);
        } else if ($.inArray("Files", originalEvent.dataTransfer.types) != -1) {
          var files = originalEvent.dataTransfer.files;
          if (files.length === 1) {
            var file = files[0];
            var reader = new FileReader();
            reader.onload = (function (theFile) {
              return function (e) {
                $view.importNodes(e.target.result);
              };
            })(file);
            reader.readAsText(file);
          }
        }
        hideDropTarget();
        event.preventDefault();
      });
  }

  protected configEvents() {
    const {
      // services injected
      $menu,
      $events,
    } = this
    const {
      setDisabled
    } = this.rebind([
        'setDisabled'
      ])

    $events.on("$view:selection-changed", function (selection) {
      if (!selection.nodes) {
        $menu.setDisabled("$menu-item-export", true);
        $menu.setDisabled("$menu-item-export-clipboard", true);
        $menu.setDisabled("$menu-item-export-library", true);
      } else {
        $menu.setDisabled("$menu-item-export", false);
        $menu.setDisabled("$menu-item-export-clipboard", false);
        $menu.setDisabled("$menu-item-export-library", false);
      }
    });

    $events.on("editor:open", () => {
      setDisabled()
    });
    $events.on("editor:close", () => {
      setDisabled(false)
    });
    $events.on("search:open", () => {
      setDisabled()
    });
    $events.on("search:close", () => {
      setDisabled(false)
    });
    $events.on("type-search:open", () => {
      setDisabled()
    });
    $events.on("type-search:close", () => {
      setDisabled(false)
    });
  }

  set disabled(value) {
    this.clipboard.disabled = value
  }

  setDisabled(value = true) {
    this.disabled = value
  }
}


