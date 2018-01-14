/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
import {
  Context,
  $,
  Tabs
} from '../../common'

import {
  SidebarTabConfig
}
  from './tab-config'
import {
  SidebarTabInfo
}
  from './tab-info'

// import 'jquery-ui-dist/jquery-ui'

const log = console.log

import {
  Actions
} from '../..'

// Note: Ensure Jquery UI has been initialized so .draggable widget is available

export class Sidebar extends Context {
  createTabs(options) {
    // legacy: ctx.tabs.create
    return new Tabs(options)
  }

  createActions(options) {
    return new Actions()
  }

  sidebarSeparator: any = {}
  knownTabs: any = {}
  tabs: any
  sidebar_tabs: any

  constructor() {
    super()

    let { ctx } = this
    //$('#sidebar').tabs();

    // create Tabs

    ctx.tabs = this.createTabs({
      id: "sidebar-tabs",
      onchange: (tab) => {
        $("#sidebar-content").children().hide();
        $("#sidebar-footer").children().hide();

        if (tab.onchange) {
          tab.onchange.call(tab);
        }

        if (!tab.wrapper) {
          this.handleError('Sidebar: tabs.onchange(tab) - tab missing wrapper', {
            tab
          })
        }

        $(tab.wrapper).show();
        if (tab.toolbar) {
          $(tab.toolbar).show();
        }
      },
      onremove: (tab) => {
        if (!tab) {
          this.handleError('Sidebar: tabs.onremove(tab) - tab missing!', {
            tab
          })
        }

        if (!tab.wrapper) {
          this.handleError('Sidebar: tabs.onremove(tab) - tab missing wrapper', {
            tab
          })
        }

        $(tab.wrapper).hide();
        if (tab.onremove) {
          tab.onremove.call(tab);
        }
      },
      minimumActiveTabWidth: 110
    });

    (<any>$("#sidebar-separator")).draggable({
      axis: "x",
      start: (event, ui) => {
        this.sidebarSeparator.closing = false;
        this.sidebarSeparator.opening = false;
        var winWidth = $(window).width();
        this.sidebarSeparator.start = ui.position.left;
        this.sidebarSeparator.chartWidth = $("#workspace").width();
        this.sidebarSeparator.chartRight = winWidth - $("#workspace").width() - $("#workspace").offset().left - 2;

        if (!ctx.menu.isSelected("menu-item-sidebar")) {
          this.sidebarSeparator.opening = true;
          var newChartRight = 7;
          $("#sidebar").addClass("closing");
          $("#workspace").css("right", newChartRight);
          $("#editor-stack").css("right", newChartRight + 1);
          $("#sidebar").width(0);
          ctx.menu.setSelected("menu-item-sidebar", true);
          ctx.events.emit("sidebar:resize");
        }
        this.sidebarSeparator.width = $("#sidebar").width();
      },
      drag: (event, ui) => {
        var d = ui.position.left - this.sidebarSeparator.start;
        var newSidebarWidth = this.sidebarSeparator.width - d;
        if (this.sidebarSeparator.opening) {
          newSidebarWidth -= 3;
        }

        if (newSidebarWidth > 150) {
          if (this.sidebarSeparator.chartWidth + d < 200) {
            ui.position.left = 200 + this.sidebarSeparator.start - this.sidebarSeparator.chartWidth;
            d = ui.position.left - this.sidebarSeparator.start;
            newSidebarWidth = this.sidebarSeparator.width - d;
          }
        }

        if (newSidebarWidth < 150) {
          if (!this.sidebarSeparator.closing) {
            $("#sidebar").addClass("closing");
            this.sidebarSeparator.closing = true;
          }
          if (!this.sidebarSeparator.opening) {
            newSidebarWidth = 150;
            ui.position.left = this.sidebarSeparator.width - (150 - this.sidebarSeparator.start);
            d = ui.position.left - this.sidebarSeparator.start;
          }
        } else if (newSidebarWidth > 150 && (this.sidebarSeparator.closing || this.sidebarSeparator.opening)) {
          this.sidebarSeparator.closing = false;
          $("#sidebar").removeClass("closing");
        }

        var newChartRight = this.sidebarSeparator.chartRight - d;
        $("#workspace").css("right", newChartRight);
        $("#editor-stack").css("right", newChartRight + 1);
        $("#sidebar").width(newSidebarWidth);

        this.sidebar_tabs.resize();
        ctx.events.emit("sidebar:resize");
      },
      stop: (event, ui) => {
        if (this.sidebarSeparator.closing) {
          $("#sidebar").removeClass("closing");
          ctx.menu.setSelected("menu-item-sidebar", false);
          if ($("#sidebar").width() < 180) {
            $("#sidebar").width(180);
            $("#workspace").css("right", 187);
            $("#editor-stack").css("right", 188);
          }
        }
        $("#sidebar-separator").css("left", "auto");
        $("#sidebar-separator").css("right", ($("#sidebar").width() + 2) + "px");
        ctx.events.emit("sidebar:resize");
      }
    });

    this.sidebar_tabs = ctx.tabs

    // add Actions
    ctx.actions = this.createActions((state) => {
      if (state === undefined) {
        ctx.menu.toggleSelected("menu-item-sidebar");
      } else {
        this.toggleSidebar(state);
      }
    });

    this.showSidebar();
    ctx.sidebar.info = new SidebarTabInfo();
    ctx.sidebar.config = new SidebarTabConfig();
    // hide info bar at start if screen rather narrow...
    if ($(window).width() < 600) {
      ctx.menu.setSelected("menu-item-sidebar", false);
    }

  }

  addTab(title, content, closeable, visible) {
    let {
      ctx,
      sidebar_tabs,
      knownTabs
    } = this

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

    ctx.menu.addItem("menu-item-view-menu", {
      id: "menu-item-view-menu-" + options.id,
      label: options.name,
      onselect: () => {
        this.showSidebar(options.id);
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
    this.sidebar_tabs = sidebar_tabs
    this.knownTabs = knownTabs
  }

  removeTab(id) {
    let {
      ctx,
      sidebar_tabs,
      knownTabs
    } = this

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
    ctx.menu.removeItem("menu-item-view-menu-" + id);
  }

  toggleSidebar(state) {
    let sidebar_tabs = this.sidebar_tabs
    let ctx = this.ctx

    if (!state) {
      $("#main-container").addClass("sidebar-closed");
    } else {
      $("#main-container").removeClass("sidebar-closed");
      sidebar_tabs.resize();
    }
    ctx.events.emit("sidebar:resize");
  }

  showSidebar(id?) {
    let {
      sidebar_tabs,
      ctx
    } = this
    if (id) {
      if (!this.containsTab(id)) {
        sidebar_tabs.addTab(this.knownTabs[id]);
      }
      sidebar_tabs.activateTab(id);
      if (!ctx.menu.isSelected("menu-item-sidebar")) {
        ctx.menu.setSelected("menu-item-sidebar", true);
      }
    }
  }

  containsTab(id) {
    let sidebar_tabs = this.sidebar_tabs
    return sidebar_tabs.contains(id);
  }
}
