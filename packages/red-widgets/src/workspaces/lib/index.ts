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
  Tabs
} from '../../common'


import { WorkspacesConfiguration } from './configuration';
import { WorkspaceManager, IWorkspaceDef } from './workspace-manager';
import { WorkspaceEditDialog } from './edit-dialog';
import { WorkspaceTabs } from './tabs';
import { WorkspacesDisplay } from './display';
import {
  Context,
  container,
  delegator,
  delegateTo,
  log
} from './_base'

import {
  IWorkspaces
} from './interface'

/**
 * Workspaces are used to group a set of flows
 */
@delegator({
  container,
  map: {
    configuration: WorkspacesConfiguration,
    manager: WorkspaceManager,
    editDialog: WorkspaceEditDialog,
    workspaceTabs: WorkspaceTabs,
    workspacesDisplay: WorkspacesDisplay
  }
})
export class Workspaces extends Context {
  static createTabs(options) {
    return new Tabs(options)
  }

  public activeWorkspace: string
  public workspaceIndex: number = 0
  public workspace_tabs: any  //TODO: Array<Tab> ??

  protected configuration: WorkspacesConfiguration // = new WorkspacesConfiguration(this)
  protected manager: WorkspaceManager // = new WorkspaceManager(this)
  protected editDialog: WorkspaceEditDialog // = new WorkspaceEditDialog(this)
  protected workspaceTabs: WorkspaceTabs // = new WorkspaceTabs(this)
  protected workspacesDisplay: WorkspacesDisplay // = new WorkspacesDisplay(this)

  constructor() {
    super()
    this.createWorkspaceTabs();
    this.configure()
  }

  /**
   * Configure workspaces
   */
  @delegateTo('configuration')
  configure() {
    // this.configuration.configure()
    // return this
  }

  /**
   * activate Last Workspace
   */
  @delegateTo('manager')
  activateLastWorkspace() {
    // return this.manager.activateLastWorkspace()
  }

  // alias
  add(ws: IWorkspaceDef, skipHistoryEntry?: boolean): any {
    return this.addWorkspace(ws, skipHistoryEntry)
  }

  // alias
  remove(ws: IWorkspaceDef) {
    return this.removeWorkspace(ws)
  }

  /**
   * add Workspace
   * @param ws
   * @param skipHistoryEntry
   */
  @delegateTo('manager')
  addWorkspace(ws: IWorkspaceDef, skipHistoryEntry?: boolean): any {
    // return this.manager.addWorkspace(ws, skipHistoryEntry)
  }

  /**
   * delete Workspace
   * @param ws
   */
  @delegateTo('manager')
  deleteWorkspace(ws: IWorkspaceDef) {
    // return this.manager.deleteWorkspace(ws)
  }

  /**
   * remove Workspace
   * @param ws
   */
  @delegateTo('manager')
  removeWorkspace(ws: IWorkspaceDef) {
    // return this.manager.removeWorkspace(ws)
  }

  /**
   * set Workspace Order
   * @param order
   */
  @delegateTo('manager')
  setWorkspaceOrder(order: any[]) {
    // return this.manager.setWorkspaceOrder(order)
  }

  /**
   * show rename Workspace Dialog
   * @param id
   */
  @delegateTo('editDialog')
  showRenameWorkspaceDialog(id: string | number) {
    // this.editDialog.showRenameWorkspaceDialog(id)
  }

  /**
   * create Workspace Tabs
   */
  @delegateTo('workspaceTabs')
  createWorkspaceTabs() {
    // this.workspaceTabs.createWorkspaceTabs()
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
  @delegateTo('workspaceTabs')
  hasTabId(id: string) {
    // return this.workspaceTabs.hasTabId(id)
  }

  /**
   * retrieve workspace Tab at index
   * @param workspaceIndex
   */
  @delegateTo('workspaceTabs')
  workspaceTabAt(workspaceIndex: number) {
    // return this.workspaceTabs.workspaceTabAt(workspaceIndex)
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
  get active(): string {
    return this.activeWorkspace
  }

  /**
   * Shows workspace tabs with given id
   * also activates it via activateTab
   * @param id
   */
  @delegateTo('workspacesDisplay')
  show(id: string) {
    // this.workspacesDisplay.show(id)
  }

  /**
   * Refresh workspace display
   */
  @delegateTo('workspacesDisplay')
  refresh() {
    // this.workspacesDisplay.refresh()
  }

  /**
   * Resize workspace display
   */
  @delegateTo('workspacesDisplay')
  resize() {
    this.workspacesDisplay.resize()
  }
}
