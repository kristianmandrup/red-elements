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
  Tray
} from '../../tray'

import {
  marked
} from '../../_libs'

// TODO: alternatively, load from red-runtime/vendor/jsonata
import { jsonata } from './jsonata/formatter'
import * as ace from 'brace'

import { NodeEditorConfiguration } from './configuration'
import { NodeValidator } from './validator'
import { INode } from '../../_interfaces'

import {
  Context,
  container,
  delegates,
  callDelegate
} from './_base'

import {
  SubflowDialog,
  ConfigNodeDialog,
  EditDialog
} from './dialog';

import {
  BufferEditor,
  ExpressionEditor,
  JsonEditor
} from './edit';
import { LabelBuilder } from './label-builder';
import { EditorUtils } from './editor-utils';

interface ITabSelect extends JQuery<HTMLElement> {
  i18n: Function
}

@delegates({
  container,
  map: {
    configuration: NodeEditorConfiguration,
    nodeValidator: NodeValidator,
    labelBuilder: LabelBuilder,
    utils: EditorUtils,
    subflowDialog: SubflowDialog,
    configNodeDialog: ConfigNodeDialog,
    editDialog: EditDialog,
    bufferEditor: BufferEditor,
    exprEditor: ExpressionEditor,
    jsonEditor: JsonEditor
  }
})
export class NodeEditor extends Context {
  public editStack: any[] = []
  public expressionTestCache = {}
  public editTrayWidthCache = {}
  public editing_node: any = null
  public editing_config_node: any = null
  subflowEditor: any

  protected configuration: NodeEditorConfiguration // = new NodeEditorConfiguration(this)
  protected nodeValidator: NodeValidator // = new NodeValidator(this)
  protected labelBuilder: LabelBuilder // = new LabelBuilder(this)
  protected utils: EditorUtils // = new EditorUtils(this)

  // dialogs
  protected subflowDialog: SubflowDialog // = new SubflowDialog(this)
  protected configNodeDialog: ConfigNodeDialog // = new ConfigNodeDialog(this)
  protected editDialog: EditDialog // = new EditDialog(this)

  // editors
  protected bufferEditor: BufferEditor // = new BufferEditor(this)
  protected exprEditor: ExpressionEditor // = new ExpressionEditor(this)
  protected jsonEditor: JsonEditor // = new JsonEditor(this)

  constructor() {
    super()
    this.configure()
  }

  @callDelegate('configuration')
  configure() {
    // this.configuration.configure()
    // return this
  }

  getCredentialsURL(nodeType, nodeID) {
    const dashedType = nodeType.replace(/\s+/g, '-');
    return 'credentials/' + dashedType + "/" + nodeID;
  }


  /**
   * Validate a node
   * @param node - the node being validated
   * @returns {boolean} whether the node is valid. Sets node.dirty if needed
   */
  @callDelegate('nodeValidator')
  validateNode(node) {
    return this.nodeValidator.validateNode(node)
  }

  /**
   * Validate a node's properties for the given set of property definitions
   * @param node { INode} - the node being validated
   * @param definition { object } - the node property definitions (either def.defaults or def.creds)
   * @param properties { string[] }- the node property values to validate
   * @returns {boolean} whether the node's properties are valid
   */
  @callDelegate('nodeValidator')
  validateNodeProperties(node: INode, definition: any, properties: string[]) {
    // return this.nodeValidator.validateNodeProperties(node, definition, properties)
  }

  /**
   * Validate a individual node property
   * @param node { INode} - the node being validated
   * @param definition { object } - the node property definitions (either def.defaults or def.creds)
   * @param property { string }- the property name being validated
   * @param value { string } - the property value being validated
   * @returns {boolean} whether the node proprty is valid
   */
  @callDelegate('nodeValidator')
  validateNodeProperty(node: INode, definition: any, property: string, value: string) {
    // return this.nodeValidator.validateNodeProperty(node, definition, property, value)
  }

