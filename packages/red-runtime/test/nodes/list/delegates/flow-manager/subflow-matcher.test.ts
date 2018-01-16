import {
  Nodes,
} from '../../../../..'

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
  flowManager = new FlowManager(nodes)
}

function createMatcher(sfid, nodeid, nodes?) {
  nodes = nodes || $nodes
  return new SubflowMatcher(flowManager, sfid, nodeid, nodes)
}

let matcher
beforeEach(() => {
  matcher = create()
})

test('contains', () => {
  const sfid = 'xyz'
  const nodeid = 'abc'
  const matcher = createMatcher(sfid, nodeid)
})

// add more tests as needed for smaller helper functions used in nested logic...
