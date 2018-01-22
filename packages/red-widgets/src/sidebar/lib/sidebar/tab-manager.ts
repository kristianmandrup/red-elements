import { Sidebar } from './'
import { Context } from '../../../context'

export class SidebarTabManager extends Context {
  constructor(public sidebar: Sidebar) {
    super()
  }

  /**
   * Add tab to sidebar
   * @param title
   * @param content
   * @param closeable
   * @param visible
   */
  addTab(title, content, closeable, visible) {
    let {
      RED,
      sidebar_tabs,
      knownTabs
    } = this.sidebar
    const {
      showSidebar
    } = this.rebind([
        'showSidebar'
      ])

    var options;
    if (typeof title === 'string') {
      if (!content.id) {
        this.handleError('addTab: content argument must be an Object with id of tab to add', {
          content
        })
      }

      // TODO: legacy support in case anyone uses this...
      options = {
        id: content.id,
        label: title,
        name: title,
        content: content,
        closeable: closeable,
        visible: visible
      }
    } else if (typeof title === 'object') {
      options = title;
    }

    options.wrapper = $('<div>', {
      style: "height:100%"
    }).appendTo("#sidebar-content")
    options.wrapper.append(options.content);
    options.wrapper.hide();

    if (!options.enableOnEdit) {
      options.shade = $('<div>', {
        class: "sidebar-shade hide"
      }).appendTo(options.wrapper);
    }

    if (options.toolbar) {
      $("#sidebar-footer").append(options.toolbar);
      $(options.toolbar).hide();
    }
    var id = options.id;

    if (!id) {
      this.handleError('addTab: options must have id of tab to add', {
        id,
        options
      })
    }

    RED.menu.addItem("menu-item-view-menu", {
      id: "menu-item-view-menu-" + options.id,
      label: options.name,
      onselect: () => {
        showSidebar(options.id);
      },
      group: "sidebar-tabs"
    });

    let tabId = options.id
    knownTabs[tabId] = options;

    if (options.visible !== false) {
      let knownTab = knownTabs[tabId]
      if (knownTab) {
        sidebar_tabs.addTab(knownTab);
      } else {
        this.logWarning('addTab: no such known tab', {
          knownTabs,
          tabId
        })
      }
    } else {
      this.logWarning('invisible so no tab added', {
        tabId,
        ids: sidebar_tabs.ids,
        tabs: sidebar_tabs.tabs
      })
    }

    this.setInstanceVars({
      sidebar_tabs,
      knownTabs
    }, this.sidebar)
  }

  /**
   * Remove tab from sidebar
   * @param id
   */
  removeTab(id: string) {
    const {
      RED,
      sidebar_tabs,
      knownTabs
    } = this.sidebar

    sidebar_tabs.removeTab(id);
    let knownTab = knownTabs[id]

    if (!knownTab) {
      this.logWarning(`removeTab: no known tab registered named ${id}`, {
        id,
        knownTabs
      })
      return
    }

    if (!knownTab.wrapper) {
      this.handleError(`removeTab: knownTab missing wrapper`, {
        id,
        knownTab,
        knownTabs
      })
    }

    $(knownTab.wrapper).remove();
    let footer = knownTab.footer
    if (footer) {
      footer.remove();
    }
    delete knownTabs[id];
    RED.menu.removeItem("menu-item-view-menu-" + id);
  }
}
