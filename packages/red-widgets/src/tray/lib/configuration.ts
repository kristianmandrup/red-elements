import { Tray } from './'
import { Context } from '../../context'

export class TrayConfiguration extends Context {
  constructor(public tray: Tray) {
    super()
  }

  configure() {
    const {
      RED,
      openingTray,
      stack
    } = this.tray
    const {
      handleWindowResize
    } = this.rebind([
        'handleWindowResize'
      ])

    $(window).resize(handleWindowResize);
    RED.events.on("sidebar:resize", handleWindowResize);
    $("#editor-shade").click(() => {
      if (!openingTray) {
        var tray = stack[stack.length - 1];
        if (tray && tray.primaryButton) {
          tray.primaryButton.click();
        }
      }
    });
  }
}
