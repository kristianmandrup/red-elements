import {
  Context
} from '../../../context'

import {
  IFlowManager
} from '.'

import {
  INode
} from '../../../interfaces'

const { log } = console

export class SubflowMatcher extends Context {
  protected sfid: string
  protected nodeid: string
  protected nodeList: INode[]

  constructor(protected manager: IFlowManager) {
    super()
    this.nodeList = manager.nodes.nodes
    this._validateArray(this.nodeList, 'nodes', 'SubflowMatcher:constructor')
  }

  configure(sfid: string, nodeid: string) {
    this.sfid = sfid
    this.nodeid = nodeid
    return this
  }

  contains(): boolean {
    const {
      sfid,
      nodeid,
      nodeList
    } = this

    const {
      _checkSubflowContains
    } = this.rebind([
        '_checkSubflowContains'
      ])

    this._validateStr(sfid, 'sfid', 'contains')
    this._validateStr(sfid, 'nodeid', 'contains')
    this._validateArray(nodeList, 'nodes', 'contains')
    return Boolean(nodeList.find(_checkSubflowContains))
  }

  _checkSubflowContains(node: INode): boolean {
    const {
      manager
    } = this

    this._validateStr(node.z, 'node.z', '_checkSubflowContains')
    return this._matchingNodeZ(node)
  }

  _isSubflowNode(node) {
    const match = /^subflow:(.+)$/.exec(node.type);
    return match ? match[1] : null
  }

  _matchingNodeZ(node) {
    const { sfid, nodeid, nodeList } = this
    if (node.z !== sfid) {
      return false
    }
    const match = this._isSubflowNode(node)
    log('match', {
      type: node.type,
      match
    })
    return this._matchNodeIsSubflow(match)
  }

  _matchNodeIsSubflow(match) {
    const {
      manager,
      nodeid
    } = this

    if (!match) {
      return false
    }

    log('node matching on ^subflow:(.+)$', {
      match
    })

    // make this a new protected function
    if (match === nodeid) {
      return true;
    }
    log('recurse node matching', {
      match,
      nodeid
    })
    return manager.subflowContains(match, nodeid);
  }
}
