import { Workspaces } from './'
import {
  Context,
  delegateTarget,
  container
} from './_base'

export interface IWorkspaceDef {
  type: string
  id: string
  disabled: boolean
  info: string
  label: string
}

@delegateTarget()
export class WorkspaceManager extends Context {
  constructor(public workspaces: Workspaces) {
    super()
  }

  protected set activeWorkspace(index: number) {
    this.workspaces.activeWorkspace = index
  }

  protected get count(): number {
    return this.workspaces.count
  }

  // useful for activating last added Workspace
  activateLastWorkspace() {
    this.activeWorkspace = this.count > 0 ? this.count - 1 : 0
  }

  addWorkspace(ws: IWorkspaceDef, skipHistoryEntry?): IWorkspaceDef {
    let {
      RED,
      workspace_tabs,
      workspaceIndex,
    } = this.workspaces

    const {
      workspaceTabAt
    } = this.rebind([
        'workspaceTabAt'
      ])
    if (ws) {
      workspace_tabs.addTab(ws);
      workspace_tabs.resize();
    } else {
      var tabId = RED.nodes.id();
      do {
        workspaceIndex += 1;
      } while (workspaceTabAt(workspaceIndex).length !== 0);

      ws = {
        type: "tab",
        id: tabId,
        disabled: false,
        info: "",
        label: RED._('workspace.defaultName', {
          number: workspaceIndex
        })
      };

      RED.nodes.addWorkspace(ws);
      workspace_tabs.addTab(ws);
      workspace_tabs.activateTab(tabId);
      if (!skipHistoryEntry) {
        RED.history.push({
          t: 'add',
          workspaces: [ws],
          dirty: RED.nodes.dirty()
        });
        RED.nodes.dirty(true);
      }
    }
    RED.view.focus();

    // make it active?
    this.activateLastWorkspace()

    return ws;
  }

  deleteWorkspace(ws: IWorkspaceDef) {
    const {
      RED,
      workspace_tabs
    } = this.workspaces

    const {
      removeWorkspace
    } = this.rebind([
        'removeWorkspace'
      ])

    // abort if no tabs to delete
    if (workspace_tabs.count() === 0) {
      return;
    }
    removeWorkspace(ws);
    var historyEvent = RED.nodes.removeWorkspace(ws.id);
    historyEvent.t = 'delete';
    historyEvent.dirty = RED.nodes.dirty();
    historyEvent.workspaces = [ws];
    RED.history.push(historyEvent);
    RED.nodes.dirty(true);
    RED.sidebar.config.refresh();
    return this
  }

  removeWorkspace(ws: IWorkspaceDef) {
    const {
      RED,
      workspaces,
      rebind
    } = this
    const {
      activeWorkspace,
      workspace_tabs
    } = workspaces
    const {
      hasTabId,
      deleteWorkspace,
      logWarning
    } = this.rebind([
        'hasTabId',
        'deleteWorkspace',
        'logWarning'
      ], workspaces)

    const id = ws
    if (!ws) {
      deleteWorkspace(RED.nodes.workspace(activeWorkspace));
    } else {
      if (hasTabId(id)) {
        workspace_tabs.removeTab(id);
      } else {
        logWarning(`removeWorkspace: tab with id ${id} not found`)
      }
    }
    return this
  }

  setWorkspaceOrder(order: any[]) {
    const {
      RED,
      workspace_tabs
    } = this.workspaces

    RED.nodes.setWorkspaceOrder(order.filter(function (id) {
      return RED.nodes.workspace(id) !== undefined;
    }));
    workspace_tabs.order(order);
    return this
  }
}
