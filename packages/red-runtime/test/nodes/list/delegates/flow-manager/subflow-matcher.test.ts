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

function createMatcher(sfid: string, nodeid: string) {
  return new SubflowMatcher(flowManager).configure(sfid, nodeid)
}

let matcher
beforeEach(() => {
  matcher = create()
})


test.only('_isSubflowNode(node) - matches', () => {
  const node = fakeNode({
    type: 'subflow:hello'
  })

  const matcher = createMatcher('abc', 'abc')
  const match = matcher._isSubflowNode(node)
  expect(match).toEqual('hello')
})

test.only('_isSubflowNode(node) - no match', () => {
  const node = fakeNode({
    type: 'unknown:hello'
  })
  const matcher = createMatcher('abc', 'abc')
  const match = matcher._isSubflowNode(node)
  expect(match).not.toEqual('hello')
  expect(match).toBe(null)
})


test.only('_matchingNodeZ(node)', () => {
  // TODO
})

test.only('_matchNodeIsSubflow(match) - no match', () => {
  const matcher = createMatcher('abc', 'abc')
  const match = matcher._matchNodeIsSubflow('hello')
  expect(match).toBeFalsy()
})

test.only('_matchNodeIsSubflow(match) - matches', () => {
  const matcher = createMatcher('abc', 'abc')
  const match = matcher._matchNodeIsSubflow('abc')
  expect(match).toBeTruthy()
})


test.only('_checkSubflowContains(node) - no match', () => {

  //define matcher
  const matcher = createMatcher('abc', 'abc')

  // Create node/fakenode for unmatch node parameter
  let sfid = 'x'
  let nodeid = 'a'

  let node = fakeNode({
    z: sfid,
    id: nodeid,
    type: 'unknown:hello'
  })

  // const node = fakeNode({
  //   type: 'unknown:hello'
  // })

  const match = matcher._checkSubflowContains(node)
  // dont know what exactly here toBeFalsy or toBeTruthy
  expect(match).toBeFalsy()

})

test.only('_checkSubflowContains(node) - matches', () => {

  //define matcher
  const matcher = createMatcher('x', 'a')
  // const node = fakeNode({
  //   type: 'subflow:hello'
  // })

  // Create node/fakenode for match node parameter with same sfid and nodeid 
  let sfid = 'x'
  let nodeid = 'a'  
  let node = fakeNode({
    z: sfid,
    id: sfid,
    type: 'subflow:config'
  })   

  const match = matcher._checkSubflowContains(node)  
  // dont know what exactly here toBeFalsy or toBeTruthy
  expect(match).toBeFalsy()

})

test.skip('contains - no match', () => {
  // TODO
})

test('contains - matches', () => {
  let sfid = 'x'
  let nodeid = 'a'

  let subflowConfig = fakeNode({
    z: sfid, // must have a .z property to be compared with subflow ID sfid
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