  /**
   * Called when the node's properties have changed.
   * Marks the node as dirty and needing a size check.
   * Removes any links to non-existant outputs.
   * @param node { INode} - the node that has been updated
   * @param outputMap - { object} (optional) a map of old->new port numbers if wires should be moved
   * @returns {array} the links that were removed due to this update
   */
  updateNodeProperties(node: INode, outputMap?: object) {
    const {
      RED
    } = this

    node.resize = true;
    node.dirty = true;
    var removedLinks = [];
    if (node.ports) {
      if (outputMap) {
        RED.nodes.eachLink(function (l) {
          if (l.source === node && outputMap.hasOwnProperty(l.sourcePort)) {
            if (outputMap[l.sourcePort] === "-1") {
              removedLinks.push(l);
            } else {
              l.sourcePort = outputMap[l.sourcePort];
            }
          }
        });
      }
      if (node.outputs < node.ports.length) {
        while (node.outputs < node.ports.length) {
          node.ports.pop();
        }
        RED.nodes.eachLink(function (l) {
          if (l.source === node && l.sourcePort >= node.outputs && removedLinks.indexOf(l) === -1) {
            removedLinks.push(l);
          }
        });
      } else if (node.outputs > node.ports.length) {
        while (node.outputs > node.ports.length) {
          node.ports.push(node.ports.length);
        }
      }
    }
    if (node.inputs === 0) {
      removedLinks.concat(RED.nodes.filterLinks({
        target: node
      }));
    }
    for (var l = 0; l < removedLinks.length; l++) {
      RED.nodes.removeLink(removedLinks[l]);
    }
    return removedLinks;
  }

  /**
   * Create a config-node select box for this property
   * @param node - the node being edited
   * @param property - the name of the field
   * @param type - the type of the config-node
   */
  prepareConfigNodeSelect(node, property, type, prefix) {
    const {
      RED
    } = this

    const {
      updateConfigNodeSelect,
      showEditConfigNodeDialog,
    } = this.rebind([
        'updateConfigNodeSelect',
        'showEditConfigNodeDialog'
      ])

    this._validateStr(prefix, 'prefix', 'prepareConfigNodeSelect')
    this._validateStr(property, 'property', 'prepareConfigNodeSelect')

    var selector = "#" + prefix + "-" + property
    var input = $(selector);
    if (input.length === 0) {
      this.logWarning('prepareConfigNodeSelect: no such input found', {
        selector
      })
      return this;
    }
    var newWidth: string | number = input.width();
    var attrStyle = input.attr('style');
    var m;
    if ((m = /width\s*:\s*(\d+(%|[a-z]+))/i.exec(attrStyle)) !== null) {
      newWidth = m[1];
    } else {
      newWidth = "70%";
    }
    var outerWrap = $("<div></div>").css({
      display: 'inline-block',
      position: 'relative'
    });
    var selectWrap = $("<div></div>").css({
      position: 'absolute',
      left: 0,
      right: '40px'
    }).appendTo(outerWrap);
    var select = $('<select id="' + prefix + '-' + property + '"></select>').appendTo(selectWrap);

    outerWrap.width(newWidth).height(input.height());
    if (outerWrap.width() === 0) {
      outerWrap.width("70%");
    }
    input.replaceWith(outerWrap);
    // set the style attr directly - using width() on FF causes a value of 114%...
    select.attr('style', "width:100%");
    updateConfigNodeSelect(property, type, node[property], prefix);
    $('<a id="' + prefix + '-lookup-' + property + '" class="editor-button"><i class="fa fa-pencil"></i></a>')
      .css({
        position: 'absolute',
        right: 0,
        top: 0
      })
      .appendTo(outerWrap);
    $('#' + prefix + '-lookup-' + property).click(function (e) {
      showEditConfigNodeDialog(property, type, select.find(":selected").val(), prefix);
      e.preventDefault();
    });
    var label = "";
    var configNode = RED.nodes.node(node[property]);
    var node_def = RED.nodes.getType(type);

    if (configNode) {
      label = RED.utils.getNodeLabel(configNode, configNode.id);
    }
    input.val(label);

    return this
  }

