import {
  Tray
} from '../../../tray'

import { NodeEditor } from '../'

import { Context, $ } from '../../../common'

export class NodeEditorConfiguration extends Context {
  constructor(public editor: NodeEditor) {
    super()
  }

  configure() {
    const { RED } = this

    // fix: use class
    RED.tray = new Tray();

    if (typeof RED.actions !== 'object') {
      throw new Error('RED.actions must be an Actions object')
    }

    RED.actions.add("core:confirm-edit-tray", () => {
      $("#node-dialog-ok").click();
      $("#node-config-dialog-ok").click();
    });
    RED.actions.add("core:cancel-edit-tray", () => {
      $("#node-dialog-cancel").click();
      $("#node-config-dialog-cancel").click();
    });
  }
}
