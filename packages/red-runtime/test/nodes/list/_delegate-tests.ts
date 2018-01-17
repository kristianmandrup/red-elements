import {
  fakeNode
} from '../../_infra'

import {
  INodes
} from '../../../src/nodes'

import {
  IFlowManager,
} from '../../../src/nodes/list/flow-manager'


// TODO:
// call this method both from nodes.test and from flow-manager.test
// reduce code duplication!

function testFlowManager($nodes: INodes, flowManager?: IFlowManager) {
  flowManager = flowManager || $nodes['flowManager']

  // TODO: add each of the tests here

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
}
