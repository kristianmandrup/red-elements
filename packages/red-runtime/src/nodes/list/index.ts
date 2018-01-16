import {
  Context
} from '../../context'

import {
  INodesRegistry,
  NodesRegistry
} from '../registry'

export {
  INodesRegistry,
  NodesRegistry
}

import {
  Serializer,
  ISerializer
} from './serializer'

import {
  INodeMatcher,
  NodeMatcher
} from './matcher'

import {
  IConverter,
  Converter
} from './converter'

import {
  IFilter,
  Filter
} from './filter'

import {
  IIterator,
  Iterator
} from './iterator'

import {
  NodeManager,
  INodeManager
} from './node-manager'

import {
  LinkManager,
  ILinkManager
} from './link-manager'

import {
  IFlowManager,
  FlowManager
} from './flow-manager'

import {
  WorkspaceManager,
  IWorkspaceManager
} from './workspace'

const { log } = console

import {
  INode,
  ILink,
  IWorkspace,
  ISubflow,
  INodeDef,
  IFlow,
  INodeSet,
} from '../../interfaces'

export interface INodes {
  RED: any
  registry: INodesRegistry
  configNodes: any
  nodes: INode[]
  links: ILink[]
  workspaces: any // workspace map?
  workspacesOrder: IWorkspace[]
  subflows: any
  n: INode
  initialLoad: any
  loadedFlowVersion: string
  defaultWorkspace: any // IWorkspace

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
  createExportableNodeSet(set: INode[], exportedSubflows: object, exportedConfigNodes: object)

  /**
   * Create a complete node set for export
   * @param exportCredentials { boolean } whether credentials should also be exported
   */
  createCompleteNodeSet(exportCredentials: boolean)

  /**
   * Import nodes from a string (JSON serialization) reprepresentation
   * @param newNodesObj { Node } the node definitions to import
   * @param createNewIds { boolean } create IDs of imported nodes if not in import definitions
   * @param createMissingWorkspace { boolean } create missing workspace if no such workspace exists
   */
  importNodes(newNodesObj: string, createNewIds: boolean, createMissingWorkspace: boolean)

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
  convertNode(n: INode, exportCreds: boolean): INode

  /**
   * Convert a node to a Subflow
   * @param n { Node } node to convert
   */
  convertSubflow(n: INode): ISubflow

  /**
   * Filter nodes based on a filter criteria
   * @param filter { object } filter criteria (Node) all filtered nodes must match
   */
  filterNodes(filter: INode): INode[]

  /**
   * Filter links based on a filter criteria
   * @param filter { object } filter criteria (Link) all filtered links must match
   */
  filterLinks(filter: ILink): ILink[]

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
  getSubflow(id: string): ISubflow

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
  originalFlow(flow: IFlow)

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
  addNode(n: INode): INodes

  /**
   * Find and return a node by ID
   * @param id {string} id of node to find
   */
  getNode(id: string): INode

  /**
   * Remove a node from the canvas by ID
   * @param id {string} id of node to remove
   */
  removeNode(id: string): any

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

  /**
   * Get a workspae by ID
   * @param id { string } ID of workspace
   */
  getWorkspace(id: string): IWorkspace

  /**
   * Get the current workspace order
   * @returns { Workspace[] } list of workspaces in current order
   */
  getWorkspaceOrder(): IWorkspace[]

  /**
   * Set the workspace order
   * @param order { Workspace[] } list of workspaces in a given order
   */
  setWorkspaceOrder(order: any[]): INodes

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

/**
 * A set of Nodes that form a subflow or similar grouping
 */
export class Nodes extends Context implements INodes {
  public registry = new NodesRegistry()
  public configNodes = {
    users: {}
  }
  protected _dirty: boolean = false
  public nodes: INode[] = []
  public links: ILink[] = []
  public workspaces = {}
  public workspacesOrder = []
  public subflows = {}
  public n = null // {}
  public initialLoad = null // {}
  public loadedFlowVersion: string
  public defaultWorkspace = {}

  public serializer: ISerializer
  public converter: IConverter
  public iterator: IIterator
  public filter: IFilter
  public nodeMatcher: INodeMatcher
  public nodeManager: INodeManager
  public linkManager: ILinkManager
  public flowManager: IFlowManager
  public workspaceManager: IWorkspaceManager

