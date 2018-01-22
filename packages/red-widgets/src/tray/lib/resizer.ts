
import { Tray } from './'
import { Context } from '../../context'

export class TrayResizer extends Context {
  constructor(public tray: Tray) {
    super()
  }

  /**
   * Resize
   */
  resize() { }

  /**
   * handle Window Resize
   */
  handleWindowResize() {
    let {
      stack
    } = this.tray

    if (stack.length > 0) {
      var tray = stack[stack.length - 1];
      var trayHeight = tray.tray.height() - tray.header.outerHeight() - tray.footer.outerHeight();
      tray.body.height(trayHeight);
      if (tray.options.maximized || tray.width > $("#editor-stack").position().left - 8) {
        tray.width = $("#editor-stack").position().left - 8;
        tray.tray.width(tray.width);
        // tray.body.parent().width(tray.width);
      } else if (tray.width < tray.preferredWidth) {
        tray.width = Math.min($("#editor-stack").position().left - 8, tray.preferredWidth);
        tray.tray.width(tray.width);
        // tray.body.parent().width(tray.width);
      }
      if (tray.options.resize) {
        tray.options.resize({
          width: tray.width,
          height: trayHeight
        });
      }
    }
  }
}
