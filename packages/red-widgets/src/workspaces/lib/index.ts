/**
 * Copyright JS Foundation and other contributors, http:js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http:www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
import {
  Context
} from '../../context'

import {
  Tabs
} from '../../common'


import { WorkspacesConfiguration } from './configuration';
import { WorkspaceManager, IWorkspaceDef } from './workspace-manager';
import { WorkspaceEditDialog } from './edit-dialog';
import { WorkspaceTabs } from './tabs';
import { WorkspacesDisplay } from './display';

const { log } = console

export class Workspaces extends Context {
  static createTabs(options) {
    return new Tabs(options)
  }

  public activeWorkspace: number = 0
  public workspaceIndex: number = 0
  public workspace_tabs: any  //TODO: Array<Tab> ??

  protected configuration: WorkspacesConfiguration = new WorkspacesConfiguration(this)
  protected manager: WorkspaceManager = new WorkspaceManager(this)
  protected editDialog: WorkspaceEditDialog = new WorkspaceEditDialog(this)
  protected workspaceTabs: WorkspaceTabs = new WorkspaceTabs(this)
  protected workspacesDisplay: WorkspacesDisplay = new WorkspacesDisplay(this)

  constructor() {
    super()
    this.createWorkspaceTabs();
    this.configure()
  }

  /**
   * Configure workspaces
   */
  configure() {
    this.configuration.configure()

    return this
  }

  /**
   * activate Last Workspace
   */
  activateLastWorkspace() {
    return this.manager.activateLastWorkspace()
  }

  /**
   * add Workspace
   * @param ws
   * @param skipHistoryEntry
   */
  addWorkspace(ws: IWorkspaceDef, skipHistoryEntry?: boolean): IWorkspaceDef {
    return this.manager.addWorkspace(ws, skipHistoryEntry)
  }

  /**
   * delete Workspace
   * @param ws
   */
  deleteWorkspace(ws: IWorkspaceDef) {
    return this.manager.deleteWorkspace(ws)

  }

  /**
   * remove Workspace
   * @param ws
   */
  removeWorkspace(ws: IWorkspaceDef) {
    return this.manager.removeWorkspace(ws)

  }

  /**
   * set Workspace Order
   * @param order
   */
  setWorkspaceOrder(order: any[]) {
    return this.manager.setWorkspaceOrder(order)

  }

  /**
   * show rename Workspace Dialog
   * @param id
   */
  showRenameWorkspaceDialog(id: string | number) {
    this.editDialog.showRenameWorkspaceDialog(id)

  }

  /**
   * create Workspace Tabs
   */
  createWorkspaceTabs() {
    this.workspaceTabs.createWorkspaceTabs()

  }

  /**
   * Get tabs
   */
  get tabs() {
    return this.workspaceTabs.tabs

  }

  /**
   * Get all tab ids
   */
  get tabIds(): string[] {
    return this.workspaceTabs.tabIds

  }

  /**
   * Detect if workspace has tab with specific id
   * @param id
   */
  hasTabId(id: string) {
    return this.workspaceTabs.hasTabId(id)

  }

  /**
   * retrieve workspace Tab at index
   * @param workspaceIndex
   */
  workspaceTabAt(workspaceIndex: number) {
    return this.workspaceTabs.workspaceTabAt(workspaceIndex)

  }

  /**
   * Edit workspace by displaying dialog to rename
   * @param id
   */
  editWorkspace(id?: string) {
    let {
      activeWorkspace
    } = this
    this.showRenameWorkspaceDialog(id || activeWorkspace);

    return this
  }

  /**
   * Test if contains tab with specific id (alias to hasTabId)
   * @param id
   */
  contains(id) {
    return this.hasTabId(id);

  }

  /**
   * Get number of workspace tabs
   */
  get count(): number {
    return this.workspace_tabs.count();

  }

  /**
   * Get active workspace
   */
  get active() {
    return this.activeWorkspace

  }

  /**
   * Shows workspace tabs with given id
   * also activates it via activateTab
   * @param id
   */
  show(id: string) {
    this.workspacesDisplay.show(id)

  }

  /**
   * Refresh workspace display
   */
  refresh() {
    this.workspacesDisplay.refresh()

  }

  /**
   * Resize workspace display
   */
  resize() {
    this.workspacesDisplay.refresh()
  }
}
