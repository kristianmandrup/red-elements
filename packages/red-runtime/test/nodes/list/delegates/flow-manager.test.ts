import {
  Nodes,
} from '../../../..'

import {
  FlowManager
} from '../../../../src/nodes/list/flow-manager'

import {
  fakeNode
} from '../../../_infra'

function create() {
  const nodes = new Nodes()
  return new FlowManager(nodes)
}

let nodes
beforeEach(() => {
  nodes = create()
})

const { log } = console

const FAKE_RED = {}

test.only('Nodes: subflowContains', () => {
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
  nodes.addNode(subflowConfig)
  nodes.addSubflow(subflow)

  let found = nodes.subflowContains(sfid, nodeid)
  expect(found).toBeTruthy()
})
