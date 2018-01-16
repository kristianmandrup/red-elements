import {
  INodes
} from '../'

import {
  Context
} from '../../../context'

export interface IIterator {
  eachNode(cb: Function): void
  eachLink(cb: Function): void
  eachConfig(cb: Function): void
  eachSubflow(cb: Function): void
  eachWorkspace(cb: Function): void
}

export class Iterator extends Context {
  constructor(public nodes: INodes) {
    super()
  }

  /**
   * Iterate all nodes
   * @param cb { function } For each iterated node, call this callback function
   */
  eachNode(cb: Function): void {
    const {
      nodes
    } = this.nodes
    for (var n = 0; n < nodes.length; n++) {
      cb(nodes[n]);
    }
  }

  /**
   * Iterate all links
   * @param cb { function } For each iterated link, call this callback function
   */
  eachLink(cb: Function): void {
    const {
      links
    } = this.nodes
    for (var l = 0; l < links.length; l++) {
      cb(links[l]);
    }
  }

  /**
   * Iterate all config nodes
   * @param cb { function } For each iterated config node, call this callback function
   */
  eachConfig(cb: Function): void {
    const {
      configNodes
    } = this.nodes

    for (var id in configNodes) {
      if (configNodes.hasOwnProperty(id)) {
        cb(configNodes[id]);
      }
    }
  }

  /**
   * Iterate all subflows
   * @param cb { function } For each iterated subflow, call this callback function
   */
  eachSubflow(cb: Function): void {
    const {
      subflows
    } = this.nodes

    for (var id in subflows) {
      if (subflows.hasOwnProperty(id)) {
        cb(subflows[id]);
      }
    }
  }

  /**
   * Iterate all workspaces
   * @param cb { function } For each iterated workspace, call this callback function
   */
  eachWorkspace(cb: Function): void {
    const {
      workspaces,
      workspacesOrder
    } = this.nodes

    for (var i = 0; i < workspacesOrder.length; i++) {
      cb(workspaces[workspacesOrder[i]]);
    }
  }
}
