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
} from '../../../tray'

import {
  marked
} from '../../../_libs'

// TODO: alternatively, load from red-runtime/vendor/jsonata
import { jsonata } from './jsonata/formatter'
import * as ace from 'brace'

const { log } = console
import { Context } from '../../../context'
import { NodeEditorConfiguration } from './configuration';
import { NodeValidator } from './validator';
import { INode } from '../../../../../red-runtime/src/interfaces/index';

import {
  SubflowDialog,
  ConfigNodeDialog
} from './dialog';

import {
  BufferEditor,
  ExpressionEditor,
  JsonEditor
} from './edit';

interface ITabSelect extends JQuery<HTMLElement> {
  i18n: Function
}

export class NodeEditor extends Context {
  public editStack: any[] = []
  public expressionTestCache = {}
  public editTrayWidthCache = {}
  public editing_node: any = null
  public editing_config_node: any = null
  subflowEditor: any

  protected configuration: NodeEditorConfiguration = new NodeEditorConfiguration(this)
  protected nodeValidator: NodeValidator = new NodeValidator(this)

  // dialogs
  protected subflowDialog: SubflowDialog = new SubflowDialog(this)
  protected configNodeDialog: ConfigNodeDialog = new ConfigNodeDialog(this)

  // editors
  protected bufferEditor: BufferEditor = new BufferEditor(this)
  protected exprEditor: ExpressionEditor = new ExpressionEditor(this)
  protected jsonEditor: JsonEditor = new JsonEditor(this)

  constructor() {
    super()
    this.configure()
  }

