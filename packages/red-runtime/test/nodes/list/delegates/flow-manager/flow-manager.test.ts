import {
  Nodes,
} from '../../../../..'

import {
  FlowManager
} from '../../../../../src/nodes/list/flow-manager'

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

test.only('FlowManager: subflowContains - matches', () => {
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

test.only('FlowManager: subflowContains - no match', () => {
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