  /**
   * Create a config-node button for this property
   * @param node - the node being edited
   * @param property - the name of the field
   * @param type - the type of the config-node
   */
  prepareConfigNodeButton(node, property, type, prefix) {
    const {
      RED,
    } = this

    const {
      showEditConfigNodeDialog
    } = this.rebind([
        'showEditConfigNodeDialog'
      ])

    this._validateStr(prefix, 'prefix', 'prepareConfigNodeButton')
    this._validateStr(property, 'property', 'prepareConfigNodeButton')

    var input = $("#" + prefix + "-" + property);
    var selector = "#" + prefix + "-" + property
    var input = $(selector);
    if (input.length === 0) {
      this.logWarning('prepareConfigNodeButton: no such input', {
        selector
      })
      return this;
    }

    input.val(node[property]);
    input.attr("type", "hidden");

    var button = $("<a>", {
      id: prefix + "-edit-" + property,
      class: "editor-button"
    });
    input.after(button);

    if (node[property]) {
      button.text(RED._("editor.configEdit"));
    } else {
      button.text(RED._("editor.configAdd"));
    }

    button.click(function (e) {
      showEditConfigNodeDialog(property, type, input.val() || "_ADD_", prefix);
      e.preventDefault();
    });
    return this
  }

  /**
   * Populate the editor dialog input field for this property
   * @param node - the node being edited
   * @param property - the name of the field
   * @param prefix - the prefix to use in the input element ids (node-input|node-config-input)
   * @param definition - the definition of the field
   */
  preparePropertyEditor(node, property, prefix, definition) {
    const {
      RED
    } = this

    this._validateStr(prefix, 'prefix', 'preparePropertyEditor')
    this._validateStr(property, 'property', 'preparePropertyEditor')
    this._validateObj(definition, 'definition', 'preparePropertyEditor')

    var selector = "#" + prefix + "-" + property
    var input = $(selector);
    if (input.length === 0) {
      this.logWarning('preparePropertyEditor: no such element', {
        selector
      })
      return this;
    }
    if (input.attr('type') === "checkbox") {
      input.prop('checked', node[property]);
    } else {
      var val = node[property];
      if (val == null) {
        val = "";
      }
      if (definition !== undefined && definition[property].hasOwnProperty("format") && definition[property].format !== "" && input[0].nodeName === "DIV") {
        input.html(RED.text.format.getHtml(val, definition[property].format, {}, false, "en"));
        RED.text.format.attach(input[0], definition[property].format, {}, false, "en");
      } else {
        input.val(val);
        if (input[0].nodeName === 'INPUT' || input[0].nodeName === 'TEXTAREA') {
          RED.text.bidi.prepareInput(input);
        }
      }
    }
    return this
  }

  /**
   * Add an on-change handler to revalidate a node field
   * @param node - the node being edited
   * @param definition - the definition of the node
   * @param property - the name of the field
   * @param prefix - the prefix to use in the input element ids (node-input|node-config-input)
   */
  attachPropertyChangeHandler(node, definition, property, prefix) {
    const {
      validateNodeEditor
    } = this.rebind([
        'validateNodeEditor'
      ])

    this._validateStr(prefix, 'prefix', 'attachPropertyChangeHandler')
    this._validateStr(property, 'property', 'attachPropertyChangeHandler')

    this._validateObj(definition, 'definition', 'attachPropertyChangeHandler')

    var input = $("#" + prefix + "-" + property);

    var selector = "#" + prefix + "-" + property
    var input = $(selector);
    if (input.length === 0) {
      this.logWarning('attachPropertyChangeHandler: no such input', {
        selector
      })
      return this;
    }

    if (definition !== undefined && "format" in definition[property] && definition[property].format !== "" && input[0].nodeName === "DIV") {
      $("#" + prefix + "-" + property).on('change keyup', function (event, skipValidation) {
        if (!skipValidation) {
          validateNodeEditor(node, prefix);
        }
      });
    } else {
      $("#" + prefix + "-" + property).change(function (event, skipValidation) {
        if (!skipValidation) {
          validateNodeEditor(node, prefix);
        }
      });
    }
    return this
  }

  /**
   * Assign the value to each credential field
   * @param node
   * @param credDef
   * @param credData
   * @param prefix
   */
  populateCredentialsInputs(node, credDef, credData, prefix) {
    this._validateStr(prefix, 'prefix', 'populateCredentialsInputs')

    for (let cred in credDef) {
      if (credDef.hasOwnProperty(cred)) {
        if (credDef[cred].type == 'password') {
          if (credData[cred]) {
            $('#' + prefix + '-' + cred).val(credData[cred]);
          } else if (credData['has_' + cred]) {
            $('#' + prefix + '-' + cred).val('__PWRD__');
          } else {
            $('#' + prefix + '-' + cred).val('');
          }
        } else {
          this.preparePropertyEditor(credData, cred, prefix, credDef);
        }
        this.attachPropertyChangeHandler(node, credDef, cred, prefix);
      }
    }
  }

