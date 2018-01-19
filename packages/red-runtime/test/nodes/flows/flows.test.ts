import {
  Flows
} from '../../..'

import {
  expectObj
} from '../../_infra'

import {
  fakeNode
} from '../../_infra'
import { expectFunction, expectString, expectFunctions } from '../../_infra/helpers';

function create() {
  return new Flows()
}

let flows
beforeEach(() => {
  flows = create()
})

const { log } = console

test('Flows: create', () => {
  expectObj(flows)
})

