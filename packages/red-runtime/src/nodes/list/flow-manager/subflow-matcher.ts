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

    // for (var i = 0; i < nodes.length; i++) {
    //   if (this._checkSubflowContains(i)) {
    //     return true
    //   }
    // }
    // return false;
  }

  _checkSubflowContains(i: number): boolean {
    const { sfid, nodeid, nodes } = this
    const {
      manager
    } = this

    const {
      subflowContains
    } = this.rebind([
        'subflowContains'
      ])

    var node = nodes[i];

    // TODO: further decompose into smaller functions to reduce complexity and avoid nested ifs
    if (node.z === sfid) {
      // https://developer.mozilla.org/th/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
      var m = /^subflow:(.+)$/.exec(node.type);
      log('match', {
        type: node.type,
        m
      })

      // make this a new protected function
      if (m) {
        log('node matching on ^subflow:(.+)$', {
          m,
          type: node.type,
        })

        // make this a new protected function
        if (m[1] === nodeid) {
          return true;
        } else {
          log('recurse node matching', {
            m1: m[1],
            nodeid
          })
          var result = manager.subflowContains(m[1], nodeid);
          if (result) {
            return true;
          }
        }
      } else {
        log('node not matching on ^subflow:(.+)$', {
          m,
          type: node.type,
        })
      }
    } else {
      log('node not matching on .z', {
        sfid,
        z: node.z,
      })
    }
  }
}
