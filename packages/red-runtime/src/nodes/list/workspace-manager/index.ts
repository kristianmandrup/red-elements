import {
  Nodes,
  INodes
} from '../'

import {
  Context,
  delegateTarget,
  $TYPES,
  lazyInject
} from '../_base'

import {
  IWorkspace
} from '../../../interfaces'

export interface Subflow extends Node {
}


export interface IWorkspaceManager {
  addWorkspace(ws: IWorkspace): INodes
  removeWorkspace(id: string): any
  getWorkspace(id: string): IWorkspace
  getWorkspaceOrder(): string[]
  setWorkspaceOrder(order: string[]): INodes
}

const TYPES = $TYPES.all

@delegateTarget()
export class WorkspaceManager extends Context implements IWorkspaceManager {
  @lazyInject(TYPES.nodes) $nodes: INodes

  constructor(public nodes: INodes) {
    super()
  }

  /**
   * Add a workspace
   * @param ws { Workspace } workspace to add
   */
  addWorkspace(ws: IWorkspace) {
    const {
      nodes,
      $nodes
    } = this

    const {
      workspaces,
      workspacesOrder
    } = nodes

    workspaces[ws.id] = ws;
    ws._def = $nodes.getType('tab');
    workspacesOrder.push(ws.id);
    return nodes
  }

  /**
   * Get a workspae by ID
   * @param id { string } ID of workspace
   */
  getWorkspace(id: string): IWorkspace {
    const {
      nodes
    } = this
    const {
      workspaces,
    } = nodes

    return workspaces[id];
  }

  /**
   * Remove workspace by ID
   * @param id { string } ID of workspace
   */
  removeWorkspace(id: string): any {
    const {
      $nodes
    } = this

    const {
      nodes,
      configNodes,
      workspacesOrder,
    } = this.nodes
    const {
      removeNode
    } = this.rebind([
        'removeNode'
      ])

    delete $nodes.workspaces[id];
    $nodes.workspacesOrder.splice(workspacesOrder.indexOf(id), 1);

    // TODO: Fix - instance vars?
    var removedNodes = [];
    var removedLinks = [];
    var n;
    var node;

    for (n = 0; n < nodes.length; n++) {
      node = nodes[n];
      if (node.z == id) {
        removedNodes.push(node);
      }
    }
    for (n in configNodes) {
      if (configNodes.hasOwnProperty(n)) {
        node = configNodes[n];
        if (node.z == id) {
          removedNodes.push(node);
        }
      }
    }
    for (n = 0; n < removedNodes.length; n++) {
      var result = removeNode(removedNodes[n].id);
      removedLinks = removedLinks.concat(result.links);
    }
    return {
      nodes: removedNodes,
      links: removedLinks
    };
  }

  /**
   * Get the current workspace order
   * @returns { number[] } list of workspaces in current order
   */
  getWorkspaceOrder(): string[] {
    const {
      nodes
    } = this

    return nodes.workspacesOrder
  }

  /**
   * Set the workspace order
   * @param order { Workspace[] } list of workspaces in a given order
   */
  setWorkspaceOrder(order: string[]): INodes {
    const {
      nodes
    } = this

    this._validateArray(order, 'order', 'setWorkspaceOrder')
    nodes.workspacesOrder = order;
    return nodes
  }
}
