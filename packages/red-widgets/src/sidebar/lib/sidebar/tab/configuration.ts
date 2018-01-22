import { Sidebar } from '../'
import {
  SidebarTab
} from '.'
import { Tabs, Context, $ } from '../../../../common'

export class SidebarTabConfiguration extends Context {
  sidebar_tabs: any

  constructor(public sidebarTab: SidebarTab) {
    super()
  }

  configure() {
    const { RED } = this
    var content = document.createElement("div");
    this.content = content
    content.className = "sidebar-node-config";

    $('<div class="button-group sidebar-header">' +
      '<a class="sidebar-header-button-toggle selected" id="workspace-config-node-filter-all" href="#"><span data-i18n="sidebar.config.filterAll"></span></a>' +
      '<a class="sidebar-header-button-toggle" id="workspace-config-node-filter-unused" href="#"><span data-i18n="sidebar.config.filterUnused"></span></a> ' +
      '</div>'
    ).appendTo(content);


    this.toolbar = $('<div>' +
      '<a class="sidebar-footer-button" id="workspace-config-node-collapse-all" href="#"><i class="fa fa-angle-double-up"></i></a> ' +
      '<a class="sidebar-footer-button" id="workspace-config-node-expand-all" href="#"><i class="fa fa-angle-double-down"></i></a>' +
      '</div>');

    this.globalCategories = $("<div/>").appendTo(content);
    this.flowCategories = $("<div/>").appendTo(content);
    this.subflowCategories = $("<div/>").appendTo(content);

    this.showUnusedOnly = false;

    this.categories = {};

    this.i18n = new I18n()
  }
}
