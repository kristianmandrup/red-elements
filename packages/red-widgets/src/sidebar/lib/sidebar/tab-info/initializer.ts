import { Sidebar } from '../'
import {
  SidebarTab
} from '..'


import { SidebarTabInfo } from './';

import {
  marked,
  Context,
  $,
  Tabs,
  container,
  delegateTarget
} from '../_base'

@delegateTarget({
  container,
})
export class TabInfoInitializer extends Context {
  constructor(public sidebarTabInfo: SidebarTabInfo) {
    super()
  }

  async init(i18n) {
    const {
      RED,
    } = this.sidebarTabInfo

    let {
      content,
      tips,
      sections,
      nodeSection,
      infoSection,
      tipBox,
    } = this.sidebarTabInfo

    const {
      refresh,
      clear,
      show,
      createStack
    } = this.rebind([
        'show',
        'createStack',
        'refresh',
        'clear',
      ])

    // FIX: when i18n is initialized (translation map loaded), we can continue constructor in init
    await i18n.init()

    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false
    });

    // TODO: make into properties (ie. instance vars)

    var expandedSections = {
      "property": false
    };

    content = document.createElement("div");
    content.className = "sidebar-node-info"

    const required = ['actions', 'sidebar', 'events']
    required.map(name => {
      if (!RED[name]) {
        this.handleError(`init: RED missing ${name}`, {
          RED
        })
      }
    })

    RED.actions.add("core:show-info-tab", show);

    const stackContainer = this.buildStackContainer(content)

    // create stack
    sections = RED.stack = createStack({
      container: stackContainer
    }).hide();

    nodeSection = sections.add({
      title: RED._("sidebar.info.node"),
      collapsible: false
    });
    infoSection = sections.add({
      title: RED._("sidebar.info.information"),
      collapsible: false
    });
    infoSection.content.css("padding", "6px");
    infoSection.container.css("border-bottom", "none");

    var tipContainer = this.addTipContainer(content)
    tipBox = this.addTipBox(tipContainer)
    var tipButtons = this.addTipButtons(tipContainer);
    var tipRefresh = this.addTipRefresh(tipButtons);

    tipRefresh.click(function (e) {
      e.preventDefault();
      tips.next();
    })

    var tipClose = this.addTipClose(tipButtons)
    tipClose.click(function (e) {
      e.preventDefault();
      RED.actions.invoke("core:toggle-show-tips");
      RED.notify(RED._("sidebar.info.showTips"));
    });

    RED.sidebar.addTab({
      id: "info",
      label: RED._("sidebar.info.label"),
      name: RED._("sidebar.info.name"),
      content: content,
      enableOnEdit: true
    });
    if (tips.enabled) {
      tips.start();
    } else {
      tips.stop();
    }

    RED.events.on("view:selection-changed", function (selection) {
      if (selection.nodes) {
        if (selection.nodes.length == 1) {
          var node = selection.nodes[0];
          if (node.type === "subflow" && node.direction) {
            refresh(RED.nodes.subflow(node.z));
          } else {
            refresh(node);
          }
        }
      } else {
        var activeWS = RED.workspaces.active();

        var flow = RED.nodes.workspace(activeWS) || RED.nodes.subflow(activeWS);
        if (flow) {
          refresh(flow);
        } else {
          var workspace = RED.nodes.workspace(RED.workspaces.active());
          if (workspace && workspace.info) {
            refresh(workspace);
          } else {
            clear();
          }
        }
      }
    })
  }

  // protected

  protected buildStackContainer(content) {
    return $("<div>", {
      class: "sidebar-node-info-stack"
    }).appendTo(content);
  }

  protected addTipContainer(content) {
    return $('<div class="node-info-tips"></div>').appendTo(content);
  }

  protected addTipBox(tipContainer) {
    return $('<div class="node-info-tip"></div>').appendTo(tipContainer);
  }

  protected addTipButtons(tipContainer) {
    return $('<div class="node-info-tips-buttons"></div>').appendTo(tipContainer);
  }

  protected addTipRefresh(tipButtons) {
    return $('<a href="#" class="workspace-footer-button"><i class="fa fa-refresh"></a>').appendTo(tipButtons);
  }

  protected addTipClose(tipButtons) {
    return $('<a href="#" class="workspace-footer-button"><i class="fa fa-times"></a>').appendTo(tipButtons);
  }
}
