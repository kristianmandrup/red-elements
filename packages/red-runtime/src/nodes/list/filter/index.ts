import {
  INodes
} from '../'

import {
  Context
} from '../../../context'

import {
  INode,
  ILink
} from '../../../interfaces'

export interface IFilter {
  filterNodes(filter: any): INode[]
  filterLinks(filter: any): ILink[]
}

export class Filter extends Context {
  constructor(public nodes: INodes) {
    super()
  }

  // TODO: supports filter.z|type
  /**
   * Filter nodes based on a filter criteria
   * @param filter { object } filter criteria (Node) all filtered nodes must match
   */
  filterNodes(filter: any): INode[] {
    const {
      nodes
    } = this.nodes

    var result = [];

    for (var n = 0; n < nodes.length; n++) {
      var node = nodes[n];

      this._validateNode(node, 'node', 'filterNodes', 'iterate nodes')

      if (filter.hasOwnProperty("z") && node.z !== filter.z) {
        continue;
      }
      if (filter.hasOwnProperty("type") && node.type !== filter.type) {
        continue;
      }
      result.push(node);
    }
    return result;
  }

  /**
   * Filter links based on a filter criteria
   * @param filter { object } filter criteria (Link) all filtered links must match
   */
  filterLinks(filter: any): ILink[] {
    const {
      nodes
    } = this

    const {
      links
    } = this.nodes

    var result = [];

    for (var n = 0; n < links.length; n++) {
      var link = links[n];

      this._validateLink(link, 'link', 'filterNodes', { links })

      if (filter.source) {
        if (filter.source.hasOwnProperty("id") && link.source.id !== filter.source.id) {
          continue;
        }
        if (filter.source.hasOwnProperty("z") && link.source.z !== filter.source.z) {
          continue;
        }
      }
      if (filter.target) {
        if (filter.target.hasOwnProperty("id") && link.target.id !== filter.target.id) {
          continue;
        }
        if (filter.target.hasOwnProperty("z") && link.target.z !== filter.target.z) {
          continue;
        }
      }
      if (filter.hasOwnProperty("sourcePort") && link.sourcePort !== filter.sourcePort) {
        continue;
      }
      result.push(link);
    }
    return result;
  }
}
