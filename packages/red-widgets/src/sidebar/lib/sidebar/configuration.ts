import {
  SidebarTabInfo
} from './tab-info'

import {
  SidebarTab
} from './tab'

import { Sidebar } from './'

import {
  Tabs,
  Context,
  $,
  delegateTarget,
  container
} from './_base'

interface ISidebar extends JQuery<HTMLElement> {
  tabs: Function
}

export interface ISidebarConfiguration {
  configure()
}

@delegateTarget()
export class SidebarConfiguration extends Context implements ISidebarConfiguration {
  constructor(public sidebar: Sidebar) {
    super()
  }

  configure() {
    const {
      RED
    } = this

    new Tabs()

    const sidebarElement = <ISidebar>$('#sidebar')
    sidebarElement.tabs();

    this.sidebar.sidebar_tabs = RED.tabs

    const {
      createTabs,
      createActions,
      toggleSidebar,
      showSidebar
    } = this.rebind([
        'createTabs',
        'createActions',
        'toggleSidebar',
        'showSidebar'
      ])

    // create Tabs
    RED.tabs = createTabs({
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
      start: function (event, ui) {
        this.sidebarSeparator.closing = false;
        this.sidebarSeparator.opening = false;
        var winWidth = $(window).width();
        this.sidebarSeparator.start = ui.position.left;
        this.sidebarSeparator.chartWidth = $("#workspace").width();
        this.sidebarSeparator.chartRight = winWidth - $("#workspace").width() - $("#workspace").offset().left - 2;

        if (!RED.menu.isSelected("menu-item-sidebar")) {
          this.sidebarSeparator.opening = true;
          var newChartRight = 7;
          $("#sidebar").addClass("closing");
          $("#workspace").css("right", newChartRight);
          $("#editor-stack").css("right", newChartRight + 1);
          $("#sidebar").width(0);
          RED.menu.setSelected("menu-item-sidebar", true);
          RED.events.emit("sidebar:resize");
        }
        this.sidebarSeparator.width = $("#sidebar").width();
      },
      drag: function (event, ui) {
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
        RED.events.emit("sidebar:resize");
      },
      stop: function (event, ui) {
        if (this.sidebarSeparator.closing) {
          $("#sidebar").removeClass("closing");
          RED.menu.setSelected("menu-item-sidebar", false);
          if ($("#sidebar").width() < 180) {
            $("#sidebar").width(180);
            $("#workspace").css("right", 187);
            $("#editor-stack").css("right", 188);
          }
        }
        $("#sidebar-separator").css("left", "auto");
        $("#sidebar-separator").css("right", ($("#sidebar").width() + 2) + "px");
        RED.events.emit("sidebar:resize");
      }
    });

    // add Actions
    RED.actions = createActions((state) => {
      if (state === undefined) {
        RED.menu.toggleSelected("menu-item-sidebar");
      } else {
        toggleSidebar(state);
      }
    });

    showSidebar();

    RED.sidebar.info = new SidebarTabInfo();
    RED.sidebar.SidebarTab = new SidebarTab(RED.sidebar)
    //RED.sidebar.config = new SidebarTabConfig();
    // hide info bar at start if screen rather narrow...
    if ($(window).width() < 600) {
      RED.menu.setSelected("menu-item-sidebar", false);
    }
  }
}
