import { NodeEditor } from '../'
import { Context, $ } from '../../../../common'

/**
 * Edit Dialog for NodeEditor
 */
export class EditDialog extends Context {
  constructor(public editor: NodeEditor) {
    super()
  }

  /**
   * show Edit Dialog
   * @param node
   */
  showEditDialog(node) {
    const {
      RED,
      rebind,
      editor
    } = this

    const {
      editStack,
    } = editor

    const {
      getEditStackTitle,
      updateNodeCredentials,
      updateNodeProperties,
      validateNode,
      editTrayWidthCache,
      refreshLabelForm,
      buildEditForm,
      buildLabelForm,
      prepareEditDialog,
      logInfo
    } = rebind([
        'getEditStackTitle',
        'updateNodeCredentials',
        'updateNodeProperties',
        'validateNode',
        'editTrayWidthCache',
        'refreshLabelForm',
        'buildEditForm',
        'buildLabelForm',
        'prepareEditDialog',
        'logInfo'
      ], editor)

    var editing_node = node;
    editStack.push(node);
    RED.view.state(RED.state.EDITING);

    let type = node.type;
    this._validateStr(type, 'node.type', 'showEditDialog')

    if (type.substring(0, 8) === "subflow:") {
      type = "subflow";
    }
    var trayOptions = {
      width: null,
      title: getEditStackTitle(),
      buttons: [{
        id: "node-dialog-delete",
        class: 'leftButton',
        text: RED._("common.label.delete"),
        click: () => {
          var startDirty = RED.nodes.dirty();
          var removedNodes = [];
          var removedLinks = [];
          var removedEntities = RED.nodes.remove(editing_node.id);
          removedNodes.push(editing_node);
          removedNodes = removedNodes.concat(removedEntities.nodes);
          removedLinks = removedLinks.concat(removedEntities.links);

          var historyEvent = {
            t: 'delete',
            nodes: removedNodes,
            links: removedLinks,
            changes: {},
            dirty: startDirty
          }

          RED.nodes.dirty(true);
          RED.view.redraw(true);
          RED.history.push(historyEvent);
          RED.tray.close();
        }
      },
      {
        id: "node-dialog-cancel",
        text: RED._("common.label.cancel"),
        click: () => {
          if (editing_node._def) {
            if (editing_node._def.oneditcancel) {
              try {
                editing_node._def.oneditcancel.call(editing_node);
              } catch (err) {
                logInfo("oneditcancel", editing_node.id, editing_node.type, err.toString());
              }
            }

            for (var d in editing_node._def.defaults) {
              if (editing_node._def.defaults.hasOwnProperty(d)) {
                var def = editing_node._def.defaults[d];
                if (def.type) {
                  var configTypeDef = RED.nodes.getType(def.type);
                  if (configTypeDef && configTypeDef.exclusive) {
                    var input = $("#node-input-" + d).val() || "";
                    if (input !== "" && !editing_node[d]) {
                      // This node has an exclusive config node that
                      // has just been added. As the user is cancelling
                      // the edit, need to delete the just-added config
                      // node so that it doesn't get orphaned.
                      RED.nodes.remove(input);
                    }
                  }
                }
              }

            }
          }
          RED.tray.close();
        }
      },
      {
        id: "node-dialog-ok",
        text: RED._("common.label.done"),
        class: "primary",
        click: () => {
          var changes: any = {};
          var changed = false;
          var wasDirty = RED.nodes.dirty();
          var d;
          var outputMap;

          if (editing_node._def.oneditsave) {
            var oldValues = {};
            for (d in editing_node._def.defaults) {
              if (editing_node._def.defaults.hasOwnProperty(d)) {
                if (typeof editing_node[d] === "string" || typeof editing_node[d] === "number") {
                  oldValues[d] = editing_node[d];
                } else {
                  oldValues[d] = $.extend(true, {}, {
                    v: editing_node[d]
                  }).v;
                }
              }
            }
            try {
              var rc = editing_node._def.oneditsave.call(editing_node);
              if (rc === true) {
                changed = true;
              }
            } catch (err) {
              logInfo("oneditsave", editing_node.id, editing_node.type, err.toString());
            }

            for (d in editing_node._def.defaults) {
              if (editing_node._def.defaults.hasOwnProperty(d)) {
                if (oldValues[d] === null || typeof oldValues[d] === "string" || typeof oldValues[d] === "number") {
                  if (oldValues[d] !== editing_node[d]) {
                    changes[d] = oldValues[d];
                    changed = true;
                  }
                } else {
                  if (JSON.stringify(oldValues[d]) !== JSON.stringify(editing_node[d])) {
                    changes[d] = oldValues[d];
                    changed = true;
                  }
                }
              }
            }
          }

          var newValue;
          if (editing_node._def.defaults) {
            for (d in editing_node._def.defaults) {
              if (editing_node._def.defaults.hasOwnProperty(d)) {
                var input = $("#node-input-" + d);
                if (input.attr('type') === "checkbox") {
                  newValue = input.prop('checked');
                } else if ("format" in editing_node._def.defaults[d] && editing_node._def.defaults[d].format !== "" && input[0].nodeName === "DIV") {
                  newValue = input.text();
                } else {
                  newValue = input.val();
                }
                if (newValue != null) {
                  if (d === "outputs") {
                    if (newValue.trim() === "") {
                      continue;
                    }
                    if (isNaN(newValue)) {
                      outputMap = JSON.parse(newValue);
                      var outputCount = 0;
                      var outputsChanged = false;
                      var keys = Object.keys(outputMap);
                      keys.forEach((p: any) => {
                        if (isNaN(p)) {
                          // New output;
                          outputCount++;
                          delete outputMap[p];
                        } else {
                          outputMap[p] = outputMap[p] + "";
                          if (outputMap[p] !== "-1") {
                            outputCount++;
                            if (outputMap[p] !== p) {
                              // Output moved
                              outputsChanged = true;
                            } else {
                              delete outputMap[p];
                            }
                          } else {
                            // Output removed
                            outputsChanged = true;
                          }
                        }
                      });

                      newValue = outputCount;
                      if (outputsChanged) {
                        changed = true;
                      }
                    }
                  }
                  if (editing_node[d] != newValue) {
                    if (editing_node._def.defaults[d].type) {
                      if (newValue == "_ADD_") {
                        newValue = "";
                      }
                      // Change to a related config node
                      var configNode = RED.nodes.node(editing_node[d]);
                      if (configNode) {
                        var users = configNode.users;
                        users.splice(users.indexOf(editing_node), 1);
                      }
                      configNode = RED.nodes.node(newValue);
                      if (configNode) {
                        configNode.users.push(editing_node);
                      }
                    }
                    changes[d] = editing_node[d];
                    editing_node[d] = newValue;
                    changed = true;
                  }
                }
              }
            }
          }
          if (editing_node._def.credentials) {
            var prefix = 'node-input';
            var credDefinition = editing_node._def.credentials;
            var credsChanged = updateNodeCredentials(editing_node, credDefinition, prefix);
            changed = changed || credsChanged;
          }
          // if (editing_node.hasOwnProperty("_outputs")) {
          //     outputMap = editing_node._outputs;
          //     delete editing_node._outputs;
          //     if (Object.keys(outputMap).length > 0) {
          //         changed = true;
          //     }
          // }
          var removedLinks = updateNodeProperties(editing_node, outputMap);

          var inputLabels = $("#node-label-form-inputs").children().find("input");
          var outputLabels = $("#node-label-form-outputs").children().find("input");

          var hasNonBlankLabel = false;
          newValue = inputLabels.map(function () {
            var v = $(this).val();
            hasNonBlankLabel = hasNonBlankLabel || v !== "";
            return v;
          }).toArray().slice(0, editing_node.inputs);
          if ((editing_node.inputLabels === undefined && hasNonBlankLabel) ||
            (editing_node.inputLabels !== undefined && JSON.stringify(newValue) !== JSON.stringify(editing_node.inputLabels))) {
            changes.inputLabels = editing_node.inputLabels;
            editing_node.inputLabels = newValue;
            changed = true;
          }
          hasNonBlankLabel = false;
          newValue = new Array(editing_node.outputs);
          outputLabels.each(function () {
            var index: any = $(this).attr('id').substring(23); // node-label-form-output-<index>
            if (outputMap && outputMap.hasOwnProperty(index)) {
              index = parseInt(outputMap[index]);
              if (index === -1) {
                return;
              }
            }
            var v = $(this).val();
            hasNonBlankLabel = hasNonBlankLabel || v !== "";
            newValue[index] = v;
          })

          if ((editing_node.outputLabels === undefined && hasNonBlankLabel) ||
            (editing_node.outputLabels !== undefined && JSON.stringify(newValue) !== JSON.stringify(editing_node.outputLabels))) {
            changes.outputLabels = editing_node.outputLabels;
            editing_node.outputLabels = newValue;
            changed = true;
          }

          if (changed) {
            var wasChanged = editing_node.changed;
            editing_node.changed = true;
            RED.nodes.dirty(true);

            var activeSubflow = RED.nodes.subflow(RED.workspaces.active());
            var subflowInstances = null;
            if (activeSubflow) {
              subflowInstances = [];
              RED.nodes.eachNode(function (n) {
                if (n.type == "subflow:" + RED.workspaces.active()) {
                  subflowInstances.push({
                    id: n.id,
                    changed: n.changed
                  });
                  n.changed = true;
                  n.dirty = true;
                  updateNodeProperties(n);
                }
              });
            }
            var historyEvent = {
              t: 'edit',
              node: editing_node,
              changes: changes,
              links: removedLinks,
              dirty: wasDirty,
              changed: wasChanged,
              outputMap: null,
              subflow: null
            };
            if (outputMap) {
              historyEvent.outputMap = outputMap;
            }
            if (subflowInstances) {
              historyEvent.subflow = {
                instances: subflowInstances
              }
            }
            RED.history.push(historyEvent);
          }
          editing_node.dirty = true;
          validateNode(editing_node);
          RED.events.emit("editor:save", editing_node);
          RED.tray.close();
        }
      }
      ],
      missingDimensions: (dimensions?: any) => {
        // TODO
      },
      resize: (dimensions?: any) => {
        if (!dimensions) {
          dimensions = trayOptions.missingDimensions(dimensions)
        }

        editTrayWidthCache[type] = dimensions.width;
        $(".editor-tray-content").height(dimensions.height - 78);
        var form = $(".editor-tray-content form").height(dimensions.height - 78 - 40);
        if (editing_node && editing_node._def.oneditresize) {
          try {
            editing_node._def.oneditresize.call(editing_node, {
              width: form.width(),
              height: form.height()
            });
          } catch (err) {
            logInfo("oneditresize", editing_node.id, editing_node.type, err.toString());
          }
        }
      },
      open: (tray, done) => {
        var trayFooter = tray.find(".editor-tray-footer");
        var trayBody = tray.find('.editor-tray-body');
        trayBody.parent().css('overflow', 'hidden');

        this._validateObj(RED.stack, 'RED.stack', 'showEditDialog trayOptions:open')

        var stack = RED.stack.create({
          container: trayBody,
          singleExpanded: true
        });
        var nodeProperties = stack.add({
          title: RED._("editor.nodeProperties"),
          expanded: true
        });
        nodeProperties.content.addClass("editor-tray-content");

        var portLabels = stack.add({
          title: RED._("editor.portLabels"),
          onexpand: function () {
            refreshLabelForm(this.content, node);
          }
        });
        portLabels.content.addClass("editor-tray-content");

        if (editing_node) {
          RED.sidebar.info.refresh(editing_node);
        }
        var ns;
        const { set } = node._def
        this._validateObj(set, 'node._def.set', 'showEditDialog trayOptions:open')

        if (!(set.module || set.id)) {
          this.handleError('showEditDialog trayOptions:open node._def.set must have a module or id property', {
            set
          })
        }

        if (set.module === "node-red") {
          ns = "node-red";
        } else {
          ns = set.id;
        }
        this._validateStr(ns, 'node._def.set', 'showEditDialog trayOptions:open')

        buildEditForm(nodeProperties.content, "dialog-form", type, ns);

        buildLabelForm(portLabels.content, node);

        prepareEditDialog(node, node._def, "node-input", function () {
          // TODO: i18n jQuery Widget must be instantiated
          // to have i18n factory function avail on all jQuery elements
          trayBody.i18n()
          done();
        });
      },
      close: () => {
        if (RED.view.state() != RED.state.IMPORT_DRAGGING) {
          RED.view.state(RED.state.DEFAULT);
        }
        if (editing_node) {
          RED.sidebar.info.refresh(editing_node);
        }
        RED.workspaces.refresh();
        RED.view.redraw(true);
        editStack.pop();
      },
      show: () => {
        if (editing_node) {
          RED.sidebar.info.refresh(editing_node);
        }
      }
    }
    if (editTrayWidthCache.hasOwnProperty(type)) {
      trayOptions.width = editTrayWidthCache[type];
    }

    if (type === 'subflow') {
      var id = editing_node.type.substring(8);
      trayOptions.buttons.unshift({
        id,
        class: 'leftButton',
        text: RED._("subflow.edit"),
        click: () => {
          RED.workspaces.show(id);
          $("#node-dialog-ok").click();
        }
      });
    }

    RED.tray.show(trayOptions);
    return this
  }
}
