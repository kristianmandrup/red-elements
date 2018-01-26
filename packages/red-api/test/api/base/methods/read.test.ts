import {
  BaseApiRead
} from '../../../../src/api/base'

const $api = {
}

function create(api?): BaseApiRead {
  api = api || $api
  return new BaseApiRead(api)
}

let api: BaseApiRead
beforeEach(() => {
  api = create()
})

describe('BaseApiRead', () => {
  test('created', () => {
    expect(api).toBeDefined()
  })

  test('one', async () => {
    const id = 'test123'
    const result = await api.one(id)
    expect(result).toBeDefined()
  })

  test('many', async () => {
    const ids = ['test123', 'abc']
    const result = await api.many(ids)
    expect(result).toBeDefined()
  })

  test('all', async () => {
    const result = await api.all()
    expect(result).toBeDefined()
  })
})
