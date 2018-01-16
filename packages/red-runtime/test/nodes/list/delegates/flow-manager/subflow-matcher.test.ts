import {
  Nodes,
} from '../../../../..'

import {
  INode
} from '../../../../../src/interfaces'


import {
  FlowManager
} from '../../../../../src/nodes/list/flow-manager'

import {
  SubflowMatcher
} from '../../../../../src/nodes/list/flow-manager/subflow-matcher'

import {
  fakeNode
} from '../../../../_infra'

const $nodes = new Nodes()

let flowManager
function create() {
  flowManager = new FlowManager($nodes)
}

function createMatcher(sfid: string, nodeid: string, nodes?: INode[]) {
  nodes = nodes || $nodes.nodes
  return new SubflowMatcher(flowManager, sfid, nodeid, nodes)
}

let matcher
beforeEach(() => {
  matcher = create()
})

test('contains', () => {
  let sfid = 'x'
  let nodeid = 'a'

  let subflowConfig = fakeNode({
    z: sfid,
    id: sfid,
    type: 'subflow:config'
  })
  let subflow = fakeNode({
    id: sfid,
    type: 'config'
  })
  $nodes.addNode(subflowConfig)
  $nodes.addSubflow(subflow)

  const matcher = createMatcher(sfid, nodeid)

  let found = matcher.contains()
  expect(found).toBeTruthy()
})

// add more tests as needed for smaller helper functions used in nested logic...
