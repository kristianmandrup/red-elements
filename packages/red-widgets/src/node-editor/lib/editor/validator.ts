import { NodeEditor } from '../'
import { Context, $ } from '../../../common'
import { INode } from '../../../../../red-runtime/src/interfaces/index';

import {
  container,
  delegate
} from '../../../node-editor/lib/container'

@delegate({
  container,
})

/**
 * Node Validator for NodeEditor
 */
export class NodeValidator extends Context {
  constructor(public editor: NodeEditor) {
    super()
  }

  /**
   * Validate a node
   * @param node - the node being validated
   * @returns {boolean} whether the node is valid. Sets node.dirty if needed
   */
  validateNode(node) {
    const {
      RED,
    } = this

    let {
      validateNode,
      validateNodeProperties
    } = this.rebind([
        'validateNode',
        'validateNodeProperties'
      ])

    this._validateNode(node, 'node', 'validateNode')

    var oldValue = node.valid;
    var oldChanged = node.changed;
    node.valid = true;

    var subflow;
    var isValid;
    var hasChanged;
    if (node.type.indexOf("subflow:") === 0) {
      subflow = RED.nodes.subflow(node.type.substring(8));
      isValid = subflow.valid;
      hasChanged = subflow.changed;
      if (isValid === undefined) {
        isValid = validateNode(subflow);
        hasChanged = subflow.changed;
      }
      node.valid = isValid;
      node.changed = node.changed || hasChanged;
    } else if (node._def) {
      node.valid = validateNodeProperties(node, node._def.defaults, node);
      if (node._def._creds) {
        node.valid = node.valid && validateNodeProperties(node, node._def.credentials, node._def._creds);
      }
    } else if (node.type == "subflow") {
      var subflowNodes = RED.nodes.filterNodes({
        z: node.id
      });
      for (var i = 0; i < subflowNodes.length; i++) {
        isValid = subflowNodes[i].valid;
        hasChanged = subflowNodes[i].changed;
        if (isValid === undefined) {
          isValid = validateNode(subflowNodes[i]);
          hasChanged = subflowNodes[i].changed;
        }
        node.valid = node.valid && isValid;
        node.changed = node.changed || hasChanged;
      }
      var subflowInstances = RED.nodes.filterNodes({
        type: "subflow:" + node.id
      });
      var modifiedTabs = {};
      for (i = 0; i < subflowInstances.length; i++) {
        subflowInstances[i].valid = node.valid;
        subflowInstances[i].changed = subflowInstances[i].changed || node.changed;
        subflowInstances[i].dirty = true;
        modifiedTabs[subflowInstances[i].z] = true;
      }
      Object.keys(modifiedTabs).forEach(function (id) {
        var subflow = RED.nodes.subflow(id);
        if (subflow) {
          validateNode(subflow);
        }
      });
    }
    if (oldValue !== node.valid || oldChanged !== node.changed) {
      node.dirty = true;
      subflow = RED.nodes.subflow(node.z);
      if (subflow) {
        validateNode(subflow);
      }
    }
    return node.valid;
  }

  /**
   * Called when the node's properties have changed.
   * Marks the node as dirty and needing a size check.
   * Removes any links to non-existant outputs.
   * @param node { INode} - the node that has been updated
   * @param outputMap - { object} (optional) a map of old->new port numbers if wires should be moved
   * @returns {array} the links that were removed due to this update
   */
  validateNodeProperties(node, definition, properties) {
    let {
      validateNodeProperty
    } = this
    validateNodeProperty = validateNodeProperty.bind(this)

    var isValid = true;
    for (var prop in definition) {
      if (definition.hasOwnProperty(prop)) {
        if (!validateNodeProperty(node, definition, prop, properties[prop])) {
          isValid = false;
        }
      }
    }
    return isValid;
  }

  /**
   * Validate a individual node property
   * @param node - the node being validated
   * @param definition - the node property definitions (either def.defaults or def.creds)
   * @param property { string }- the property name being validated
   * @param value { string } - the property value being validated
   * @returns {boolean} whether the node proprty is valid
   */
  validateNodeProperty(node: INode, definition: any, property: string, value: string) {
    const {
      RED
    } = this

    var valid = true;
    if (/^\$\([a-zA-Z_][a-zA-Z0-9_]*\)$/.test(value)) {
      return true;
    }
    if ("required" in definition[property] && definition[property].required) {
      valid = value !== "";
    }
    if (valid && "validate" in definition[property]) {
      try {
        valid = definition[property].validate.call(node, value);
      } catch (err) {
        this.logInfo("Validation error:", {
          nodeType: node.type,
          nodeId: node.id,
          property,
          value,
          err
        });
      }
    }
    if (valid && definition[property].type && RED.nodes.getType(definition[property].type) && !("validate" in definition[property])) {
      if (!value || value == "_ADD_") {
        valid = definition[property].hasOwnProperty("required") && !definition[property].required;
      } else {
        var configNode = RED.nodes.node(value);
        valid = (configNode !== null && (configNode.valid == null || configNode.valid));
      }
    }
    return valid;
  }

  /**
   * validate all nodes in Node Editor
   * @param node { INode } the node to validate
   * @param prefix { string } the prefix
   */
  validateNodeEditor(node: INode, prefix: string) {
    let {
      validateNodeEditorProperty
    } = this.rebind([
        'validateNodeEditorProperty'
      ])

    this._validateStr(prefix, 'prefix', 'validateNodeEditor')

    for (var prop in node._def.defaults) {
      if (node._def.defaults.hasOwnProperty(prop)) {
        validateNodeEditorProperty(node, node._def.defaults, prop, prefix);
      }
    }
    if (node._def.credentials) {
      for (prop in node._def.credentials) {
        if (node._def.credentials.hasOwnProperty(prop)) {
          validateNodeEditorProperty(node, node._def.credentials, prop, prefix);
        }
      }
    }
    return this
  }

  /**
   * validate a single Node Editor Property
   * @param node
   * @param defaults
   * @param property
   * @param prefix
   */
  validateNodeEditorProperty(node: INode, defaults: object, property: string, prefix: string) {
    let {
      validateNodeProperty
    } = this
    validateNodeProperty = validateNodeProperty.bind(this)

    this._validateStr(prefix, 'prefix', 'validateNodeEditorProperty')
    this._validateStr(property, 'property', 'validateNodeEditorProperty')

    var input = $("#" + prefix + "-" + property);
    if (input.length > 0) {
      var value = String(input.val())
      if (defaults[property].hasOwnProperty("format") && defaults[property].format !== "" && input[0].nodeName === "DIV") {
        value = input.text();
      }
      if (!validateNodeProperty(node, defaults, property, value)) {
        input.addClass("input-error");
      } else {
        input.removeClass("input-error");
      }
    }
    return this
  }
}
