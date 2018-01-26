import { Sidebar } from '../'
import {
  SidebarTab
} from '.'
import { Tabs, Context, $ } from '../../../../common'
import { I18n } from '@tecla5/red-runtime';

export class SidebarTabConfiguration extends Context {
  sidebar_tabs: any

  constructor(public sidebarTab: SidebarTab) {
    super()
  }

  get sidebar() {
    return this.sidebarTab.sidebar
  }

  configure() {
    const { RED } = this
    let {
      toolbar,
      globalCategories,
      flowCategories,
      subflowCategories,
      showUnusedOnly,
      categories,
      i18n
    } = this.sidebarTab
    const content = document.createElement("div");
    content.className = "sidebar-node-config";

    this.addSidebarHeader(content)
    toolbar = this.buildToolbar()

    globalCategories = this.appendDiv(content)
    flowCategories = this.appendDiv(content)
    subflowCategories = this.appendDiv(content)

    this.setInstanceVars({
      toolbar,
      globalCategories,
      flowCategories,
      subflowCategories
    }, this.sidebarTab)
  }

  // protected

  protected appendDiv(content) {
    return $("<div/>").appendTo(content);
  }

  protected addSidebarHeader(content) {
    $('<div class="button-group sidebar-header">' +
      '<a class="sidebar-header-button-toggle selected" id="workspace-config-node-filter-all" href="#"><span data-i18n="sidebar.config.filterAll"></span></a>' +
      '<a class="sidebar-header-button-toggle" id="workspace-config-node-filter-unused" href="#"><span data-i18n="sidebar.config.filterUnused"></span></a> ' +
      '</div>'
    ).appendTo(content);
  }

  protected buildToolbar() {
    return $('<div>' +
      '<a class="sidebar-footer-button" id="workspace-config-node-collapse-all" href="#"><i class="fa fa-angle-double-up"></i></a> ' +
      '<a class="sidebar-footer-button" id="workspace-config-node-expand-all" href="#"><i class="fa fa-angle-double-down"></i></a>' +
      '</div>');
  }
}
