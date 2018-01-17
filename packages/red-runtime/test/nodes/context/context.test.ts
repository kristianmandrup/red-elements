import {
  NodesContext
} from '../../..'

import {
  fakeNode
} from '../../_infra'

function create() {
  return new NodesContext()
}

let nodes
beforeEach(() => {
  nodes = create()
})

const { log } = console

const FAKE_RED = {}

test('NodesContext: create', () => {
  expectObj(NodesContext)
})
