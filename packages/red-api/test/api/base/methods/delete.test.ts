import {
  BaseApiDelete
} from '../../../../src/api/base'

const $api = {
}

function create(api?): BaseApiDelete {
  api = api || $api
  return new BaseApiDelete(api)
}

let api: BaseApiDelete
beforeEach(() => {
  api = create()
})

describe('BaseApiDelete', () => {
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
