import {
  $,
  widgets,
  readPage
} from '../_infra'

import {
  Context
} from '../../src/context'

class Contextable extends Context {
  constructor() {
    super()
  }
}

let ctx
beforeEach(() => {
  ctx = new Contextable()
})

describe('Context: constructor', () => {
  test('injects RED', () => {
    expect(ctx.RED).toBeDefined()
  })
})
