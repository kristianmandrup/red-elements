import {
  Flow
} from '../../..'

import {
  expectObj
} from '../../_infra'

import {
  fakeNode
} from '../../_infra'

import { expectFunction, expectString, expectFunctions } from '../../_infra/helpers';

function create() {
  return new Flow()
}

let flow
beforeEach(() => {
  flow = create()
})

const { log } = console

test('Flow: create', () => {
  expectObj(flow)
})

