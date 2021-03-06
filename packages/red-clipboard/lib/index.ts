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
import { ClipboardConfiguration } from './configuration';
import { ClipboardDialogs } from './dialogs';
import {
  ClipboardNodesImporter,
  ClipboardNodesExporter
} from './nodes';

interface IButton extends JQuery<HTMLElement> {
  button: Function
}

import {
  Context,
  $,
  $TYPES,
  lazyInject,
  delegator,
  delegateTo
} from './_base'

const { log } = console

import {
  IClipboard
} from './interface'
import { II18n } from '../../../../red-runtime/src/i18n/interface';

const TYPES = $TYPES.all

/**
 * Clipboard for copy/paste operations
 */
@delegator({
  map: {
    configuration: ClipboardConfiguration,
    dialogs: ClipboardDialogs,
    nodesExporter: ClipboardNodesExporter,
    nodesImporter: ClipboardNodesImporter
  }
})
export class Clipboard extends Context implements IClipboard {
  public disabled: Boolean
  public dialog: any // JQuery<HTMLElement>
  public dialogContainer: any
  public exportNodesDialog: any
  public importNodesDialog: any

  protected configuration: ClipboardConfiguration //= new ClipboardConfiguration(this)
  protected dialogs: ClipboardDialogs //= new ClipboardDialogs(this)
  protected nodesExporter: ClipboardNodesExporter //= new ClipboardNodesExporter(this)
  protected nodesImporter: ClipboardNodesImporter //= new ClipboardNodesImporter(this)

  @lazyInject(TYPES.keyboard) $keyboard: IKeyboard
  @lazyInject(TYPES.common.popover) $popover: IPopover
  @lazyInject(TYPES.i18n) $i18n: II18n

  constructor() {
    super()
    this.configure()
  }

  // UI

  // TODO: move to display
  get $dropTarget() {
    return $("#dropTarget")
  }

  /**
   * Configure Clipboard
   */
  configure() {
    this.configuration.configure()
    return this
  }

  /**
   * setup Dialogs
   */
  setupDialogs() {
    return this.dialogs.setupDialogs()
  }

  /**
   * export Nodes
   */
  exportNodes(clipboard) {
    return this.nodesExporter.exportNodes(clipboard)
  }

  /**
   * import Nodes
   */
  importNodes() {
    return this.nodesImporter.importNodes()
  }

  /**
   * validate Dialog Container
   */
  validateDialogContainer() {
    const {
      dialogContainer
    } = this
    const {
      setupDialogs,
      handleError
    } = this.rebind([
        'setupDialogs',
        'handleError'
      ])

    if (!dialogContainer) {
      setupDialogs()
    }
    // test if still not defined
    if (!dialogContainer) {
      handleError('importNodes: missing dialogContainer', {
        clipboard: this
      })
    }
  }

  /**
   * hide Drop Target
   */
  hideDropTarget() {
    const {
      $dropTarget,

      // injected services
      $keyboard
    } = this
    $dropTarget.hide();
    $keyboard.remove("escape");
  }

  /**
   * copy text to clipboard
   * @param value
   * @param element
   * @param msg
   */
  copyText(value: any, element, msg: string) {
    const {
      $popover,
      $i18n
    } = this

    var truncated = false;
    if (typeof value !== "string") {
      value = JSON.stringify(value, function (key, value) {
        if (value !== null && typeof value === 'object') {
          if (value.__encoded__ && value.hasOwnProperty('data') && value.hasOwnProperty('length')) {
            truncated = value.data.length !== value.length;
            return value.data;
          }
        }
        return value;
      });
    }
    if (truncated) {
      msg += "_truncated";
    }
    $("#clipboard-hidden").val(value).select();
    var result = document.execCommand("copy");
    if (result && element) {
      var popover = $popover.create({
        target: element,
        direction: 'left',
        size: 'small',
        content: $i18n.t(msg)
      });

      this._validateObj(popover, 'popover', 'copyText')

      setTimeout(function () {
        popover.close();
      }, 1000);
      popover.open();
    }
    return result;
  }
}
