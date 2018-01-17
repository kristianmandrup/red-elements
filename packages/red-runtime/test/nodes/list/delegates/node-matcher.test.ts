import {
  Nodes,
} from '../../../..'

import {
  NodeMatcher
} from '../../../../src/nodes/list/node-matcher'

import {
  fakeNode
} from '../../../_infra'

import { expectObj } from '../../../_infra/helpers';

const $nodes = new Nodes()

function create() {
  return new NodeMatcher($nodes)
}

let matcher
beforeEach(() => {
  matcher = create()
})

const { log } = console

const FAKE_RED = {}

test('Matcher: create', () => {
  expectObj(matcher)
})

// TODO: more tests
