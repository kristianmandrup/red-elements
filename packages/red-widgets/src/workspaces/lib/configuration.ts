import { Workspaces } from './'

import {
  Context,
  delegateTarget,
  container
} from './_base'

import {
  lazyInject,
  $TYPES
} from '../../_container'


import {
  INode,
  IEvents,
  IActions,
  IMenu
} from '../../_interfaces'

const TYPES = $TYPES.all

@delegateTarget()
export class WorkspacesConfiguration extends Context {
  @lazyInject(TYPES.actions) actions: IActions
  @lazyInject(TYPES.events) events: IEvents
  @lazyInject(TYPES.common.menu) menu: IMenu
  @lazyInject(TYPES.nodes) nodes: INode

  protected allSettings = {}

  constructor(public workspaces: Workspaces) {
    super()
  }

  configure() {
    const {
      actions,
      events,
      menu,
      nodes
    } = this


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

    events.on("sidebar:resize", workspace_tabs.resize);

    actions.add("core:show-next-tab", workspace_tabs.nextTab);
    actions.add("core:show-previous-tab", workspace_tabs.previousTab);

    menu.setAction('menu-item-workspace-delete', function () {
      deleteWorkspace(nodes.workspace(activeWorkspace));
    });

    $(window).resize(() => {
      workspace_tabs.resize();
    });

    actions.add("core:add-flow", addWorkspace);
    actions.add("core:edit-flow", editWorkspace);
    actions.add("core:remove-flow", removeWorkspace);
  }
}
