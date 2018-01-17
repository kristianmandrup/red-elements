import {
  Nodes,
} from '../../../..'

import {
  Serializer
} from '../../../../src/nodes/list/serializer'

import {
  fakeNode
} from '../../../_infra'

import { expectObj } from '../../../_infra/helpers';

const $nodes = new Nodes()

function create() {
  return new Serializer($nodes)
}

let serializer
beforeEach(() => {
  serializer = create()
})

const { log } = console

const FAKE_RED = {}

test('Serializer: create', () => {
  expectObj(serializer)
})

// TODO: more tests
