export interface INodeEditor {
  configure()
  getCredentialsURL(nodeType, nodeID)
  /**
   * Validate a node
   * @param node - the node being validated
   * @returns {boolean} whether the node is valid. Sets node.dirty if needed
   */
  validateNode(node)
  /**
   * Validate a node's properties for the given set of property definitions
   * @param node { INode} - the node being validated
   * @param definition { object } - the node property definitions (either def.defaults or def.creds)
   * @param properties { string[] }- the node property values to validate
   * @returns {boolean} whether the node's properties are valid
   */
  validateNodeProperties(node: INode, definition: any, properties: string[])
  /**
   * Validate a individual node property
   * @param node { INode} - the node being validated
   * @param definition { object } - the node property definitions (either def.defaults or def.creds)
   * @param property { string }- the property name being validated
   * @param value { string } - the property value being validated
   * @returns {boolean} whether the node proprty is valid
   */
  validateNodeProperty(node: INode, definition: any, property: string, value: string)
  /**
   * Called when the node's properties have changed.
   * Marks the node as dirty and needing a size check.
   * Removes any links to non-existant outputs.
   * @param node { INode} - the node that has been updated
   * @param outputMap - { object} (optional) a map of old->new port numbers if wires should be moved
   * @returns {array} the links that were removed due to this update
   */
  updateNodeProperties(node: INode, outputMap?: object)
  /**
   * Create a config-node select box for this property
   * @param node - the node being edited
   * @param property - the name of the field
   * @param type - the type of the config-node
   */
  prepareConfigNodeSelect(node, property, type, prefix)

  /**
   * Create a config-node button for this property
   * @param node - the node being edited
   * @param property - the name of the field
   * @param type - the type of the config-node
   */
  prepareConfigNodeButton(node, property, type, prefix)

  /**
   * Populate the editor dialog input field for this property
   * @param node - the node being edited
   * @param property - the name of the field
   * @param prefix - the prefix to use in the input element ids (node-input|node-config-input)
   * @param definition - the definition of the field
   */
  preparePropertyEditor(node, property, prefix, definition)
  /**
   * Add an on-change handler to revalidate a node field
   * @param node - the node being edited
   * @param definition - the definition of the node
   * @param property - the name of the field
   * @param prefix - the prefix to use in the input element ids (node-input|node-config-input)
   */
  attachPropertyChangeHandler(node, definition, property, prefix)

  /**
   * Assign the value to each credential field
   * @param node
   * @param credDef
   * @param credData
   * @param prefix
   */
  populateCredentialsInputs(node, credDef, credData, prefix)

  /**
   * Update the node credentials from the edit form
   * @param node - the node containing the credentials
   * @param credDefinition - definition of the credentials
   * @param prefix - prefix of the input fields
   * @return {boolean} whether anything has changed
   */
  updateNodeCredentials(node, credDefinition, prefix)
  /**
   * Prepare all of the editor dialog fields
   * @param node - the node being edited
   * @param definition - the node definition
   * @param prefix - the prefix to use in the input element ids (node-input|node-config-input)
   */
  prepareEditDialog(node, definition, prefix, done)

  /**
   * get Edit Stack Title
   */
  getEditStackTitle()

  /**
   * build Edit Form
   * @param container
   * @param formId
   * @param type
   * @param ns
   */
  buildEditForm(container, formId, type, ns)
  /**
   * refresh Label Form
   * @param container
   * @param node
   */
  refreshLabelForm(container, node)
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

  /**
   * show Edit Dialog
   * @param node
   */
  showEditDialog(node: INode)

  /**
   * show Edit Config Node Dialog
   * @param name {string} name of the property that holds this config node
   * @param type {string} type of config node
   * @param id {string} id of config node to edit. _ADD_ for a new one
   * @param prefix {string} the input prefix of the parent property
   */
  showEditConfigNodeDialog(name: string, type: string, id: string, prefix: string)

  /**
   * default Config Node Sort
   * @param A
   * @param B
   */
  defaultConfigNodeSort(A, B)

  /**
   * update Config Node Select
   * @param name
   * @param type
   * @param value
   * @param prefix
   */
  updateConfigNodeSelect(name: string, type: string, value: any, prefix: string)

  /**
   * show Edit Subflow Dialog
   * @param subflow
   */
  showEditSubflowDialog(subflow)

  /**
   * edit Buffer
   * @param options
   */
  editBuffer(options: any)

  /**
   * edit Expression
   * @param options
   */
  editExpression(options: any)

  /**
   * edit JSON
   * @param options
   */
  editJSON(options: any)

  /**
   * string To UTF8 Array
   * @param str
   */
  stringToUTF8Array(str)

  /**
   * Create the Node Editor
   */
  createEditor(options)
}
