import {
  NodeEditor,
  Context,
  $,
  delegateTarget,
  lazyInject,
  $TYPES
} from './_base'
import { ICanvas, INodeEditor, IPanels, IWorkspaces } from '../../../../../../red-runtime/src/interfaces/index';
import { II18n } from '../../../../../../red-runtime/src/i18n/interface';
import { ITray } from '../../../../tray/lib/interface';
import { IState, IText } from '../../../../_interfaces/index';
import { ISidebar } from '../../../../sidebar/lib/sidebar/interface';
import { INodes } from '../../../../../../red-runtime/src/nodes/list/interface';
import { IPalette } from '../../../../palette/lib/palette/interface';
import { IHistory } from '../../../../../../red-runtime/src/history/interface';
import { IStack } from '../../../../../../red-runtime/src/history/index';

const TYPES = $TYPES.all

import {
  ITabSelect
} from '../../../../_interfaces'

export interface IConfigNodeDialog {
  /**
     * name - name of the property that holds this config node
     * type - type of config node
     * id - id of config node to edit. _ADD_ for a new one
     * prefix - the input prefix of the parent property
     */
  showEditConfigNodeDialog(name, type, id, prefix)
}

/**
 * Config Node Dialog for NodeEditor
 */
@delegateTarget()
export class ConfigNodeDialog extends Context implements IConfigNodeDialog {
  @lazyInject(TYPES.canvas) $view: ICanvas
  @lazyInject(TYPES.i18n) $i18n: II18n
  @lazyInject(TYPES.tray) $tray: ITray
  @lazyInject(TYPES.state) $state: IState
  @lazyInject(TYPES.editor) $editor: INodeEditor
  @lazyInject(TYPES.state) $panels: IPanels // from common widgets
  @lazyInject(TYPES.sidebar.main) $sidebar: ISidebar
  @lazyInject(TYPES.nodes) $nodes: INodes
  @lazyInject(TYPES.palette) $palette: IPalette
  @lazyInject(TYPES.history) $history: IHistory
  @lazyInject(TYPES.workspaces) $workspaces: IWorkspaces
  @lazyInject(TYPES.events) $events: IEvents

  // TODO: Fix - use interface from common widgets, not history stack!
  @lazyInject(TYPES.common.stack) $stack: IUiStack
  @lazyInject(TYPES.text) $text: IText

  constructor(public editor: NodeEditor) {
    super()
  }

