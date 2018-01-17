import {
  Nodes,
} from '../../../..'

import {
  Iterator
} from '../../../../src/nodes/list/iterator'

import {
  fakeNode
} from '../../../_infra'

import { expectObj } from '../../../_infra/helpers';

const $nodes = new Nodes()

function create() {
  return new Iterator($nodes)
}

let iterator
beforeEach(() => {
  iterator = create()
})

const { log } = console

const FAKE_RED = {}

test('Iterator: create', () => {
  expectObj(iterator)
})

// TODO: more tests
