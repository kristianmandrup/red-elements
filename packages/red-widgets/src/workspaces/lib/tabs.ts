import { Workspaces } from './'
import { Context } from '../../context'

import {
  delegates,
  container
} from './container'

interface IDialogForm extends JQuery<HTMLElement> {
  i18n: Function
}

@delegates({
  container,
})

export class WorkspaceTabs extends Context {
  constructor(public workspaces: Workspaces) {
    super()
  }

  /**
  * Create Workspace tabs
  */
  createWorkspaceTabs() {
    let {
      RED,
      activeWorkspace,
      workspace_tabs
    } = this.workspaces

    const {
      showRenameWorkspaceDialog,
      setWorkspaceOrder,
      addWorkspace,
      createTabs,
      setInstanceVars
    } = this.rebind([
        'showRenameWorkspaceDialog',
        'setWorkspaceOrder',
        'addWorkspace',
        'createTabs',
        'setInstanceVars'
      ], this.workspaces)

    // see ui/common/tabs
    workspace_tabs = createTabs({
      id: "workspace-tabs",
      onchange: (tab) => {
        var event = {
          old: activeWorkspace,
          workspace: null
        }
        activeWorkspace = tab.id;
        event.workspace = activeWorkspace;
        // $("#workspace").toggleClass("workspace-disabled",tab.disabled);
        RED.events.emit("workspace:change", event);
        window.location.hash = 'flow/' + tab.id;
        RED.sidebar.config.refresh();
        RED.view.focus();
      },
      onclick: (tab) => {
        RED.view.focus();
      },
      ondblclick: (tab) => {
        if (tab.type != "subflow") {
          showRenameWorkspaceDialog(tab.id);
        } else {
          RED.editor.editSubflow(RED.nodes.subflow(tab.id));
        }
      },
      onadd: (tab) => {
        $('<span class="workspace-disabled-icon"><i class="fa fa-ban"></i> </span>').prependTo("#red-ui-tab-" + (tab.id.replace(".", "-")) + " .red-ui-tab-label");
        if (tab.disabled) {
          $("#red-ui-tab-" + (tab.id.replace(".", "-"))).addClass('workspace-disabled');
        }
        RED.menu.setDisabled("menu-item-workspace-delete", workspace_tabs.count() == 1);
      },
      onremove: (tab) => {
        RED.menu.setDisabled("menu-item-workspace-delete", workspace_tabs.count() == 1);
      },
      onreorder: (oldOrder, newOrder) => {
        RED.history.push({
          t: 'reorder',
          order: oldOrder,
          dirty: RED.nodes.dirty()
        });
        RED.nodes.dirty(true);
        setWorkspaceOrder(newOrder);
      },
      minimumActiveTabWidth: 150,
      scrollable: true,
      addButton: () => {
        addWorkspace();
      }
    });

    setInstanceVars({
      workspace_tabs
    })

    RED.tabs = workspace_tabs
    return this
  }


  get tabs() {
    const {
      workspace_tabs
    } = this.workspaces
    return workspace_tabs.tabs
  }

  get tabIds(): string[] {
    return this.tabs.ids
  }

  /**
   * Detect if workspace has tab with specific id
   * @param id
   */
  hasTabId(id: string) {
    return this.tabIds.indexOf(id) > -1
  }

  /**
   * retrieve workspace Tab at index
   * @param workspaceIndex
   */
  workspaceTabAt(workspaceIndex: number) {
    const { RED } = this
    return $("#workspace-tabs a[title='" + RED._('workspace.defaultName', {
      number: workspaceIndex
    }) + "']")
  }
}
