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
  const matcher = createMatcher('abc', 'abc')
  const node = fakeNode({
    // ... ??? set props to NOT match
  })
  const match = matcher._checkSubflowContains(node)
  expect(match).toBeTruthy()
})

test.only('_checkSubflowContains(node) - matches', () => {
  const matcher = createMatcher('abc', 'abc')
  const node = fakeNode({
    // ... ??? set props to match
  })
  const match = matcher._checkSubflowContains(node)
  expect(match).toBeTruthy()
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

