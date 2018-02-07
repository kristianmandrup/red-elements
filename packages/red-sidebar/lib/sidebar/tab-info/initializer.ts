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
  delegateTarget,
  lazyInject,
  $TYPES
} from '../_base'

import {
  ISidebar,
  IActions,
  INotifications,
  IEvents,
  IWorkspaces,
  INodes
} from '../../../../_interfaces'
import { II18n } from '../../../../../../red-runtime/src/i18n/interface';
import { IStack } from '../../../../../../red-runtime/src/history/index';

const TYPES = $TYPES.all

@delegateTarget()
export class TabInfoInitializer extends Context {
  @lazyInject(TYPES.actions) $actions: IActions
  @lazyInject(TYPES.events) $events: IEvents
  @lazyInject(TYPES.workspaces) $workspaces: IWorkspaces
  @lazyInject(TYPES.nodes) $nodes: INodes
  @lazyInject(TYPES.sidebar.main) $sidebar: ISidebar
  @lazyInject(TYPES.notifications) $notifications: INotifications

  @lazyInject(TYPES.i18n) $i18n: II18n
  @lazyInject(TYPES.common.stack) $stack: IUiStack

  constructor(public sidebarTabInfo: SidebarTabInfo) {
    super()
  }

  async init(i18n) {
    const {
      $actions,
      $events,
      $sidebar,
      $notifications,
      $i18n,
      $stack
     } = this

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

    $actions.add("core:show-info-tab", show);

    const stackContainer = this.buildStackContainer(content)

    // create stack
    sections = $stack.createStack({
      container: stackContainer
    }).hide();

    nodeSection = sections.add({
      title: $i18n.t("sidebar.info.node"),
      collapsible: false
    });
    infoSection = sections.add({
      title: $i18n.t("sidebar.info.information"),
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
      $actions.invoke("core:toggle-show-tips");
      $notifications.notify($i18n.t("sidebar.info.showTips"));
    });

    $sidebar.addTab({
      id: "info",
      label: $i18n.t("sidebar.info.label"),
      name: $i18n.t("sidebar.info.name"),
      content: content,
      enableOnEdit: true
    });
    if (tips.enabled) {
      tips.start();
    } else {
      tips.stop();
    }

    this.configEvents()
  }

  // protected

  protected configEvents() {
    const { $events } = this
    const {
      refresh,
      clear
    } = this.rebind([
        'refresh',
        'clear'
      ], this.sidebarTabInfo)


    $events.on("view:selection-changed", function (selection) {
      const { workspaces, nodes } = this

      if (selection.nodes) {
        if (selection.nodes.length == 1) {
          var node = selection.nodes[0];
          if (node.type === "subflow" && node.direction) {
            refresh(nodes.subflow(node.z));
          } else {
            refresh(node);
          }
        }
      } else {
        var activeWS = workspaces.active();

        var flow = nodes.workspace(activeWS) || nodes.subflow(activeWS);
        if (flow) {
          refresh(flow);
        } else {
          var workspace = nodes.workspace(workspaces.active());
          if (workspace && workspace.info) {
            refresh(workspace);
          } else {
            clear();
          }
        }
      }
    })
  }


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
