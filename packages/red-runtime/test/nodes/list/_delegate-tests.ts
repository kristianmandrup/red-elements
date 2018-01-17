import {
  fakeNode
} from '../../_infra'

import {
  INodes
} from '../../../src/nodes'

import {
  IFlowManager,
} from '../../../src/nodes/list/flow-manager'

// call this method both from nodes.test and from flow-manager.test
// ALWAYS avoid code duplication! Also for tests!

export function testFlowManager($nodes: INodes, flowManager?: IFlowManager) {
  flowManager = flowManager || $nodes['flowManager']

  // TODO: add each of the tests here
  // TODO: ALL the FlowManager TESTS HERE PLEASE

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
}