  constructor() {
    super()
    const {
      RED
    } = this

    // TODO: use injectable instead!
    this.serializer = new Serializer(this)
    this.nodeMatcher = new NodeMatcher(this)
    this.nodeManager = new NodeManager(this)
    this.linkManager = new LinkManager(this)
    this.flowManager = new FlowManager(this)
    this.workspaceManager = new WorkspaceManager(this)
    this.converter = new Converter(this)
    this.iterator = new Iterator(this)
    this.filter = new Filter(this)

    this._validateObj(RED.events, 'RED.events', 'Nodes constructor')
    this._configureNodeTypeAddedHandler()
  }

  _configureNodeTypeAddedHandler() {
    const {
      RED,
      registry,
      configNodes,
      nodes,
    } = this


    RED.events.on("registry:node-type-added", (type: string) => {
      var def = registry.getNodeType(type);
      var replaced = false;
      var replaceNodes = [];

      this._validateObj(RED.nodes, 'RED.nodes', 'Nodes events.on handler')

      RED.nodes.eachNode((n: INode) => {
        if (n.type === "unknown" && n.name === type) {
          replaceNodes.push(n);
        }
      });
      RED.nodes.eachConfig((n: INode) => {
        if (n.type === "unknown" && n.name === type) {
          replaceNodes.push(n);
        }
      });

      if (replaceNodes.length > 0) {
        this._replaceNodes(replaceNodes)
      }
    });
  }

  _replaceNodes(replaceNodes: INode[]) {
    const {
      RED,
      registry,
      configNodes,
      nodes,
    } = this

    const {
      convertNode,
      importNodes
    } = this.rebind([
        'convertNode',
        'importNodes'
      ])

    var reimportList = [];
    replaceNodes.forEach(function (n: INode) {
      if (configNodes.hasOwnProperty(n.id)) {
        delete configNodes[n.id];
      } else {
        nodes.splice(nodes.indexOf(n), 1);
      }
      reimportList.push(convertNode(n));
    });
    RED.view.redraw(true);
    var result = importNodes(reimportList, false);
    var newNodeMap = {};
    result[0].forEach(function (n: INode) {
      newNodeMap[n.id] = n;
    });
    RED.nodes.eachLink(function (l: ILink) {
      if (newNodeMap.hasOwnProperty(l.source.id)) {
        l.source = newNodeMap[l.source.id];
      }
      if (newNodeMap.hasOwnProperty(l.target.id)) {
        l.target = newNodeMap[l.target.id];
      }
    });
    RED.view.redraw(true);
  }

  // delegate to registry
  setNodeList(list: INode[]) {
    this.registry.setNodeList(list)
  }

  getNodeSet(id: string) {
    this.registry.getNodeSet(id)
  }

  addNodeSet(ns: INodeSet) {
    this.registry.addNodeSet(ns)
  }

  removeNodeSet(id: string) {
    this.registry.removeNodeSet(id)
  }

  enableNodeSet(id: string) {
    this.registry.enableNodeSet(id)
  }

  disableNodeSet(id: string) {
    this.registry.disableNodeSet(id)
  }

  registerType(nt: string, def: any) {
    this.registry.registerNodeType(nt, def)
  }

  getType(nt: string) {
    this.registry.getNodeType(nt)
  }

  // delegate to serializer

  /**
   * Converts the current node selection to an exportable JSON Object
   * @param set { Node[] } set of nodes to export
   * @param exportedSubflows { object } map of subflows by ID to be exported
   * @param exportedConfigNodes { object } map of config nodes by ID to be exported
   */
  createExportableNodeSet(set: INode[], exportedSubflows: object, exportedConfigNodes: object) {
    return this.serializer.createExportableNodeSet(set, exportedSubflows, exportedConfigNodes)
  }

  /**
   * Create a complete node set for export
   * @param exportCredentials { boolean } whether credentials should also be exported
   */
  createCompleteNodeSet(exportCredentials: boolean) {
    return this.serializer.createCompleteNodeSet(exportCredentials)
  }


  /**
   * Import nodes from a string (JSON serialization) reprepresentation
   * @param newNodesObj { Node } the node definitions to import
   * @param createNewIds { boolean } create IDs of imported nodes if not in import definitions
   * @param createMissingWorkspace { boolean } create missing workspace if no such workspace exists
   */
  importNodes(newNodesObj: string, createNewIds: boolean, createMissingWorkspace: boolean) {
    return this.serializer.importNodes(newNodesObj, createNewIds, createMissingWorkspace)
  }

