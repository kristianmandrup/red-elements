import {
  NodesContext
} from '../../..'

import {
  expectObj
} from '../../_infra'

import {
  fakeNode
} from '../../_infra'
import { expectFunction, expectString } from '../../_infra/helpers';

function create() {
  return new NodesContext()
}

let nodesCtx
beforeEach(() => {
  nodesCtx = create()
})

const { log } = console

test('NodesContext: create', () => {
  expectObj(nodesCtx)
})

describe('NodesContext: createContext(id: string, seed: any): IContext', () => {
  test('adds get and set functions', () => {
    const id = 'abc', seed = {}
    const ctx = nodesCtx.createContext(id, seed)
    expectFunction(ctx.get)
    expectFunction(ctx.set)
  })
})

// TODO: Test various inputs to test full branching logic (all cases)
describe('NodesContext: get(localId: string, flowId: string): any', () => {
  test('no matching ids', () => {
    const localId = 'blip', flowId = 'x'
    const ctx = nodesCtx.get(localId, flowId)
    expectObj(ctx)
    // TODO: more expectations
  })

  // TODO: more tests here
})

// TODO: Test various inputs to test full branching logic (all cases)
describe('NodesContext: delete(id: string, flowId: string): string', () => {
  test('no matching ids', () => {
    const localId = 'blip', flowId = 'x'
    const contextId = nodesCtx.delete(localId, flowId)
    expectString(contextId)
    // TODO: more expectations
  })

  // TODO: more tests here
})

describe('NodesContext: clean(flowConfig: any): void', () => {
  test('no matching ids', () => {
    const flowConfig = {
      // ... TODO
    }
    const context = nodesCtx.clean(flowConfig)
    expectObj(context)
    // TODO: more expectations
  })

  // TODO: more tests here
})