  /**
   * Update the node credentials from the edit form
   * @param node - the node containing the credentials
   * @param credDefinition - definition of the credentials
   * @param prefix - prefix of the input fields
   * @return {boolean} whether anything has changed
   */
  updateNodeCredentials(node, credDefinition, prefix) {
    var changed = false;
    this._validateStr(prefix, 'prefix', 'updateNodeCredentials')

    if (!node.credentials) {
      node.credentials = {
        _: {}
      };
    }

    for (var cred in credDefinition) {
      if (credDefinition.hasOwnProperty(cred)) {
        var input = $("#" + prefix + '-' + cred);
        var value = input.val();
        if (credDefinition[cred].type == 'password') {
          node.credentials['has_' + cred] = (value !== "");
          if (value == '__PWRD__') {
            continue;
          }
          changed = true;

        }
        node.credentials[cred] = value;
        if (value != node.credentials._[cred]) {
          changed = true;
        }
      }
    }
    return changed;
  }

  /**
   * Prepare all of the editor dialog fields
   * @param node - the node being edited
   * @param definition - the node definition
   * @param prefix - the prefix to use in the input element ids (node-input|node-config-input)
   */
  prepareEditDialog(node, definition, prefix, done) {
    const {
      RED
    } = this

    const {
      prepareConfigNodeButton,
      prepareConfigNodeSelect,
      preparePropertyEditor,
      attachPropertyChangeHandler,
      validateNodeEditor,
      populateCredentialsInputs,
      getCredentialsURL
    } = this.rebind([
        'prepareConfigNodeButton',
        'prepareConfigNodeSelect',
        'preparePropertyEditor',
        'attachPropertyChangeHandler',
        'validateNodeEditor',
        'populateCredentialsInputs',
        'getCredentialsURL'
      ])

    this._validateStr(prefix, 'prefix', 'prepareEditDialog')
    this._validateNodeDef(definition, 'definition', 'prepareEditDialog')

    for (var d in definition.defaults) {
      if (definition.defaults.hasOwnProperty(d)) {
        if (definition.defaults[d].type) {
          var configTypeDef = RED.nodes.getType(definition.defaults[d].type);
          if (configTypeDef) {
            if (configTypeDef.exclusive) {
              prepareConfigNodeButton(node, d, definition.defaults[d].type, prefix);
            } else {
              prepareConfigNodeSelect(node, d, definition.defaults[d].type, prefix);
            }
          } else {
            log("Unknown type:", definition.defaults[d].type);
            preparePropertyEditor(node, d, prefix, definition.defaults);
          }
        } else {
          preparePropertyEditor(node, d, prefix, definition.defaults);
        }
        attachPropertyChangeHandler(node, definition.defaults, d, prefix);
      }
    }
    var completePrepare = function () {
      if (definition.oneditprepare) {
        try {
          definition.oneditprepare.call(node);
        } catch (err) {
          log("oneditprepare", node.id, node.type, err.toString());
        }
      }
      // Now invoke any change handlers added to the fields - passing true
      // to prevent full node validation from being triggered each time
      for (var d in definition.defaults) {
        if (definition.defaults.hasOwnProperty(d)) {
          $("#" + prefix + "-" + d).trigger("change", [true]);
        }
      }
      if (definition.credentials) {
        for (d in definition.credentials) {
          if (definition.credentials.hasOwnProperty(d)) {
            $("#" + prefix + "-" + d).trigger("change", [true]);
          }
        }
      }
      validateNodeEditor(node, prefix);
      if (done) {
        done(true);
      }
      return this
    }

    if (definition.credentials) {
      if (node.credentials) {
        populateCredentialsInputs(node, definition.credentials, node.credentials, prefix);
      } else {
        $.getJSON(getCredentialsURL(node.type, node.id), function (data) {
          node.credentials = data;
          node.credentials._ = $.extend(true, {}, data);
          populateCredentialsInputs(node, definition.credentials, node.credentials, prefix);
        });
      }
    }
    return completePrepare();
  }

