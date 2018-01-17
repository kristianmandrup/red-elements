import {
  Nodes,
} from '../../../..'

import {
  Converter
} from '../../../../src/nodes/list/converter'

import {
  fakeNode
} from '../../../_infra'

import { expectObj } from '../../../_infra/helpers';

const $nodes = new Nodes()

function create() {
  return new Converter($nodes)
}

let converter
beforeEach(() => {
  converter = create()
})

const { log } = console

const FAKE_RED = {}

test('Converter: create', () => {
  expectObj(converter)
})

// TODO: more tests
