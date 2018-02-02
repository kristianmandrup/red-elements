import { Sidebar, ISidebarTabInfo } from '../'
import {
  SidebarTab
} from '.'

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
  IUtils,
  IEditor,
  INodes,
  ISidebarTabInfo,
  I18nWidget
} from '../../../../_interfaces'

const TYPES = $TYPES.all

@delegateTarget()
export class SidebarTabInitializer extends Context {
  @lazyInject(TYPES.utils) utils: IUtils
  @lazyInject(TYPES.editor) editor: IEditor
  @lazyInject(TYPES.nodes) nodes: INodes
  @lazyInject(TYPES.sidebar.info) info: ISidebarTabInfo

  constructor(public sidebarTab: SidebarTab) {
    super()
  }
  public categories: Object
  public globalCategories: JQuery<HTMLElement>
  public flowCategories: JQuery<HTMLElement>
  public subflowCategories: JQuery<HTMLElement>

  createConfigNodeList(id, nodes) {
    const { utils, editor, info } = this

    let {
      RED,
      showUnusedOnly
    } = this.sidebarTab

    const {
    getOrCreateCategory
  } = this.rebind([
        'getOrCreateCategory'
      ])

    var category = getOrCreateCategory(id.replace(/\./i, "-"))
    var list = category.list;

    nodes.sort(function (A, B) {
      if (A.type < B.type) {
        return -1;
      }
      if (A.type > B.type) {
        return 1;
      }
      return 0;
    });
    if (showUnusedOnly) {
      var hiddenCount = nodes.length;
      nodes = nodes.filter(function (n) {
        return n._def.hasUsers !== false && n.users.length === 0;
      })
      hiddenCount = hiddenCount - nodes.length;
      if (hiddenCount > 0) {
        list.parent().find('.config-node-filter-info').text(RED._('sidebar.config.filtered', {
          count: hiddenCount
        })).show();
      } else {
        list.parent().find('.config-node-filter-info').hide();
      }
    } else {
      list.parent().find('.config-node-filter-info').hide();
    }
    list.empty();
    if (nodes.length === 0) {
      let sidebarConfig = <I18nWidget>$('<li class="config_node_none" data-i18n="sidebar.config.none">NONE</li>')
      sidebarConfig.i18n().appendTo(list);
      category.close(true);
    } else {
      var currentType = "";
      nodes.forEach(function (node) {
        var label = utils.getNodeLabel(node, node.id);
        if (node.type != currentType) {
          $('<li class="config_node_type">' + node.type + '</li>').appendTo(list);
          currentType = node.type;
        }

        var entry = $('<li class="palette_node config_node palette_node_id_' + node.id.replace(/\./g, "-") + '"></li>').appendTo(list);
        $('<div class="palette_label"></div>').text(label).appendTo(entry);
        if (node._def.hasUsers !== false) {
          var iconContainer = $('<div/>', {
            class: "palette_icon_container  palette_icon_container_right"
          }).text(node.users.length).appendTo(entry);
          if (node.users.length === 0) {
            entry.addClass("config_node_unused");
          }
        }
        entry.on('click', function (e) {
          info.refresh(node);
        });
        entry.on('dblclick', function (e) {
          editor.editConfig("", node.type, node.id);
        });
        var userArray = node.users.map(function (n) {
          return n.id
        });
        entry.on('mouseover', function (e) {
          nodes.eachNode(function (node) {
            if (userArray.indexOf(node.id) != -1) {
              node.highlighted = true;
              node.dirty = true;
            }
          });
          view.redraw();
        });

        entry.on('mouseout', function (e) {
          nodes.eachNode(function (node) {
            if (node.highlighted) {
              node.highlighted = false;
              node.dirty = true;
            }
          });
          view.redraw();
        });
      });
      category.open(true);
    }
  }

  refreshConfigNodeList() {
    let {
    categories,
      globalCategories,
      flowCategories,
      subflowCategories,
      RED,
      nodes
  } = this

    var validList = {
      "global": true
    };

    this.sidebarTab.getOrCreateCategory("global", globalCategories);

    nodes.eachWorkspace((ws) => {
      validList[ws.id.replace(/\./g, "-")] = true;
      this.sidebarTab.getOrCreateCategory(ws.id, flowCategories, ws.label);
    })
    nodes.eachSubflow((sf) => {
      validList[sf.id.replace(/\./g, "-")] = true;
      this.sidebarTab.getOrCreateCategory(sf.id, subflowCategories, sf.name);
    })
    $(".workspace-config-node-category").each(function () {
      var id = $(this).attr('id').substring("workspace-config-node-category-".length);
      if (!validList[id]) {
        $(this).remove();
        delete categories[id];
      }
    })
    var globalConfigNodes = [];
    var configList = {};
    nodes.eachConfig((cn) => {
      if (cn.z) { //} == RED.workspaces.active()) {
        configList[cn.z.replace(/\./g, "-")] = configList[cn.z.replace(/\./g, "-")] || [];
        configList[cn.z.replace(/\./g, "-")].push(cn);
      } else if (!cn.z) {
        globalConfigNodes.push(cn);
      }
    });
    for (var id in validList) {
      if (validList.hasOwnProperty(id)) {
        this.createConfigNodeList(id, configList[id] || []);
      }
    }
    this.createConfigNodeList('global', globalConfigNodes);
  }
}
