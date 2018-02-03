import {
  Context,
  DiffPanel
} from './_base'

export interface IDiffPanelUtils {
  /**
     * create Node Icon
     * @param node
     * @param def
     */
  createNodeIcon(node, def)

  /**
   * create Node
   * @param node
   * @param def
   */
  createNode(node, def)
}

/**
 *
 */
export class DiffPanelUtils extends Context implements IDiffPanelUtils {
  constructor(public diffPanel: DiffPanel) {
    super()
  }

  get diff() {
    return this.diffPanel.diff
  }

  /**
   * create Node Icon
   * @param node
   * @param def
   */
  createNodeIcon(node, def) {
    const {
      RED
    } = this

    var nodeDiv = $("<div>", {
      class: "node-diff-node-entry-node"
    });
    var colour = def.color;
    var icon_url = RED.utils.getNodeIcon(def, node);
    if (node.type === 'tab') {
      colour = "#C0DEED";
    }
    nodeDiv.css('backgroundColor', colour);

    var iconContainer = $('<div/>', {
      class: "palette_icon_container"
    }).appendTo(nodeDiv);
    $('<div/>', {
      class: "palette_icon",
      style: "background-image: url(" + icon_url + ")"
    }).appendTo(iconContainer);

    return nodeDiv;
  }

  /**
   * create Node
   * @param node
   * @param def
   */
  createNode(node, def) {
    const {
      createNodeIcon
    } = this.rebind([
        'createNodeIcon'
      ])

    var nodeTitleDiv = $("<div>", {
      class: "node-diff-node-entry-title"
    })
    createNodeIcon(node, def).appendTo(nodeTitleDiv);
    var contentDiv = $('<div>', {
      class: "node-diff-node-description"
    }).appendTo(nodeTitleDiv);
    var nodeLabel = node.label || node.name || node.id;
    $('<span>', {
      class: "node-diff-node-label"
    }).html(nodeLabel).appendTo(contentDiv);
    return nodeTitleDiv;
  }
}
