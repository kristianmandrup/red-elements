import { Workspaces } from './'
import { Context } from '../../context'

import {
  delegates,
  container
} from './container'

@delegates({
  container,
})

export class WorkspacesConfiguration extends Context {
  protected allSettings = {}

  constructor(public workspaces: Workspaces) {
    super()
  }

  configure() {
    const {
      RED
    } = this.workspaces

    let {
      workspace_tabs,
      activeWorkspace
    } = this.workspaces

    const {
      addWorkspace,
      editWorkspace,
      removeWorkspace,
      deleteWorkspace
    } = this.rebind([
        'addWorkspace',
        'editWorkspace',
        'removeWorkspace',
        'deleteWorkspace',
        'createWorkspaceTabs'
      ], this.workspaces)

    if (typeof workspace_tabs !== 'object') {
      this.handleError('createWorkspaceTabs needs to create workspace_tabs', {
        workspace_tabs
      })
    }

    RED.events.on("sidebar:resize", workspace_tabs.resize);

    RED.actions.add("core:show-next-tab", workspace_tabs.nextTab);
    RED.actions.add("core:show-previous-tab", workspace_tabs.previousTab);

    RED.menu.setAction('menu-item-workspace-delete', function () {
      deleteWorkspace(RED.nodes.workspace(activeWorkspace));
    });

    $(window).resize(() => {
      workspace_tabs.resize();
    });

    RED.actions.add("core:add-flow", addWorkspace);
    RED.actions.add("core:edit-flow", editWorkspace);
    RED.actions.add("core:remove-flow", removeWorkspace);
  }
}
