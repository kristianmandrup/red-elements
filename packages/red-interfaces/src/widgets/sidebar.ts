import {
  IActions,
  ITabs
} from '.'

export interface ISidebar {
  tabs: ITabs
  /**
   * Create new Tabs
   * @param options
   */
  createTabs(options?) //: ITabs

  /**
   * Create new Actions
   * @param options
   */
  createActions(options?) // : IActions

  /**
   * Configure display of sidebar
   */
  configure()

  /**
   * Toggle sidebar open/closed
   * @param state
   */
  toggleSidebar(state: any)

  /**
   * Show sidebar tab
   * @param id { string } Tab id
   */
  showSidebarTab(id?: string)

  /**
   * Test if sidebar contains specific tab
   * @param id { string} Tab id
   */
  containsTab(id: string)

  show(name: string)

  addTab: Function
}
