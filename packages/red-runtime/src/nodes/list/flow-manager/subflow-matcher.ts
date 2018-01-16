import {
  Context
} from '../../../context'

import {
  INode
} from '../../../interfaces'

const { log } = console

interface ISubflowManager {
  subflowContains(sfid: string, nodeid: string): boolean
}

export class SubflowMatcher extends Context {
  constructor(protected manager: ISubflowManager, protected sfid: string, protected nodeid: string, protected nodes: INode[]) {
    super()

    this._validateArray(nodes, 'nodes', 'SubflowMatcher:constructor')
  }

  contains(): boolean {
    const {
      sfid,
      nodeid,
      nodes
    } = this

    const {
      _checkSubflowContains
    } = this.rebind([
        '_checkSubflowContains'
      ])

    log('contains', {
      nodes,
      type: typeof nodes,
      isArray: Array.isArray(nodes)
    })

    return Boolean(nodes.find(_checkSubflowContains))
  }

  _checkSubflowContains(node: INode): boolean {
    const { sfid, nodeid, nodes } = this
    const {
      manager
    } = this

    const {
      subflowContains
    } = this.rebind([
        'subflowContains'
      ])

    this._validateDefined(node.z, 'node.z', '_checkSubflowContains')

    // TODO: further decompose into smaller functions to reduce complexity and avoid nested ifs
    if (node.z === sfid) {
      return this._matchingNodeZ(node)
    }
    log('node not matching on .z', {
      sfid,
      z: node.z,
    })
    return false
  }


  _matchingNodeZ(node) {
    // https://developer.mozilla.org/th/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
    var m = /^subflow:(.+)$/.exec(node.type);
    log('match', {
      type: node.type,
      m
    })

    // make this a new protected function
    if (m) {
      return this._matchNodeIsSubflow(m[1])
    }

    log('node not matching on ^subflow:(.+)$', {
      m,
      type: node.type,
    })
  }

  _matchNodeIsSubflow(match) {
    const {
      manager,
      nodeid
    } = this

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
