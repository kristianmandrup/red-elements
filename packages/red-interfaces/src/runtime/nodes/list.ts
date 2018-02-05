import {
  INode,
  ILink,
  INodeDef,
  INodeSet,
  INodesRegistry
} from '.'

import {
  IFlow,
  IWorkspace,
  ISubflow,
} from '..'

export interface INodes {
  registry: INodesRegistry
  configNodes: any
  nodes: INode[]
  links: ILink[]
  workspaces: any // workspace map?
  workspacesOrder: string[] // order of workspace ids
  subflows: any
  n: INode
  initialLoad: any
  loadedFlowVersion: string
  defaultWorkspace: any // IWorkspace
  version: number

  // TODO: alias method?
  subflow(id: string)
  // TODO: alias method?
  import(config: Object)
  setVersion(revision: number)

  // TODO: alias method?
  node(id: string)
  // TODO: alias method?
  remove(id: string)
  // TODO: alias method?
  add(node: INode)

  setNodeList(list: INode[])
  getNodeSet(id: string)
  addNodeSet(ns: INodeSet)
  removeNodeSet(id: string)
  enableNodeSet(id: string)
  disableNodeSet(id: string)

  registerType(nt: string, def: any)

  getType(nt: string)

  /**
   * Converts the current node selection to an exportable JSON Object
   * @param set { Node[] } set of nodes to export
   * @param exportedSubflows { object } map of subflows by ID to be exported
   * @param exportedConfigNodes { object } map of config nodes by ID to be exported
   */
  createExportableNodeSet(set: INode[], exportedSubflows?: object, exportedConfigNodes?: object)

  /**
   * Create a complete node set for export
   * @param exportCredentials { boolean } whether credentials should also be exported
   */
  createCompleteNodeSet(exportCredentials?: boolean)

  /**
   * Import nodes from a string (JSON serialization) reprepresentation
   * @param newNodesObj { Node } the node definitions to import
   * @param createNewIds { boolean } create IDs of imported nodes if not in import definitions
   * @param createMissingWorkspace { boolean } create missing workspace if no such workspace exists
   */
  importNodes?(newNodesObj: string, createNewIds?: boolean, createMissingWorkspace?: boolean)

  /**
   * Convert a node to a workspace
   * @param n { Node } the node to convert
   */
  convertWorkspace(n: INode): IWorkspace

  /**
   * Converts a node to an exportable JSON Object
   * @param n { Node } the node to convert
   * @param exportCreds { boolean } if node (user) credentials should also be exported
   **/
  convertNode(n: INode, exportCreds?: boolean): INode

  /**
   * Convert a node to a Subflow
   * @param n { Node } node to convert
   */
  convertSubflow(n: INode): ISubflow

  /**
   * Filter nodes based on a filter criteria
   * @param filter { object } filter criteria (Node) all filtered nodes must match
   */
  filterNodes(filter: any): INode[]

  /**
   * Filter links based on a filter criteria
   * @param filter { any object } filter criteria (Link props) all filtered links must match
   */
  filterLinks(filter: any): ILink[]

  /**
   * Add a Subflow of nodes
   * @param sf { Subflow } subflow to add
   * @param createNewIds { boolean } whether to create new node IDs as well
   */
  addSubflow(sf: ISubflow, createNewIds?: boolean): INodes

  /**
   * Get a subflow by ID
   * @param id { string } ID of subflow to get
   */
  getSubflow?(id: string): ISubflow

  /**
   * Remove a subflow
   * @param sf { string | Subflow } subflow to remove
   */
  removeSubflow(sf: string | ISubflow): INodes

  /**
   * Test if subflow contains a node with a specific ID
   * @param sfid { Subflow } subflow to test on
   * @param nodeid { string } node ID to test each node in flow for
   * @returns { boolean } whether subflow contains node with given ID
   */
  subflowContains(sfid: string, nodeid: string): boolean

  /**
   * Get all the flow nodes related to a node
   * @param node { Node } the node to find all flow nodes from
   * @returns { Node[] } all the flow nodes found for the node
   */
  getAllFlowNodes(node: INode): INode[]

  /**
   * get/set the flow version
   * @param version { string } version of flow
   * @returns { string } flow version
   */
  flowVersion(version): string

  /**
   * Return the original flow definition
   * @param flow { IFlow } the flow
   */
  originalFlow(flow?: IFlow)

  /**
   * Iterate all nodes
   * @param cb { function } For each iterated node, call this callback function
   */
  eachNode(cb: Function): void

  /**
   * Iterate all links
   * @param cb { function } For each iterated link, call this callback function
   */
  eachLink(cb: Function): void

  /**
   * Iterate all config nodes
   * @param cb { function } For each iterated config node, call this callback function
   */
  eachConfig(cb: Function): void

  /**
   * Iterate all subflows
   * @param cb { function } For each iterated subflow, call this callback function
   */
  eachSubflow(cb: Function): void

  /**
   * Iterate all workspaces
   * @param cb { function } For each iterated workspace, call this callback function
   */
  eachWorkspace(cb: Function): void

  /**
   * Remove a link
   * @param link {string} link to remove
   */
  removeLink(link: ILink)

  /**
   * Add a link
   * @param link {string} link to add
   */
  addLink(link: ILink)

  /**
   * Check if a subflow has a node that matches a given node
   * @param subflow { Node } node subflow
   * @param subflowNodes list of subflow nodes
   */
  checkForMatchingSubflow(subflow: INode, subflowNodes: INode[]): ISubflow | null

  /**
   * Compare if nodes match (equality)
   * @param nodeA node to to compare
   * @param nodeB { Node } node to compare with
   * @param idMustMatch { boolean } if IDs must match as well to be truly equal
   */
  compareNodes(nodeA: INode, nodeB: INode, idMustMatch: boolean): boolean

  /**
   * Add a node
   * @param n { Node } the node to add
   */
  addNode?(n: INode): INodes

  /**
   * Find and return a node by ID
   * @param id {string} id of node to find
   */
  getNode?(id: string): INode

  /**
   * Remove a node from the canvas by ID
   * @param id {string} id of node to remove
   */
  removeNode?(id: string): any

  /**
   * Add a workspace
   * @param ws { Workspace } workspace to add
   */
  addWorkspace(ws: IWorkspace): INodes

  /**
   * Remove workspace by ID
   * @param id { string } ID of workspace
   */
  removeWorkspace(id: string): any

  workspace(id: string): IWorkspace

  /**
   * Get a workspae by ID
   * @param id { string } ID of workspace
   */
  getWorkspace(id: string): IWorkspace

  /**
   * Get the current workspace order
   * @returns { string[] } list of workspaces in current order
   */
  getWorkspaceOrder(): string[]

  /**
   * Set the workspace order
   * @param order { string[] } list of workspaces in a given order
   */
  setWorkspaceOrder(order: string[]): INodes

  // core nodes methods

  // TODO: refactor using getter
  getID(): string

  /**
   * Clear all the node flows and instance vars
   */
  clear(): INodes

  // TODO: refactor using getter/setter instead!
  setDirty(d: boolean)

  /**
   * Return (or set) Nodes dirty state
   * @param d { boolean } set dirty state
   */
  dirty(d: boolean): INodes | boolean
}