  /**
   * get Edit Stack Title
   */
  getEditStackTitle() {
    const {
      RED,
      editStack
    } = this

    var title = '<ul class="editor-tray-breadcrumbs">';
    for (var i = 0; i < editStack.length; i++) {
      var node = editStack[i];
      this._validateNode(node, 'node', 'getEditStackTitle:iterate')

      var label = node.type;
      if (node.type === '_expression') {
        label = RED._("expressionEditor.title");
      } else if (node.type === '_json') {
        label = RED._("jsonEditor.title");
      } else if (node.type === '_buffer') {
        label = RED._("bufferEditor.title");
      } else if (node.type === 'subflow') {
        label = RED._("subflow.editSubflow", {
          name: node.name
        })
      } else if (node.type.indexOf("subflow:") === 0) {
        var subflow = RED.nodes.subflow(node.type.substring(8));
        label = RED._("subflow.editSubflow", {
          name: subflow.name
        })
      } else {
        if (typeof node._def.paletteLabel !== "undefined") {
          try {
            label = (typeof node._def.paletteLabel === "function" ? node._def.paletteLabel.call(node._def) : node._def.paletteLabel) || "";
          } catch (err) {
            log("Definition error: " + node.type + ".paletteLabel", err);
          }
        }
        if (i === editStack.length - 1) {
          if (RED.nodes.node(node.id)) {
            label = RED._("editor.editNode", {
              type: label
            });
          } else {
            label = RED._("editor.addNewConfig", {
              type: label
            });
          }
        }
      }
      title += '<li>' + label + '</li>';
    }
    title += '</ul>';
    return title;
  }

