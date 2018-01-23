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

  /**
   * Test if a node is contained in a subflow
   * @param node { INode } node to test if contained in a subflow
   */
  _checkSubflowContains(node: INode): boolean {
    const {
      manager
    } = this

    this._validateStr(node.z, 'node.z', '_checkSubflowContains')
    return this._matchingNodeZ(node)
  }

  /**
   * Test if node is a subflow type
   * @param node { INode } node to test
   */
  _isSubflowNode(node: INode) {
    const match = /^subflow:(.+)$/.exec(node.type);
    return match ? match[1] : null
  }

  /**
   * Test if node .z matches subflow id - .z is the subflow (dimension) of the node
   * @param node { INode } node to test
   */
  _matchingNodeZ(node : INode) {
    const { sfid, nodeid, nodeList } = this
    
    if (String(node.z) !== sfid) {
      return false
    }
    console.log('End');
    const match = this._isSubflowNode(node)
    this.logInfo('match', {
      type: node.type,
      match
    })
    return this._matchNodeIsSubflow(match)
  }

  /**
   * Test if node subflow type name matches subflow
   * @param match { } test subflow name match part against nodeid
   */
  _matchNodeIsSubflow(match: string) {
    const {
      manager,
      nodeid
    } = this

    if (!match) {
      return false
    }

    this.logInfo('node matching on ^subflow:(.+)$', {
      match
    })

    // make this a new protected function
    if (match === nodeid) {
      return true;
    }

    this.logInfo('recurse node matching', {
      match,
      nodeid
    })

    // TODO: detect possible infinite loop here!?
    // recurse using subflow id of node type as new subflow id
    return manager.subflowContains(match, nodeid);
  }
}
