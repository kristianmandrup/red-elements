import {
  BaseApiCreate
} from '../../../../src/api/base'

const $api = {
}

function create(api?): BaseApiCreate {
  api = api || $api
  return new BaseApiCreate(api)
}

let api: BaseApiCreate
beforeEach(() => {
  api = create()
})

describe('BaseApiCreate', () => {
  test('created', () => {
    expect(api).toBeDefined()
  })

  test('one', async () => {
    const data = {
      txt: 'hello'
    }
    const result = await api.one(data)
    expect(result).toBeDefined()
  })

  test('many', async () => {
    const data = [{
      txt: 'hello'
    }, {
      txt: 'goodbye'
    }]
    const result = await api.many(data)
    expect(result).toBeDefined()
  })
})