  configure() {
    this.configuration.configure()
    return this
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
  validateNodeProperties(node: INode, definition: any, properties: string[]) {
    return this.nodeValidator.validateNodeProperties(node, definition, properties)
  }

  /**
   * Validate a individual node property
   * @param node { INode} - the node being validated
   * @param definition { object } - the node property definitions (either def.defaults or def.creds)
   * @param property { string }- the property name being validated
   * @param value { string } - the property value being validated
   * @returns {boolean} whether the node proprty is valid
   */
  validateNodeProperty(node: INode, definition: any, property: string, value: string) {
    return this.nodeValidator.validateNodeProperty(node, definition, property, value)
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

  buildLabelRow(type, index, value, placeHolder) {
    const {
      RED
    } = this

    var result = $('<div>', {
      class: "node-label-form-row"
    });

    if (type === undefined) {
      $('<span>').html(RED._("editor.noDefaultLabel")).appendTo(result);
      result.addClass("node-label-form-none");
    } else {
      this._validateStr(type, 'type', 'buildLabelRow')
      this._validateStrOrNum(index, 'index', 'buildLabelRow')

      result.addClass("");
      var id = "node-label-form-" + type + "-" + index;
      $('<label>', {
        for: id
      }).html((index + 1) + ".").appendTo(result);
      var input = $('<input>', {
        type: "text",
        id: id,
        placeholder: placeHolder
      }).val(value).appendTo(result);
      var clear = $('<button class="editor-button editor-button-small"><i class="fa fa-times"></i></button>').appendTo(result);
      clear.click(function (evt) {
        evt.preventDefault();
        input.val("");
      })
    }
    return result;
  }

  buildLabelForm(container, node) {
    const {
      RED
    } = this

    const {
      buildLabelRow
    } = this.rebind([
        'buildLabelRow'
      ])

    var dialogForm = $('<form class="dialog-form form-horizontal" autocomplete="off"></form>').appendTo(container);

    this._validateJQ(container, 'container', 'buildLabelForm')
    this._validateNode(node, 'node', 'buildLabelForm')

    var inputCount = node.inputs || node._def.inputs || 0;
    var outputCount = node.outputs || node._def.outputs || 0;
    if (node.type === 'subflow') {
      inputCount = node.in.length;
      outputCount = node.out.length;
    }

    var inputLabels = node.inputLabels || [];
    var outputLabels = node.outputLabels || [];

    var inputPlaceholder = node._def.inputLabels ? RED._("editor.defaultLabel") : RED._("editor.noDefaultLabel");
    var outputPlaceholder = node._def.outputLabels ? RED._("editor.defaultLabel") : RED._("editor.noDefaultLabel");

    var i, row;
    $('<div class="form-row"><span data-i18n="editor.labelInputs"></span><div id="node-label-form-inputs"></div></div>').appendTo(dialogForm);
    var inputsDiv = $("#node-label-form-inputs");
    if (inputCount > 0) {
      for (i = 0; i < inputCount; i++) {
        buildLabelRow("input", i, inputLabels[i], inputPlaceholder).appendTo(inputsDiv);
      }
    } else {
      buildLabelRow().appendTo(inputsDiv);
    }
    $('<div class="form-row"><span data-i18n="editor.labelOutputs"></span><div id="node-label-form-outputs"></div></div>').appendTo(dialogForm);
    var outputsDiv = $("#node-label-form-outputs");
    if (outputCount > 0) {
      for (i = 0; i < outputCount; i++) {
        buildLabelRow("output", i, outputLabels[i], outputPlaceholder).appendTo(outputsDiv);
      }
    } else {
      buildLabelRow().appendTo(outputsDiv);
    }
  }

  showEditDialog(node) {
    let {
      RED,
      editStack,
    } = this

    let {
      getEditStackTitle,
      updateNodeCredentials,
      updateNodeProperties,
      validateNode,
      editTrayWidthCache,
      refreshLabelForm,
      buildEditForm,
      buildLabelForm,
      prepareEditDialog,
    } = this.rebind([
        'getEditStackTitle',
        'updateNodeCredentials',
        'updateNodeProperties',
        'validateNode',
        'editTrayWidthCache',
        'refreshLabelForm',
        'buildEditForm',
        'buildLabelForm',
        'prepareEditDialog'
      ])

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
                log("oneditcancel", editing_node.id, editing_node.type, err.toString());
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
              log("oneditsave", editing_node.id, editing_node.type, err.toString());
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
            log("oneditresize", editing_node.id, editing_node.type, err.toString());
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

  /**
   * name - name of the property that holds this config node
   * type - type of config node
   * id - id of config node to edit. _ADD_ for a new one
   * prefix - the input prefix of the parent property
   */
  showEditConfigNodeDialog(name, type, id, prefix) {
    this.configNodeDialog.showEditConfigNodeDialog(name, type, id, prefix)
  }

  defaultConfigNodeSort(A, B) {
    if (A.__label__ < B.__label__) {
      return -1;
    } else if (A.__label__ > B.__label__) {
      return 1;
    }
    return 0;
  }

  updateConfigNodeSelect(name, type, value, prefix) {
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

  showEditSubflowDialog(subflow) {
    this.subflowDialog.showEditSubflowDialog(subflow)
  }

  editBuffer(options) {
    this.bufferEditor.editBuffer(options)
  }

  editExpression(options) {
    this.exprEditor.editExpression(options)
  }

  editJSON(options) {
    this.jsonEditor.editJSON(options)
  }

  stringToUTF8Array(str) {
    this._validateStr(str, 'str', 'stringToUTF8Array')
    var data = [];
    var i = 0,
      l = str.length;
    for (i = 0; i < l; i++) {
      var char = str.charCodeAt(i);
      if (char < 0x80) {
        data.push(char);
      } else if (char < 0x800) {
        data.push(0xc0 | (char >> 6));
        data.push(0x80 | (char & 0x3f));
      } else if (char < 0xd800 || char >= 0xe000) {
        data.push(0xe0 | (char >> 12));
        data.push(0x80 | ((char >> 6) & 0x3f));
        data.push(0x80 | (char & 0x3f));
      } else {
        i++;
        char = 0x10000 + (((char & 0x3ff) << 10) | (str.charAt(i) & 0x3ff));
        data.push(0xf0 | (char >> 18));
        data.push(0x80 | ((char >> 12) & 0x3f));
        data.push(0x80 | ((char >> 6) & 0x3f));
        data.push(0x80 | (char & 0x3f));
      }
    }
    return data;
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
