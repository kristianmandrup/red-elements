import { IWorkspaceDef } from './workspace-manager';

export interface IWorkspaces {
  add(ws: IWorkspaceDef, skipHistoryEntry?: boolean) // alias
  remove(ws: IWorkspaceDef) // alias

  configure()
  /**
   * activate Last Workspace
   */
  activateLastWorkspace()

  /**
   * add Workspace
   * @param ws
   * @param skipHistoryEntry
   */
  addWorkspace?(ws: IWorkspaceDef, skipHistoryEntry?: boolean)

  /**
   * delete Workspace
   * @param ws
   */
  deleteWorkspace(ws: IWorkspaceDef)

  /**
   * remove Workspace
   * @param ws
   */
  removeWorkspace(ws: IWorkspaceDef)

  /**
   * set Workspace Order
   * @param order
   */
  setWorkspaceOrder(order: any[])

  /**
   * show rename Workspace Dialog
   * @param id
   */
  showRenameWorkspaceDialog(id: string | number)

  /**
   * create Workspace Tabs
   */
  createWorkspaceTabs()

  /**
   * Get tabs
   */
  tabs(): any[]

  /**
   * Get all tab ids
   */
  tabIds: string[]

  /**
   * Detect if workspace has tab with specific id
   * @param id
   */
  hasTabId(id: string)

  /**
   * retrieve workspace Tab at index
   * @param workspaceIndex
   */
  workspaceTabAt(workspaceIndex: number)

  /**
   * Edit workspace by displaying dialog to rename
   * @param id
   */
  editWorkspace(id?: string)

  /**
   * Test if contains tab with specific id (alias to hasTabId)
   * @param id
   */
  contains(id)

  /**
   * Get number of workspace tabs
   */
  count: number

  /**
   * Get active workspace
   */
  active: string

  /**
   * Shows workspace tabs with given id
   * also activates it via activateTab
   * @param id
   */
  show(id: string)

  /**
   * Refresh workspace display
   */
  refresh()

  /**
   * Resize workspace display
   */
  resize()
}