  /**
   * name - name of the property that holds this config node
   * type - type of config node
   * id - id of config node to edit. _ADD_ for a new one
   * prefix - the input prefix of the parent property
   */
  showEditConfigNodeDialog(name, type, id, prefix) {
    const {
      // services
      $state,
      $tray,
      $i18n,
      $nodes,
      $palette,
      $history,
      $stack,
      $sidebar,
      $editor,
      $text,
      $view,
      $workspaces,
      $events,

      rebind,
      editor
    } = this

    const {
      editStack,
    } = editor

    const {
      getEditStackTitle,
      buildEditForm,
      prepareEditDialog,
      validateNode,
      updateNodeCredentials,
      updateConfigNodeSelect
    } = this.rebind([
        'getEditStackTitle',
        'buildEditForm',
        'prepareEditDialog',
        'validateNode',
        'updateNodeCredentials',
        'updateConfigNodeSelect'
      ])

    this._validateStr(prefix, 'prefix', 'showEditConfigNodeDialog')

    var adding = (id == "_ADD_");
    var node_def = $nodes.getType(type);
    var editing_config_node = $nodes.node(id);

    this._validateNodeDef(node_def, 'node_def', 'showEditConfigNodeDialog')

    var ns;
    if (node_def.set.module === "node-red") {
      ns = "node-red";
    } else {
      ns = node_def.set.id;
    }
    var configNodeScope = ""; // default to global
    var activeSubflow = $nodes.subflow($workspaces.active;
    if (activeSubflow) {
      configNodeScope = activeSubflow.id;
    }
    if (editing_config_node == null) {
      editing_config_node = {
        id: $nodes.id,
        _def: node_def,
        type: type,
        z: configNodeScope,
        users: []
      }
      for (var d in node_def.defaults) {
        if (node_def.defaults[d].value) {
          editing_config_node[d] = JSON.parse(JSON.stringify(node_def.defaults[d].value));
        }
      }
      editing_config_node["_"] = node_def._;
    }
    editStack.push(editing_config_node);

    $view.state($state.EDITING);
    var trayOptions = {
      buttons: [],
      title: getEditStackTitle(), //(adding?$i18n.t("editor.addNewConfig", {type:type}):$i18n.t("editor.editConfig", {type:type})),
      resize: function () {
        if (editing_config_node && editing_config_node._def.oneditresize) {
          var form = $("#node-config-dialog-edit-form");
          try {
            editing_config_node._def.oneditresize.call(editing_config_node, {
              width: form.width(),
              height: form.height()
            });
          } catch (err) {
            log("oneditresize", editing_config_node.id, editing_config_node.type, err.toString());
          }
        }
      },
      open: function (tray, done) {
        var trayHeader = tray.find(".editor-tray-header");
        var trayFooter = tray.find(".editor-tray-footer");

        if (node_def.hasUsers !== false) {
          trayFooter.prepend('<div id="node-config-dialog-user-count"><i class="fa fa-info-circle"></i> <span></span></div>');
        }
        trayFooter.append('<span id="node-config-dialog-scope-container"><span id="node-config-dialog-scope-warning" data-i18n="[title]editor.errors.scopeChange"><i class="fa fa-warning"></i></span><select id="node-config-dialog-scope"></select></span>');

        var dialogForm = buildEditForm(tray.find('.editor-tray-body'), "node-config-dialog-edit-form", type, ns);

        prepareEditDialog(editing_config_node, node_def, "node-config-input", function () {
          if (editing_config_node._def.exclusive) {
            $("#node-config-dialog-scope").hide();
          } else {
            $("#node-config-dialog-scope").show();
          }
          $("#node-config-dialog-scope-warning").hide();

          var nodeUserFlows = {};
          editing_config_node.users.forEach(function (n) {
            nodeUserFlows[n.z] = true;
          });
          var flowCount = Object.keys(nodeUserFlows).length;
          var tabSelect = <ITabSelect>$("#node-config-dialog-scope").empty();
          tabSelect.off("change");
          tabSelect.append('<option value=""' + (!editing_config_node.z ? " selected" : "") + ' data-i18n="sidebar.config.global"></option>');
          tabSelect.append('<option disabled data-i18n="sidebar.config.flows"></option>');
          $nodes.eachWorkspace(function (ws) {
            var workspaceLabel = ws.label;
            if (nodeUserFlows[ws.id]) {
              workspaceLabel = "* " + workspaceLabel;
            }
            tabSelect.append('<option value="' + ws.id + '"' + (ws.id == editing_config_node.z ? " selected" : "") + '>' + workspaceLabel + '</option>');
          });
          tabSelect.append('<option disabled data-i18n="sidebar.config.subflows"></option>');
          $nodes.eachSubflow(function (ws) {
            var workspaceLabel = ws.name;
            if (nodeUserFlows[ws.id]) {
              workspaceLabel = "* " + workspaceLabel;
            }
            tabSelect.append('<option value="' + ws.id + '"' + (ws.id == editing_config_node.z ? " selected" : "") + '>' + workspaceLabel + '</option>');
          });
          if (flowCount > 0) {
            tabSelect.on('change', function () {
              var newScope: string = String($(this).val());
              if (newScope === '') {
                // global scope - everyone can use it
                $("#node-config-dialog-scope-warning").hide();
              } else if (!nodeUserFlows[parseInt(newScope)] || flowCount > 1) {
                // a user will loose access to it
                $("#node-config-dialog-scope-warning").show();
              } else {
                $("#node-config-dialog-scope-warning").hide();
              }
            });
          }

          tabSelect.i18n();
          dialogForm.i18n();

          if (node_def.hasUsers !== false) {
            $("#node-config-dialog-user-count").find("span").html($i18n.t("editor.nodesUse", {
              count: editing_config_node.users.length
            })).parent().show();
          }
          done();
        });
      },
      close: function () {
        $workspaces.refresh();
        editStack.pop();
      },
      show: function () {
        if (editing_config_node) {
          $sidebar.info.refresh(editing_config_node);
        }
      }
    }
    trayOptions.buttons = [{
      id: "node-config-dialog-cancel",
      text: $i18n.t("common.label.cancel"),
      click: function () {
        var configType = type;
        var configId = editing_config_node.id;
        var configAdding = adding;
        var configTypeDef = $nodes.getType(configType);

        if (configTypeDef.oneditcancel) {
          // TODO: what to pass as this to call
          if (configTypeDef.oneditcancel) {
            var cn = $nodes.node(configId);
            if (cn) {
              try {
                configTypeDef.oneditcancel.call(cn, false);
              } catch (err) {
                log("oneditcancel", cn.id, cn.type, err.toString());
              }
            } else {
              try {
                configTypeDef.oneditcancel.call({
                  id: configId
                }, true);
              } catch (err) {
                log("oneditcancel", configId, configType, err.toString());
              }
            }
          }
        }
        $tray.close();
      }
    },
    {
      id: "node-config-dialog-ok",
      text: adding ? $i18n.t("editor.configAdd") : $i18n.t("editor.configUpdate"),
      class: "primary",
      click: function () {
        var configProperty = name;
        var configId = editing_config_node.id;
        var configType = type;
        var configAdding = adding;
        var configTypeDef = $nodes.getType(configType);
        var d;
        var input;
        var scope = $("#node-config-dialog-scope").val();

        if (configTypeDef.oneditsave) {
          try {
            configTypeDef.oneditsave.call(editing_config_node);
          } catch (err) {
            log("oneditsave", editing_config_node.id, editing_config_node.type, err.toString());
          }
        }

        for (d in configTypeDef.defaults) {
          if (configTypeDef.defaults.hasOwnProperty(d)) {
            var newValue;
            input = $("#node-config-input-" + d);
            if (input.attr('type') === "checkbox") {
              newValue = input.prop('checked');
            } else if ("format" in configTypeDef.defaults[d] && configTypeDef.defaults[d].format !== "" && input[0].nodeName === "DIV") {
              newValue = input.text();
            } else {
              newValue = input.val();
            }
            if (newValue != null && newValue !== editing_config_node[d]) {
              if (editing_config_node._def.defaults[d].type) {
                if (newValue == "_ADD_") {
                  newValue = "";
                }
                // Change to a related config node
                var configNode = $nodes.node(editing_config_node[d]);
                if (configNode) {
                  var users = configNode.users;
                  users.splice(users.indexOf(editing_config_node), 1);
                }
                configNode = $nodes.node(newValue);
                if (configNode) {
                  configNode.users.push(editing_config_node);
                }
              }
              editing_config_node[d] = newValue;
            }
          }
        }
        editing_config_node.label = configTypeDef.label;
        editing_config_node.z = scope;

        if (scope) {
          // Search for nodes that use this one that are no longer
          // in scope, so must be removed
          editing_config_node.users = editing_config_node.users.filter(function (n) {
            var keep = true;
            for (var d in n._def.defaults) {
              if (n._def.defaults.hasOwnProperty(d)) {
                if (n._def.defaults[d].type === editing_config_node.type &&
                  n[d] === editing_config_node.id &&
                  n.z !== scope) {
                  keep = false;
                  // Remove the reference to this node
                  // and revalidate
                  n[d] = null;
                  n.dirty = true;
                  n.changed = true;
                  validateNode(n);
                }
              }
            }
            return keep;
          });
        }

        if (configAdding) {
          $nodes.add(editing_config_node);
        }

        if (configTypeDef.credentials) {
          updateNodeCredentials(editing_config_node, configTypeDef.credentials, "node-config-input");
        }
        validateNode(editing_config_node);
        var validatedNodes = {};
        validatedNodes[editing_config_node.id] = true;

        var userStack = editing_config_node.users.slice();
        while (userStack.length > 0) {
          var user = userStack.pop();
          if (!validatedNodes[user.id]) {
            validatedNodes[user.id] = true;
            if (user.users) {
              userStack = userStack.concat(user.users);
            }
            validateNode(user);
          }
        }
        $nodes.dirty(true);
        $view.redraw(true);
        if (!configAdding) {
          $events.emit("editor:save", editing_config_node);
        }

        await $tray.close()
        updateConfigNodeSelect(configProperty, configType, editing_config_node.id, prefix);
      }
    }
    ];

    if (!adding) {
      this.notAdding({ editing_config_node, type, trayOptions, prefix })
    }

    $tray.show(trayOptions);
    return this
  }


  notAdding({ editing_config_node, type, trayOptions, prefix }) {
    const {
      // services
      $state,
      $tray,
      $i18n,
      $nodes,
      $palette,
      $history,
      $stack,
      $sidebar,
      $editor,
      $text,
      $view,
      $workspaces,
      $events,

      rebind,
      editor
    } = this

    const {
      validateNode,
      updateConfigNodeSelect
    } = this.rebind([
        'validateNode',
        'updateConfigNodeSelect'
      ], this.editor)

    const trayOption = {
      class: 'leftButton',
      text: $i18n.t("editor.configDelete"), //'<i class="fa fa-trash"></i>',
      click: function () {
        var configProperty = name;
        var configId = editing_config_node.id;
        var configType = type;
        var configTypeDef = $nodes.getType(configType);

        try {

          if (configTypeDef.ondelete) {
            // Deprecated: never documented but used by some early nodes
            log("Deprecated API warning: config node type ", configType, " has an ondelete function - should be oneditdelete");
            configTypeDef.ondelete.call(editing_config_node);
          }
          if (configTypeDef.oneditdelete) {
            configTypeDef.oneditdelete.call(editing_config_node);
          }
        } catch (err) {
          log("oneditdelete", editing_config_node.id, editing_config_node.type, err.toString());
        }

        var historyEvent = {
          t: 'delete',
          nodes: [editing_config_node],
          changes: {},
          dirty: $nodes.dirty()
        }
        for (var i = 0; i < editing_config_node.users.length; i++) {
          var user = editing_config_node.users[i];
          historyEvent.changes[user.id] = {
            changed: user.changed,
            valid: user.valid
          };
          for (var d in user._def.defaults) {
            if (user._def.defaults.hasOwnProperty(d) && user[d] == configId) {
              historyEvent.changes[user.id][d] = configId
              user[d] = "";
              user.changed = true;
              user.dirty = true;
            }
          }
          validateNode(user);
        }
        $nodes.remove(configId);
        $nodes.dirty(true);
        $view.redraw(true);
        $history.push(historyEvent);
        await $tray.close()
        updateConfigNodeSelect(configProperty, configType, "", prefix);
      }
    };

    trayOptions.buttons.unshift(trayOption)
  }
}
