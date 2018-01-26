import {
  BaseApiMethod
} from '../../../../src/api/base'

const $api = {
}

function create(api?): BaseApiMethod {
  api = api || $api
  return new BaseApiMethod(api)
}

let api: BaseApiMethod
beforeEach(() => {
  api = create()
})

describe('BaseApiMethod', () => {
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
    const data = {
      txt: 'hello'
    }
    expect(async () => await api.one(data)).toThrow()
  })

  test('many', async () => {
    const ids = ['test123', 'abc']
    const data = [{
      txt: 'hello'
    }, {
      txt: 'goodbye'
    }]

    expect(async () => await api.many(ids, data)).toThrow()
  })
})
