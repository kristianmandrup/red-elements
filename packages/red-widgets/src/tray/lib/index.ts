/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
import {
  Context,
  $
} from '../../common'
import { TrayConfiguration } from './configuration';
import { TrayResizer } from './resizer';
import { TrayDisplayer } from './display';

const { log } = console

export class Tray extends Context {
  stack: any = []
  editorStack: any = $("#editor-stack")
  openingTray: boolean = false

  resizer: TrayResizer = new TrayResizer(this)
  display: TrayDisplayer = new TrayDisplayer(this)

  protected configuration: TrayConfiguration = new TrayConfiguration(this)
  
  constructor() {
    super()
    this.configure()
  }

  /**
   * Configure Tray
   */
  configure() {
    this.configuration.configure()
    return this
  }

  show(options) {
    this.display.show(options)
  }

  handleWindowResize() {
    this.resizer.handleWindowResize()
  }

  async close() {
    let { stack } = this
    if (stack.length > 0) {
      var tray = stack.pop();
      tray.tray.css({
        right: -(tray.tray.width() + 10) + "px"
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (tray.options.close) {
            tray.options.close();
          }
          tray.tray.remove();
          if (stack.length > 0) {
            var oldTray = stack[stack.length - 1];
            oldTray.tray.appendTo("#editor-stack");
            setTimeout(() => {
              this.handleWindowResize();
              oldTray.tray.css({
                right: 0
              });
              if (oldTray.options.show) {
                oldTray.options.show();
              }
            }, 0);
          }
          resolve(true)

          if (stack.length === 0) {
            $("#header-shade").hide();
            $("#editor-shade").hide();
            $("#palette-shade").hide();
            $(".sidebar-shade").hide();
            this.RED.events.emit("editor:close");
            this.RED.view.focus();
          }
        }, 250)
      })
    }
  }
}
