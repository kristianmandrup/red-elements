import { Sidebar } from '../'
import {
  SidebarTab
} from '.'

interface I18nWidget extends JQuery<HTMLElement> {
  i18n: Function
}

import {
  I18n,
  Context,
  $,
  Tabs,
  container,
  delegateTarget
} from '../_base'

import {
  lazyInject,
  $TYPES
} from '../../../../_container'

import {
  ISidebar,
  IActions
} from '../../../../_interfaces'

const TYPES = $TYPES.all

@delegateTarget()
export class SidebarTabInitializer extends Context {
  @lazyInject(TYPES.sidebar) sidebar: ISidebar
  @lazyInject(TYPES.actions) actions: IActions

  
  constructor(public sidebarTab: SidebarTab) {
    super()

  }

  public content: HTMLElement;
  public toolbar: JQuery<HTMLElement>
  protected i18n: I18n

  public categories: Object
  public globalCategories: JQuery<HTMLElement>
  public flowCategories: JQuery<HTMLElement>
  public subflowCategories: JQuery<HTMLElement>

  // only called after i18n is initialized
  async init() {
    const {
      RED,
      categories,
      sidebar,
      actions
    } = this

    let {
      showUnusedOnly
    } = this.sidebarTab

    const {
      refreshConfigNodeList
  } = this.rebind([
        'refreshConfigNodeList'
      ])

    // FIX: when i18n is initialized (translation map loaded), we can continue constructor in init
    await this.i18n.init()

    sidebar.addTab({
      id: "config",
      label: RED._("sidebar.config.label"),
      name: RED._("sidebar.config.name"),
      content: this.content,
      toolbar: this.toolbar,
      closeable: true,
      visible: false,
      onchange: function () {
        refreshConfigNodeList();
      }
    });
    actions.add("core:show-config-tab", () => {
      sidebar.show('config')
    });

    this.collapseAll.on("click", (e) => {
      e.preventDefault();
      for (var cat in categories) {
        if (categories.hasOwnProperty(cat)) {
          categories[cat].close();
        }
      }
    });
    this.expandAll.on("click", (e) => {
      e.preventDefault();
      for (var cat in categories) {
        if (categories.hasOwnProperty(cat)) {
          if (categories[cat].size() > 0) {
            categories[cat].open();
          }
        }
      }
    });
    this.filterAll.on("click", (e) => {
      e.preventDefault();
      if (showUnusedOnly) {
        $(this).addClass('selected');
        this.filterUnused.removeClass('selected');
        showUnusedOnly = !showUnusedOnly;
        refreshConfigNodeList();
      }
    });
    this.filterUnused.on("click", (e) => {
      e.preventDefault();
      if (!showUnusedOnly) {
        $(this).addClass('selected');
        this.filterAll.removeClass('selected');
        showUnusedOnly = !showUnusedOnly;
        refreshConfigNodeList();
      }
    });
  }

  // protected

  protected get collapseAll() {
    return $("#workspace-config-node-collapse-all")
  }

  protected get expandAll() {
    return $("#workspace-config-node-expand-all")
  }

  protected get filterAll() {
    return $('#workspace-config-node-filter-all')
  }

  protected get filterUnused() {
    return $('#workspace-config-node-filter-unused')
  }
}
