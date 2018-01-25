import { Sidebar } from '../'
import {
  SidebarTab
} from '.'
import { Tabs, Context, $ } from '../../../../common'


import {
  I18n
} from '@tecla5/red-runtime/src/i18n'



interface I18nWidget extends JQuery<HTMLElement> {
  i18n: Function
}


export class SidebarTabInitializer extends Context {
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

    RED.sidebar.addTab({
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
    RED.actions.add("core:show-config-tab", () => {
      RED.sidebar.show('config')
    });

    $("#workspace-config-node-collapse-all").on("click", (e) => {
      e.preventDefault();
      for (var cat in categories) {
        if (categories.hasOwnProperty(cat)) {
          categories[cat].close();
        }
      }
    });
    $("#workspace-config-node-expand-all").on("click", (e) => {
      e.preventDefault();
      for (var cat in categories) {
        if (categories.hasOwnProperty(cat)) {
          if (categories[cat].size() > 0) {
            categories[cat].open();
          }
        }
      }
    });
    $('#workspace-config-node-filter-all').on("click", (e) => {
      e.preventDefault();
      if (showUnusedOnly) {
        $(this).addClass('selected');
        $('#workspace-config-node-filter-unused').removeClass('selected');
        showUnusedOnly = !showUnusedOnly;
        refreshConfigNodeList();
      }
    });
    $('#workspace-config-node-filter-unused').on("click", (e) => {
      e.preventDefault();
      if (!showUnusedOnly) {
        $(this).addClass('selected');
        $('#workspace-config-node-filter-all').removeClass('selected');
        showUnusedOnly = !showUnusedOnly;
        refreshConfigNodeList();
      }
    });
  }
}
