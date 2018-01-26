import {
  BaseApiUpdate
} from '../../../../src/api/base'

const $api = {
}

function create(api?): BaseApiUpdate {
  api = api || $api
  return new BaseApiUpdate(api)
}

let api: BaseApiUpdate
beforeEach(() => {
  api = create()
})

describe('BaseApiUpdate', () => {
  test('created', () => {
    expect(api).toBeDefined()
  })

  test('one', async () => {
    const id = 'test123'
    const data = {
      txt: 'hello'
    }
    const result = await api.one(data, id)
    expect(result).toBeDefined()
  })

  test('many', async () => {
    const ids = ['test123', 'abc']
    const data = [{
      txt: 'hello'
    }, {
      txt: 'goodbye'
    }]
    const result = await api.many(ids, data)
    expect(result).toBeDefined()
  })
})
