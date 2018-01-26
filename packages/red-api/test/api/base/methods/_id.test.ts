import {
  BaseApiId
} from '../../../../src/api/base'

const $api = {
}

function create(api?): BaseApiId {
  api = api || $api
  return new BaseApiId(api)
}

let api: BaseApiId
beforeEach(() => {
  api = create()
})

describe('BaseApiId', () => {
  test('created', () => {
    expect(api).toBeDefined()
  })

  test('configure()', () => {
    const x = 2
    const config = {
      x
    }
    const configured: any = api.configure(config)
    expect(configured.config.x).toBe(x)
  })

  test('one', async () => {
    const id = 'abc'
    expect(async () => await api.one(id)).toThrow()
  })

  test('many', async () => {
    const ids = ['test123', 'abc']
    expect(async () => await api.many(ids)).toThrow()
  })
})
