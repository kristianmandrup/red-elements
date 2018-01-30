import { Workspaces } from './'
import { Context } from '../../context'

import {
  delegates,
  container
} from './container'

@delegates({
  container,
})


export class WorkspacesDisplay extends Context {
  constructor(public workspaces: Workspaces) {
    super()
  }

  /**
   * Shows workspace tabs with given id
   * also activates it via activateTab
   * @param id
   */
  show(id: string) {
    const {
      RED,
      workspace_tabs
    } = this.workspaces

    const {
      addWorkspace,
      hasTab
    } = this.rebind([
        'addWorkspace',
        'hasTab'
      ], this.workspaces)

    // if we don't have the tab try to add it as a subflow
    if (!hasTab(id)) {
      var sf = RED.nodes.subflow(id);

      if (!sf) return
      addWorkspace({
        type: "subflow",
        id: id,
        icon: "red/images/subflow_tab.png",
        label: sf.name,
        closeable: true
      });
    }
    workspace_tabs.activateTab(id);
    return this
  }

  /**
   * Refresh workspace display
   */
  refresh() {
    const {
      RED,
      workspace_tabs
    } = this.workspaces

    RED.nodes.eachWorkspace(function (ws) {
      workspace_tabs.renameTab(ws.id, ws.label);

    })
    RED.nodes.eachSubflow(function (sf) {
      if (workspace_tabs.contains(sf.id)) {
        workspace_tabs.renameTab(sf.id, sf.name);
      }
    });
    RED.sidebar.config.refresh();
    return this
  }

  /**
   * Resize workspace display
   */
  resize() {
    this.workspaces.workspace_tabs.resize();
    return this
  }
}