  // delegate to converter

  /**
   * Convert a node to a workspace
   * @param n { Node } the node to convert
   */
  convertWorkspace(n: INode): IWorkspace {
    return this.converter.convertWorkspace(n)
  }

  /**
   * Converts a node to an exportable JSON Object
   * @param n { Node } the node to convert
   * @param exportCreds { boolean } if node (user) credentials should also be exported
   **/
  convertNode(n: INode, exportCreds: boolean): INode {
    return this.converter.convertNode(n, exportCreds)
  }

  /**
   * Convert a node to a Subflow
   * @param n { Node } node to convert
   */
  convertSubflow(n: INode): ISubflow {
    return this.converter.convertSubflow(n)
  }

  // delegate to filter

  /**
   * Filter nodes based on a filter criteria
   * @param filter { object } filter criteria (Node) all filtered nodes must match
   */
  filterNodes(filter: INode): INode[] {
    return this.filter.filterNodes(filter)
  }

  /**
   * Filter links based on a filter criteria
   * @param filter { object } filter criteria (Link) all filtered links must match
   */
  filterLinks(filter: ILink): ILink[] {
    return this.filter.filterLinks(filter)
  }

  // delegate to flow manager

  /**
   * Add a Subflow of nodes
   * @param sf { Subflow } subflow to add
   * @param createNewIds { boolean } whether to create new node IDs as well
   */
  addSubflow(sf: ISubflow, createNewIds: boolean): INodes {
    return this.flowManager.addSubflow(sf, createNewIds)
  }

  /**
   * Get a subflow by ID
   * @param id { string } ID of subflow to get
   */
  getSubflow(id: string): ISubflow {
    return this.flowManager.getSubflow(id)
  }

  /**
   * Remove a subflow
   * @param sf { string | Subflow } subflow to remove
   */
  removeSubflow(sf: string | ISubflow): INodes {
    return this.flowManager.removeSubflow(sf)
  }

  /**
   * Test if subflow contains a node with a specific ID
   * @param sfid { Subflow } subflow to test on
   * @param nodeid { string } node ID to test each node in flow for
   * @returns { boolean } whether subflow contains node with given ID
   */
  subflowContains(sfid: string, nodeid: string): boolean {
    return this.flowManager.subflowContains(sfid, nodeid)
  }

  /**
   * Get all the flow nodes related to a node
   * @param node { Node } the node to find all flow nodes from
   * @returns { Node[] } all the flow nodes found for the node
   */
  getAllFlowNodes(node: INode): INode[] {
    return this.flowManager.getAllFlowNodes(node)
  }

  /**
   * get/set the flow version
   * @param version { string } version of flow
   * @returns { string } flow version
   */
  flowVersion(version): string {
    return this.flowManager.flowVersion(version)
  }

  /**
   * Return the original flow definition
   * @param flow { IFlow } the flow
   */
  originalFlow(flow: IFlow) {
    return this.flowManager.originalFlow(flow)
  }

  // delegate to iterator

  /**
   * Iterate all nodes
   * @param cb { function } For each iterated node, call this callback function
   */
  eachNode(cb: Function): void {
    this.iterator.eachNode(cb)
  }

  /**
   * Iterate all links
   * @param cb { function } For each iterated link, call this callback function
   */
  eachLink(cb: Function): void {
    this.iterator.eachLink(cb)
  }

  /**
   * Iterate all config nodes
   * @param cb { function } For each iterated config node, call this callback function
   */
  eachConfig(cb: Function): void {
    this.iterator.eachConfig(cb)
  }

  /**
   * Iterate all subflows
   * @param cb { function } For each iterated subflow, call this callback function
   */
  eachSubflow(cb: Function): void {
    this.iterator.eachSubflow(cb)
  }

  /**
   * Iterate all workspaces
   * @param cb { function } For each iterated workspace, call this callback function
   */
  eachWorkspace(cb: Function): void {
    this.iterator.eachWorkspace(cb)
  }

  // delegate to link manager

  /**
   * Remove a link
   * @param link {string} link to remove
   */
  removeLink(link: ILink) {
    return this.linkManager.removeLink(link)
  }

