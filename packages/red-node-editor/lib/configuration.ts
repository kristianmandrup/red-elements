import {
  Tray
} from '../../tray'

import { NodeEditor } from '../'

import {
  container,
  delegateTarget,
  Context,
  $,
  lazyInject,
  $TYPES
} from './_base'

import {
  IActions
} from '../../_interfaces'

const TYPES = $TYPES.all

export interface INodeEditorConfiguration {
  configure()
}

/**
 * NodeEditor configuration
 */
@delegateTarget()
export class NodeEditorConfiguration extends Context {
  @lazyInject(TYPES.actions) $actions: IActions

  constructor(public editor: NodeEditor) {
    super()
  }

  configure() {
    this.configActions()
  }

  protected configActions() {
    const {
      $actions
    } = this

    if (typeof $actions !== 'object') {
      throw new Error('RED.actions must be an Actions object')
    }

    $actions.add("core:confirm-edit-tray", () => {
      $("#node-dialog-ok").click();
      $("#node-config-dialog-ok").click();
    });

    $actions.add("core:cancel-edit-tray", () => {
      $("#node-dialog-cancel").click();
      $("#node-config-dialog-cancel").click();
    });
  }
}
