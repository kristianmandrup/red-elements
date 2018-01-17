import {
  Nodes,
} from '../../../..'

import {
  LinkManager
} from '../../../../src/nodes/list/link-manager'

import {
  fakeNode
} from '../../../_infra'

import { expectObj } from '../../../_infra/helpers';

const $nodes = new Nodes()

function create() {
  return new LinkManager($nodes)
}

let linkManager
beforeEach(() => {
  linkManager = create()
})

const { log } = console

const FAKE_RED = {}

test('LinkManager: create', () => {
  expectObj(linkManager)
})

// TODO: more tests
