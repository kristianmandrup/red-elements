
import { Tray } from './'
import { Context } from '../../context'

import {
  delegates,
  container
} from './container'

@delegates({
  container,
})

export class TrayDisplayer extends Context {
  constructor(public tray: Tray) {
    super()
  }

  show(options) {
    const {
      tray,
      rebind
    } = this
    const {
      showTray,
    } = rebind([
        'showTray'
      ], tray)

    const {
      stack,
      editorStack
    } = tray

    if (stack.length > 0) {
      var oldTray = stack[stack.length - 1];
      oldTray.tray.css({
        right: -(oldTray.tray.width() + 10) + "px"
      });
      setTimeout(() => {
        oldTray.tray.detach();
        this.showTray(options);
      }, 250)
    } else {
      this.RED.events.emit("editor:open");
      this.showTray(options);
    }
  }

  protected showTray(options) {
    const {
      stack,
      editorStack,
    } = this.tray

    let {
      openingTray
    } = this.tray

    const {
      handleWindowResize
    } = this.rebind([
        'handleWindowResize'
      ], this.tray)

    let editor;
    const el = <any>$('<div class="editor-tray"></div>');
    const header = this.addHeader(el);
    const bodyWrapper = this.addBodyWrapper(el)
    const body = this.addBody(bodyWrapper);
    const footer = this.addFooter(el);
    const resizer = this.addResizeHandle(el);
    // var growButton = $('<a class="editor-tray-resize-button" style="cursor: w-resize;"><i class="fa fa-angle-left"></i></a>').appendTo(resizer);
    // var shrinkButton = $('<a class="editor-tray-resize-button" style="cursor: e-resize;"><i style="margin-left: 1px;" class="fa fa-angle-right"></i></a>').appendTo(resizer);
    if (options.title) {
      this.addTrayTitle(options.title, header)
    }
    if (options.width === Infinity) {
      options.maximized = true;
      resizer.addClass('editor-tray-resize-maximised');
    }
    var buttonBar = this.addTrayToolbar(header)
    var primaryButton;
    if (options.buttons) {
      for (var i = 0; i < options.buttons.length; i++) {
        var button = options.buttons[i];
        var b = (<any>$('<button>')).button().appendTo(buttonBar);
        if (button.id) {
          b.attr('id', button.id);
        }
        if (button.text) {
          b.html(button.text);
        }
        if (button.click) {
          b.click(((action) => {
            return (evt) => {
              if (!$(this).hasClass('disabled')) {
                action(evt);
              }
            };
          })(button.click));
        }
        if (button.class) {
          b.addClass(button.class);
          if (button.class === "primary") {
            primaryButton = button;
          }
        }
      }
    }
    el.appendTo(editorStack);
    var tray = {
      tray: el,
      header: header,
      body: body,
      footer: footer,
      options: options,
      primaryButton: primaryButton,
      preferredWidth: 0,
      width: 0
    };

    stack.push(tray);

    if (!options.maximized) {
      el.draggable({
        handle: resizer,
        axis: "x",
        start: function (event, ui) {
          el.width('auto');
        },
        drag: function (event, ui) {
          var absolutePosition = editorStack.position().left + ui.position.left
          if (absolutePosition < 7) {
            ui.position.left += 7 - absolutePosition;
          } else if (ui.position.left > -tray.preferredWidth - 1) {
            ui.position.left = -Math.min(editorStack.position().left - 7, tray.preferredWidth - 1);
          }
          if (tray.options.resize) {
            setTimeout(function () {
              tray.options.resize({
                width: -ui.position.left
              });
            }, 0);
          }
          tray.width = -ui.position.left;
        },
        stop: function (event, ui) {
          el.width(-ui.position.left);
          el.css({
            left: ''
          });
          if (tray.options.resize) {
            tray.options.resize({
              width: -ui.position.left
            });
          }
          tray.width = -ui.position.left;
        }
      });
    }

    let finishBuild = () => {
      this.headerShade.show();
      this.editorShade.show();
      this.paletteShade.show();
      this.sidebarShade.show();

      tray.preferredWidth = Math.max(el.width(), 500);
      body.css({
        "minWidth": tray.preferredWidth - 40
      });
      // TODO: should be general utility function to select and validate is found
      let editorStack = $('#editor-stack')
      if (editorStack.length < 1) {
        this.handleError('#editor-stack element not found', {
          editorStack
        })
      }
      let stackPos = editorStack.position()
      if (options.width) {
        if (options.width > stackPos.left - 8) {
          options.width = stackPos.left - 8;
        }
        el.width(options.width);
      } else {
        el.width(tray.preferredWidth);
      }

      tray.width = el.width();
      if (tray.width > $("#editor-stack").position().left - 8) {
        tray.width = Math.max(0 /*tray.preferredWidth*/, $("#editor-stack").position().left - 8);
        el.width(tray.width);
      }

      // tray.body.parent().width(Math.min($("#editor-stack").position().left-8,tray.width));

      el.css({
        right: -(el.width() + 10) + "px",
        transition: "right 0.25s ease"
      });
      this.workspace.scrollLeft(0);
      handleWindowResize();
      openingTray = true;
      setTimeout(function () {
        setTimeout(function () {
          if (!options.width) {
            el.width(Math.min(tray.preferredWidth, this.editorStack.position().left - 8));
          }
          if (options.resize) {
            options.resize({
              width: el.width()
            });
          }
          if (options.show) {
            options.show();
          }
          setTimeout(function () {
            // Delay resetting the flag, so we don't close prematurely
            openingTray = false;
          }, 200);
          body.find(":focusable:first").focus();

        }, 150);
        el.css({
          right: 0
        });
      }, 0);
    }

    this.setInstanceVars({
      openingTray
    }, tray)

    if (options.open) {
      if (options.open.length === 1) {
        options.open(el);
        finishBuild();
      } else {
        options.open(el, finishBuild);
      }
    } else {
      finishBuild();
    }
  }

  // protected

  get editorStack() {
    return $("#editor-stack")
  }

  get workspace() {
    return $("#workspace")
  }

  get headerShade() {
    return $("#header-shade")
  }
  get editorShade() {
    return $("#editor-shade")
  }
  get paletteShade() {
    return $("#palette-shade")
  }
  get sidebarShade() {
    return $(".sidebar-shade")
  }

  addHeader(el) {
    return $('<div class="editor-tray-header"></div>').appendTo(el);
  }

  addBodyWrapper(el) {
    return $('<div class="editor-tray-header"></div>').appendTo(el);
  }

  addBody(el) {
    return $('<div class="editor-tray-body"></div>').appendTo(el);
  }

  addFooter(el) {
    return $('<div class="editor-tray-footer"></div>').appendTo(el);
  }

  addResizeHandle(el) {
    return $('<div class="editor-tray-resize-handle"></div>').appendTo(el);
  }

  addTrayTitle(title, header) {
    $('<div class="editor-tray-titlebar">' + title + '</div>').appendTo(header);
  }

  addTrayToolbar(header) {
    $('<div class="editor-tray-toolbar"></div>').appendTo(header);
  }
}