  /**
   * build Edit Form
   * @param container
   * @param formId
   * @param type
   * @param ns
   */
  buildEditForm(container, formId, type, ns) {
    let form = $('<form id="' + formId + '" class="form-horizontal" autocomplete="off"></form>')
    this._validateJQ(container, 'container', 'buildEditForm')

    var dialogForm = form.appendTo(container);

    dialogForm.html($("script[data-template-name='" + type + "']").html());
    ns = ns || "node-red";
    let i18nFields = dialogForm.find('[data-i18n]')
    i18nFields.each(function () {
      var current = $(this).attr("data-i18n");
      var keys = current.split(";");
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.indexOf(":") === -1) {
          var prefix = "";
          if (key.indexOf("[") === 0) {
            var parts = key.split("]");
            prefix = parts[0] + "]";
            key = parts[1];
          }
          keys[i] = prefix + ns + ":" + key;
        }
      }
      $(this).attr("data-i18n", keys.join(";"));
    });
    // Add dummy fields to prevent 'Enter' submitting the form in some
    // cases, and also prevent browser auto-fill of password
    // Add in reverse order as they are prepended...
    $('<input type="password" style="display: none;" />').prependTo(dialogForm);
    $('<input type="text" style="display: none;" />').prependTo(dialogForm);
    dialogForm.submit(function (e) {
      e.preventDefault();
    });
    return dialogForm;
  }

  /**
   * refresh Label Form
   * @param container
   * @param node
   */
  refreshLabelForm(container, node) {
    let {
      RED,
    } = this

    const {
      buildLabelRow,
      updateNodeProperties
    } = this.rebind([
        'buildLabelRow',
        'updateNodeProperties'
      ])

    this._validateNode(node, 'node', 'refreshLabelForm')

    var inputPlaceholder = node._def.inputLabels ? RED._("editor.defaultLabel") : RED._("editor.noDefaultLabel");
    var outputPlaceholder = node._def.outputLabels ? RED._("editor.defaultLabel") : RED._("editor.noDefaultLabel");

    var inputsDiv = $("#node-label-form-inputs");
    var outputsDiv = $("#node-label-form-outputs");

    var inputCount = node.inputs || node._def.inputs || 0;
    var children = inputsDiv.children();
    var childCount = children.length;
    if (childCount === 1 && $(children[0]).hasClass('node-label-form-none')) {
      childCount--;
    }

    if (childCount < inputCount) {
      if (childCount === 0) {
        // remove the 'none' placeholder
        $(children[0]).remove();
      }
      for (i = childCount; i < inputCount; i++) {
        buildLabelRow("input", i, "", inputPlaceholder).appendTo(inputsDiv);
      }
    } else if (childCount > inputCount) {
      for (i = inputCount; i < childCount; i++) {
        $(children[i]).remove();
      }
      if (outputCount === 0) {
        buildLabelRow().appendTo(inputsDiv);
      }
    }

    var outputCount;
    var i;
    var formOutputs: any = $("#node-input-outputs").val();

    if (formOutputs === undefined) {
      outputCount = node.outputs || node._def.outputs || 0;
    } else if (isNaN(formOutputs)) {
      var outputMap = JSON.parse(formOutputs);
      var keys = Object.keys(outputMap);
      children = outputsDiv.children();
      childCount = children.length;
      if (childCount === 1 && $(children[0]).hasClass('node-label-form-none')) {
        childCount--;
      }

      outputCount = 0;
      var rows = [];
      keys.forEach(function (p) {
        var row = $("#node-label-form-output-" + p).parent();
        if (row.length === 0 && outputMap[p] !== -1) {
          if (childCount === 0) {
            $(children[0]).remove();
            childCount = -1;
          }
          row = buildLabelRow("output", p, "", outputPlaceholder);
        } else {
          row.detach();
        }
        if (outputMap[p] !== -1) {
          outputCount++;
          rows.push({
            i: parseInt(outputMap[p]),
            r: row
          });
        }
      });
      rows.sort(function (A, B) {
        return A.i - B.i;
      })
      rows.forEach(function (r, i) {
        r.r.find("label").html((i + 1) + ".");
        r.r.appendTo(outputsDiv);
      })
      if (rows.length === 0) {
        buildLabelRow("output", i, "").appendTo(outputsDiv);
      } else {

      }
    } else {
      outputCount = Math.max(0, parseInt(formOutputs));
    }
    children = outputsDiv.children();
    childCount = children.length;
    if (childCount === 1 && $(children[0]).hasClass('node-label-form-none')) {
      childCount--;
    }
    if (childCount < outputCount) {
      if (childCount === 0) {
        // remove the 'none' placeholder
        $(children[0]).remove();
      }
      for (i = childCount; i < outputCount; i++) {
        buildLabelRow("output", i, "").appendTo(outputsDiv);
      }
    } else if (childCount > outputCount) {
      for (i = outputCount; i < childCount; i++) {
        $(children[i]).remove();
      }
      if (outputCount === 0) {
        buildLabelRow().appendTo(outputsDiv);
      }
    }
    return this
  }

  /**
   * build Label Row
   * @param type
   * @param index
   * @param value
   * @param placeHolder
   */
  @callDelegate('labelBuilder')
  buildLabelRow(type, index, value, placeHolder) {
    // this.labelBuilder.buildLabelRow(type, index, value, placeHolder)
  }

  /**
   * build Label Form
   * @param container
   * @param node
   */
  @callDelegate('labelBuilder')
  buildLabelForm(container, node) {
    // this.labelBuilder.buildLabelForm(container, node)
  }

  /**
   * show Edit Dialog
   * @param node
   */
  @callDelegate('editDialog')
  showEditDialog(node: INode) {
    // this.editDialog.showEditDialog(node)
  }

  /**
   * show Edit Config Node Dialog
   * @param name {string} name of the property that holds this config node
   * @param type {string} type of config node
   * @param id {string} id of config node to edit. _ADD_ for a new one
   * @param prefix {string} the input prefix of the parent property
   */
  @callDelegate('configNodeDialog')
  showEditConfigNodeDialog(name: string, type: string, id: string, prefix: string) {
    this.configNodeDialog.showEditConfigNodeDialog(name, type, id, prefix)
  }

  /**
   * default Config Node Sort
   * @param A
   * @param B
   */
  defaultConfigNodeSort(A, B) {
    if (A.__label__ < B.__label__) {
      return -1;
    } else if (A.__label__ > B.__label__) {
      return 1;
    }
    return 0;
  }

  /**
   * update Config Node Select
   * @param name
   * @param type
   * @param value
   * @param prefix
   */
  updateConfigNodeSelect(name: string, type: string, value: any, prefix: string) {
    const {
      RED,
      defaultConfigNodeSort
    } = this
    // if prefix is null, there is no config select to update
    if (prefix) {
      var button = $("#" + prefix + "-edit-" + name);
      if (button.length) {
        if (value) {
          button.text(RED._("editor.configEdit"));
        } else {
          button.text(RED._("editor.configAdd"));
        }
        $("#" + prefix + "-" + name).val(value);
      } else {

        var select = $("#" + prefix + "-" + name);
        var node_def = RED.nodes.getType(type);
        select.children().remove();

        var activeWorkspace = RED.nodes.workspace(RED.workspaces.active());
        if (!activeWorkspace) {
          activeWorkspace = RED.nodes.subflow(RED.workspaces.active());
        }

        var configNodes = [];

        RED.nodes.eachConfig(function (config) {
          if (config.type == type && (!config.z || config.z === activeWorkspace.id)) {
            var label = RED.utils.getNodeLabel(config, config.id);
            config.__label__ = label;
            configNodes.push(config);
          }
        });
        var configSortFn = defaultConfigNodeSort;
        if (typeof node_def.sort == "function") {
          configSortFn = node_def.sort;
        }
        try {
          configNodes.sort(configSortFn);
        } catch (err) {
          log("Definition error: " + node_def.type + ".sort", err);
        }

        configNodes.forEach(function (cn) {
          select.append('<option value="' + cn.id + '"' + (value == cn.id ? " selected" : "") + '>' + RED.text.bidi.enforceTextDirectionWithUCC(cn.__label__) + '</option>');
          delete cn.__label__;
        });

        select.append('<option value="_ADD_"' + (value === "" ? " selected" : "") + '>' + RED._("editor.addNewType", {
          type: type
        }) + '</option>');
        window.setTimeout(function () {
          select.change();
        }, 50);
      }
    }
    return this
  }

  /**
   * show Edit Subflow Dialog
   * @param subflow
   */
  @callDelegate('subflowDialog')
  showEditSubflowDialog(subflow) {
    this.subflowDialog.showEditSubflowDialog(subflow)
  }

  /**
   * edit Buffer
   * @param options
   */
  @callDelegate('bufferEditor')
  editBuffer(options: any) {
    this.bufferEditor.editBuffer(options)
  }

  /**
   * edit Expression
   * @param options
   */
  editExpression(options: any) {
    this.exprEditor.editExpression(options)
  }

  /**
   * edit JSON
   * @param options
   */
  editJSON(options: any) {
    this.jsonEditor.editJSON(options)
  }

  /**
   * string To UTF8 Array
   * @param str
   */
  stringToUTF8Array(str) {
    this.utils.stringToUTF8Array(str)
  }

  createEditor(options) {
    const { id } = options

    // validate that we provide ID option with name of ACE editor element
    this._validateStr(id, 'options.id', 'createEditor')

    // validate that an element with that ID exists on page
    let elem = $('#' + id)
    this._validateJQ(elem, 'ace.editor', 'createEditor', 'missing ace editor element on page')

    var editor = ace.edit(id);
    editor.setTheme("ace/theme/tomorrow");
    var session: any = editor.getSession();

    if (options.mode) {
      session.setMode(options.mode);
    }
    if (options.foldStyle) {
      session.setFoldStyle(options.foldStyle);
    } else {
      session.setFoldStyle('markbeginend');
    }
    if (options.options) {
      editor.setOptions(options.options);
    } else {
      editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true
      });
    }
    if (options.readOnly) {
      editor.setOption('readOnly', options.readOnly);
      editor.container.classList.add("ace_read-only");
    }
    if (options.hasOwnProperty('lineNumbers')) {
      const setOption = editor.renderer['setOption']
      if (!setOption) {
        this.handleError('createEditor: renderer missing method setOption', {
          renderer: editor.renderer
        })
      }

      setOption('showGutter', options.lineNumbers);
    }
    editor.$blockScrolling = Infinity;
    if (options.value) {
      // note: the ace editor needs to be linked
      // to an input field on the page where the editor session value
      // can be read from and written to

      // make sure value we are setting is a string (ie. some source code)
      this._validateStr(options.value, 'options.value', 'createEditor')

      session.setValue(options.value, -1);
    }
    if (options.globals) {
      setTimeout(function () {
        if (!!session.$worker) {
          session.$worker.send("setOptions", [{
            globals: options.globals,
            esversion: 6
          }]);
        }
      }, 100);
    }
    return editor;
  }
}
