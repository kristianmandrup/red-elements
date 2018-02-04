import {
  Context,
  todo,
  delegator,
  lazyInject,
  $TYPES
} from '../_base'

const TYPES = $TYPES.all

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
  ISerializer,
  INodeMatcher,
  NodeMatcher,
  IConverter,
  Converter,
  IFilter,
  Filter,
  IIterator,
  Iterator,
  NodeManager,
  INodeManager,
  LinkManager,
  ILinkManager,
  IFlowManager,
  FlowManager,
  WorkspaceManager,
  IWorkspaceManager
} from './delegates'

const { log } = console

import {
  INode,
  ILink,
  IWorkspace,
  ISubflow,
  INodeDef,
  IFlow,
  INodeSet,
  ICanvas,
  IWorkspaces,
  ISidebar,
  IPalette
} from '../../interfaces'

import {
  INodes
} from './interface'

import {
  injectable
} from 'inversify'
import { IEvents } from '../../index';

export {
  INodes
}

/**
 * A set of Nodes that form a subflow or similar grouping
 */
@injectable()
@delegator({
  map: {
    serializer: 'ISerializer',
    converter: 'IConverter',
    iterator: 'IIterator',
    filter: 'IFilter',
    nodeMatcher: 'INodeMatcher',
    nodeManager: 'INodeManager',
    linkManager: 'ILinkManager',
    flowManager: 'IFlowManager',
    workspaceManager: 'IWorkspaceManager',
    registry: 'INodesRegistry'
  }
})

export class Nodes extends Context implements INodes {
  public registry: INodesRegistry
  public configNodes = {
    users: {}
  }
  // or number?
  protected _version: number = 0
  protected _dirty: boolean = false
  public nodes: INode[] = []
  public links: ILink[] = []
  public workspaces = {}
  public workspacesOrder: string[] = []
  public subflows = {}
  public n = null // {}
  public initialLoad = null // {}
  public loadedFlowVersion: string
  public defaultWorkspace = {}

  // injected delegates (helpers)
  serializer: ISerializer
  converter: IConverter
  iterator: IIterator
  filter: IFilter
  nodeMatcher: INodeMatcher
  nodeManager: INodeManager
  linkManager: ILinkManager
  flowManager: IFlowManager
  workspaceManager: IWorkspaceManager

  @lazyInject(TYPES.events) $events: IEvents
  @lazyInject(TYPES.nodes) $nodes: INodes
  @lazyInject(TYPES.view) $view: ICanvas
  @lazyInject(TYPES.subflow) $subflow: ISubflow
  @lazyInject(TYPES.workspaces) $workspaces: IWorkspaces
  @lazyInject(TYPES.palette) $palette: IPalette
  @lazyInject(TYPES.sidebar.main) $sidebar: ISidebar


  constructor() {
    super()
    const {
      $events
    } = this

    this._validateObj($events, '$events', 'Nodes constructor')
    this._configureNodeTypeAddedHandler()
  }

  setVersion(revision: number) {
    this._version = revision
  }

  // alias
  subflow(id: string) {
    return this.getSubflow(id)
  }

  // alias
  import(config: any) {
    return this.importNodes(config)
  }

  // alias
  node(id: string) {
    return this.getNode(id)
  }

  // alias
  remove(id: string) {
    return this.removeNode(id)
  }

  // alias
  add(node: INode) {
    return this.addNode(node)
  }

  /**
   * configure Node Type Added Handler
   */
  _configureNodeTypeAddedHandler() {
    const {
      $events,
      $nodes,
      registry,
      configNodes,
      nodes,
    } = this


    $events.on("registry:node-type-added", (type: string) => {
      var def = registry.getNodeType(type);
      var replaced = false;
      var replaceNodes = [];

      this._validateObj($nodes, '$nodes', 'Nodes events.on handler')

      $nodes.eachNode((n: INode) => {
        if (n.type === "unknown" && n.name === type) {
          replaceNodes.push(n);
        }
      });
      $nodes.eachConfig((n: INode) => {
        if (n.type === "unknown" && n.name === type) {
          replaceNodes.push(n);
        }
      });

      if (replaceNodes.length > 0) {
        this._replaceNodes(replaceNodes)
      }
    });
  }

  /**
   * replace Nodes
   * @param replaceNodes
   */
  _replaceNodes(replaceNodes: INode[]) {
    const {
      $nodes,
      $view,
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
    $view.redraw(true);
    var result = importNodes(reimportList, false);
    var newNodeMap = {};
    result[0].forEach(function (n: INode) {
      newNodeMap[n.id] = n;
    });
    $nodes.eachLink(function (l: ILink) {
      if (newNodeMap.hasOwnProperty(l.source.id)) {
        l.source = newNodeMap[l.source.id];
      }
      if (newNodeMap.hasOwnProperty(l.target.id)) {
        l.target = newNodeMap[l.target.id];
      }
    });
    $view.redraw(true);
  }

  get version() {
    return this._version
  }

  /**
   * set Node List
   * TODO: use @delegateTo('registry')
   * @param list
   */
  setNodeList(list: INode[]) {
    this.registry.setNodeList(list)
  }

  /**
   * get Node Set
   * @param id
   */
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
  createExportableNodeSet(set: INode[], exportedSubflows?: object, exportedConfigNodes?: object) {
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
  importNodes(newNodesObj: string, createNewIds?: boolean, createMissingWorkspace?: boolean) {
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
   * @param filter { any object } filter criteria (props of Node) all filtered nodes must match
   */
  filterNodes(filter: any): INode[] {
    return this.filter.filterNodes(filter)
  }

  /**
   * Filter links based on a filter criteria
   * @param filter { any object } filter criteria (Link props) all filtered links must match
   */
  filterLinks(filter: any): ILink[] {
    return this.filter.filterLinks(filter)
  }

  // delegate to flow manager

  /**
   * Add a Subflow of nodes
   * @param sf { Subflow } subflow to add
   * @param createNewIds { boolean } whether to create new node IDs as well
   */
  addSubflow(sf: ISubflow, createNewIds?: boolean): INodes {
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

  // alias
  workspace(id: string): IWorkspace {
    return this.getWorkspace(id)
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
  getWorkspaceOrder(): string[] {
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
      $nodes,
      $subflow,
      $workspaces,
      $palette,
      $view,
      $sidebar,

      defaultWorkspace,
      subflows,
      workspaces
    } = this

    var subflowIds = Object.keys(subflows);
    subflowIds.forEach((id) => {
      $subflow.removeSubflow(id)
    });
    var workspaceIds = Object.keys(workspaces);
    workspaceIds.forEach((id) => {
      $workspaces.remove(workspaces[id]);
    });

    defaultWorkspace = null;

    $nodes.dirty(true);

    $view.redraw(true);
    $palette.refresh();
    $workspaces.refresh();

    // TODO: FIX - or tabs?
    $sidebar.tabs.refresh();

    var node_defs = {};
    var nodes = [];
    var configNodes = {};
    var links = [];
    workspaces = {};
    var workspacesOrder: string[] = [];
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
