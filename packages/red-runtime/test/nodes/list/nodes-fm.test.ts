import {
  Nodes
} from '../../..'

import {
  fakeNode,
  prepareTests
} from '../../_infra'

// import functions that contain and run test suites for delegates
import * as sharedTests from './shared-tests'

function create() {
  return new Nodes()
}

// different test configurations for test following same pattern
const $testMap = {
  'no match': {
    sfid: 'x',
    nodeid: 'a',
    subflowType: 'unknown:config',
    type: 'config'
  },
  'matches': {
    sfid: 'y',
    nodeid: 'a',
    subflowType: 'subflow:config',
    type: 'config'
  }
}

// TEST all FlowManager delegations
describe.only('Nodes:FlowManager', () => {

  // the context to build before each test
  function buildContext() {
    const nodes = create()
    return {
      $testMap,
      $nodes: nodes,
      fakeNode,
      flowManager: nodes.flowManager
    }
  }

  // prepare all the tests using the shared tests and context
  prepareTests(sharedTests.flowManager, buildContext).map(t => {
    test(t.$label, t.$fun)
  })
})