  /**
   * Add a link
   * @param link {string} link to add
   */
  addLink(link: ILink) {
    return this.linkManager.addLink(link)
  }

  // delegate to node matcher


  /**
   * Check if a subflow has a node that matches a given node
   * @param subflow { Node } node subflow
   * @param subflowNodes list of subflow nodes
   */
  checkForMatchingSubflow(subflow: INode, subflowNodes: INode[]): ISubflow | null {
    return this.nodeMatcher.checkForMatchingSubflow(subflow, subflowNodes)
  }


  /**
   * Compare if nodes match (equality)
   * @param nodeA node to to compare
   * @param nodeB { Node } node to compare with
   * @param idMustMatch { boolean } if IDs must match as well to be truly equal
   */
  compareNodes(nodeA: INode, nodeB: INode, idMustMatch: boolean): boolean {
    return this.nodeMatcher.compareNodes(nodeA, nodeB, idMustMatch)
  }


  // delegate to node manager

  /**
   * Add a node
   * @param n { Node } the node to add
   */
  addNode(n: INode): INodes {
    return this.nodeManager.addNode(n)
  }

  /**
   * Find and return a node by ID
   * @param id {string} id of node to find
   */
  getNode(id: string): INode {
    return this.nodeManager.getNode(id)
  }

  /**
   * Remove a node from the canvas by ID
   * @param id {string} id of node to remove
   */
  removeNode(id: string): any {
    return this.nodeManager.removeNode(id)
  }

  // delegate to workspace manager


  /**
   * Add a workspace
   * @param ws { Workspace } workspace to add
   */
  addWorkspace(ws: IWorkspace): INodes {
    return this.workspaceManager.addWorkspace(ws)
  }

  /**
   * Remove workspace by ID
   * @param id { string } ID of workspace
   */
  removeWorkspace(id: string): any {
    return this.workspaceManager.removeWorkspace(id)
  }

  /**
   * Get a workspae by ID
   * @param id { string } ID of workspace
   */
  getWorkspace(id: string): IWorkspace {
    return this.workspaceManager.getWorkspace(id)
  }

  /**
   * Get the current workspace order
   * @returns { Workspace[] } list of workspaces in current order
   */
  getWorkspaceOrder(): IWorkspace[] {
    return this.workspaceManager.getWorkspaceOrder()
  }

  /**
   * Set the workspace order
   * @param order { Workspace[] } list of workspaces in a given order
   */
  setWorkspaceOrder(order: any[]): INodes {
    return this.workspaceManager.setWorkspaceOrder(order)
  }

  // core nodes methods

  // TODO: refactor using getter
  getID(): string {
    return (1 + Math.random() * 4294967295).toString(16);
  }

  /**
   * Clear all the node flows and instance vars
   */
  clear(): INodes {
    let {
      RED,
      defaultWorkspace,
      subflows,
      workspaces
    } = this

    var subflowIds = Object.keys(subflows);
    subflowIds.forEach((id) => {
      RED.subflow.removeSubflow(id)
    });
    var workspaceIds = Object.keys(workspaces);
    workspaceIds.forEach((id) => {
      RED.workspaces.remove(workspaces[id]);
    });

    defaultWorkspace = null;

    RED.nodes.dirty(true);

    RED.view.redraw(true);
    RED.palette.refresh();
    RED.workspaces.refresh();
    RED.sidebar.config.refresh();

    var node_defs = {};
    var nodes = [];
    var configNodes = {};
    var links = [];
    workspaces = {};
    var workspacesOrder = [];
    subflows = {};
    var loadedFlowVersion = null;

    this.setInstanceVars({
      node_defs,
      nodes,
      configNodes,
      links,
      workspaces,
      workspacesOrder,
      subflows,
      loadedFlowVersion
    })

    return this
  }


  // TODO: refactor using getter/setter instead!
  setDirty(d: boolean) {
    this._dirty = d
    return this
  }

  /**
   * Return (or set) Nodes dirty state
   * @param d { boolean } set dirty state
   */
  dirty(d: boolean): INodes | boolean {
    const {
      setDirty,
    } = this.rebind([
        'setDirty'
      ])

    if (d == null) {
      return this._dirty;
    } else {
      return setDirty(d);
    }
  }
}
