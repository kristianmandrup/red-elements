import {
  Nodes
} from '../'

import {
  Context,
  delegateTarget
} from '../_base'

import {
  ILink
} from '../../../interfaces'

const { log } = console

export interface ILinkManager {
  removeLink(l: ILink)
  addLink(link: ILink)
}

@delegateTarget()
export class LinkManager extends Context {
  constructor(public nodes: Nodes) {
    super()
  }

  /**
   * Remove a link
   * @param link {string} link to remove
   */
  removeLink(link: ILink) {
    const { links } = this.nodes

    var index = links.indexOf(link);
    if (index != -1) {
      links.splice(index, 1);
    }
    return this.nodes
  }

  /**
   * Add a link
   * @param link {string} link to add
   */
  addLink(link: ILink) {
    const { links } = this.nodes
    this._validateLink(link, 'link', 'addLink')
    links.push(link);

    return this.nodes
  }
}
