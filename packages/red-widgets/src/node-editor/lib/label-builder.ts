import { NodeEditor } from '.'

import {
  Context, $,
  container,
  delegateTarget
} from './_base'

export interface ILabelBuilder {
  /**
     * build Label Row
     * @param type
     * @param index
     * @param value
     * @param placeHolder
     */
  buildLabelRow(type, index, value, placeHolder)

  /**
   * build Label Form
   * @param container
   * @param node
   */
  buildLabelForm(container, node)
}

/**
 * Label Builder for NodeEditor
 */
@delegateTarget({
  container,
})
export class LabelBuilder extends Context implements ILabelBuilder {
  constructor(public editor: NodeEditor) {
    super()
  }

  /**
   * build Label Row
   * @param type
   * @param index
   * @param value
   * @param placeHolder
   */
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

  /**
   * build Label Form
   * @param container
   * @param node
   */
  buildLabelForm(container, node) {
    const {
      RED,
      editor
    } = this

    const {
      buildLabelRow
    } = this.rebind([
        'buildLabelRow'
      ], editor)

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
}
