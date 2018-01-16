import {
  NodeManager
} from '../../../../src/nodes/list/node'

import {
  Nodes
} from '../../../..'

function create() {
  const nodes = new Nodes()
  return new NodeManager(nodes)
}

let nodes
beforeEach(() => {
  nodes = create()
})

const { log } = console

const FAKE_RED = {}

function fakeNode(override = {}, def = true) {
  let base: any = {
    id: 'x',
    in: {},
    out: {},
    type: 'subflow'
  }

  if (def) {
    base._def = {
      credentials: {},
      defaults: {},
      set: {
        module: 'node-red'
      }
    }
  }

  return Object.assign(base, override)
}

test.only('Nodes: updateConfigNodeUsers', () => {
  let node = fakeNode({
    id: 'a',
    type: 'x',
    _def: {
      set: {},
      defaults: {
        custom: {
          // registry.getNodeType(property.type) must be able to find the node type
          type: 'age',
          category: 'config'
        }
      }
    }
  })

  // TODO: Fix and also add Type interface for it!?
  const ns = {
    id: 'basic',
    types: {
      age: {

      }
    },
    module: 'demo',
    version: 1,
    local: true,
    pending_version: 2
  }

  nodes.registry.addNodeSet(ns)

  // Note: the node type is looked up in the node sets registered in registry
  nodes.registry.registerNodeType('age', {
    category: 'config'
  })

  nodes.updateConfigNodeUsers(node)
  log({
    users: nodes.configNodes.users
  })
  // TODO: not sure this is correct approach. users might be keyed by ID?
  let user = nodes.configNodes.users[0]
  let expectedUser = {}
  expect(user).toEqual(expectedUser)
})
