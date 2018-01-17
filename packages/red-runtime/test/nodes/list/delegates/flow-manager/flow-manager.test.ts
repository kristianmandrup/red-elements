import {
  Nodes,
} from '../../../../..'

import {
  FlowManager
} from '../../../../../src/nodes/list/flow-manager'

import {
  fakeNode
} from '../../../../_infra'

import * as sharedTests from '../../shared-tests'

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

// TEST all FlowManager delegations
describe.only('FlowManager', () => {

  // TODO: We should be able to leverage this pattern as well to further reduce code pattern duplication
  const factories = sharedTests.flowManager
  Object.keys(factories).map(label => {

    const nodes = $nodes
    // essentially the beforeEach test setup using test factory
    const createTest = factories[label]
    const $test = createTest({
      $nodes: nodes,
      fakeNode,
      flowManager: $nodes.flowManager
    })

    test(label, $test)
  })
})

test('subflowContains - matches', () => {
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

  let found = flowManager.subflowContains(sfid, nodeid)
  expect(found).toBeTruthy()
})

test('subflowContains - no match', () => {
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

  let found = flowManager.subflowContains(sfid, nodeid)
  expect(found).toBeFalsy()
})
