import {
  NodesContext
} from '../../..'

import {
  expectObj
} from '../../_infra'

import {
  fakeNode
} from '../../_infra'

function create() {
  return new NodesContext()
}

let nodesCtx
beforeEach(() => {
  nodesCtx = create()
})

const { log } = console

const FAKE_RED = {}

test('NodesContext: create', () => {
  expectObj(nodesCtx)
})
