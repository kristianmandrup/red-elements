export interface INodeValidator {
  /**
     * Validate a node
     * @param node - the node being validated
     * @returns {boolean} whether the node is valid. Sets node.dirty if needed
     */
  validateNode(node)

  /**
   * Called when the node's properties have changed.
   * Marks the node as dirty and needing a size check.
   * Removes any links to non-existant outputs.
   * @param node { INode} - the node that has been updated
   * @param outputMap - { object} (optional) a map of old->new port numbers if wires should be moved
   * @returns {array} the links that were removed due to this update
   */
  validateNodeProperties(node, definition, properties)

  /**
   * Validate a individual node property
   * @param node - the node being validated
   * @param definition - the node property definitions (either def.defaults or def.creds)
   * @param property { string }- the property name being validated
   * @param value { string } - the property value being validated
   * @returns {boolean} whether the node proprty is valid
   */
  validateNodeProperty(node: INode, definition: any, property: string, value: string)

  /**
   * validate all nodes in Node Editor
   * @param node { INode } the node to validate
   * @param prefix { string } the prefix
   */
  validateNodeEditor(node: INode, prefix: string)

  /**
   * validate a single Node Editor Property
   * @param node
   * @param defaults
   * @param property
   * @param prefix
   */
  validateNodeEditorProperty(node: INode, defaults: object, property: string, prefix: string)
}
