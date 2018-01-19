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

describe('Flows: async load()', () => {
  test('loads ok', async () => {
    const loaded = await flows.load()
    expectObj(loaded)
  })

  test('load fails', async () => {
    try {
      const loadErr = await flows.load()

      // no return value expected?
    } catch (err) {
      expectObj(err)
    }
  })
})

test('Flows: async load()', async () => {
  const loaded = await flows.load()
  expectObj(loaded)
})

describe('Flows: async setFlows(_config: any, type: string, muteLog: boolean)', () => {
  test('sets ok', async () => {
    const config = {}, type = 'subflow'

    const result = await flows.setFlows(config, type)
    expectObj(result)
  })

  test('set fails', async () => {
    try {
      const config = {}, type = 'subflow'
      const result = await flows.setFlows(config, type)

      // no return value expected?
    } catch (err) {
      expectObj(err)
    }
  })
})

describe('Flows: getNode(id: string): INode', () => {
})

describe('Flows: eachNode(cb: Function)', () => {
})

describe('Flows: getFlows(): IFlow[]', () => {
})

describe('Flows: async startFlows(type: string, diff: any, muteLog: boolean)', () => {
})

describe('Flows: async stopFlows(type: string, diff: any, muteLog: boolean)', () => {
})

describe('Flows: addFlow(flow: IFlow)', () => {
})

describe('Flows: checkTypeInUse(id: string): void', () => {
})







