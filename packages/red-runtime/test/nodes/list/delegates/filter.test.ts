import {
  Nodes,
} from '../../../..'

import {
  Filter
} from '../../../../src/nodes/list/filter'

import {
  fakeNode
} from '../../../_infra'

import { expectObj } from '../../../_infra/helpers';

const $nodes = new Nodes()

function create() {
  return new Filter($nodes)
}

let filter
beforeEach(() => {
  filter = create()
})

const { log } = console

const FAKE_RED = {}

test('Filter: create', () => {
  expectObj(filter)
})

// TODO: more tests
