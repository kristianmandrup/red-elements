import {
  Nodes,
} from '../../../../..'

import {
  FlowManager
} from '../../../../../src/nodes/list/flow-manager'

import {
  testFlowManager
} from '../../_delegate-tests'

import {
  fakeNode
} from '../../../../_infra'

const $nodes = new Nodes()

function create() {
  return new FlowManager($nodes)
}

let flowManager
beforeEach(() => {
  flowManager = create()
})

const { log } = console

const FAKE_RED = {}

// Reuse delegate tests for Delegate class
// avoids test code duplication!!!
testFlowManager($nodes, flowManager)

