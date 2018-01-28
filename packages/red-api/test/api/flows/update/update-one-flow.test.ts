import {
  simulateResponse,
  api,
  create,
  Flows,
  FlowsApi,
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
} from './_setup'

test('FlowsApi: create', () => {
  expectObj(api)
})


describe('FlowsApi: load - server error - fails', () => {

  let api, flows, $api
  beforeEach(() => {
    flows = new Flows()
    api = create(flows)
    $api = createApiMethods(api, 'create')
  })

  test('200 OK - missing flows - fails', async () => {
    flows.flows = null
    simulateResponse() // OK
    const result = await $api.one()
    expectError(result)
  })

  test('200 OK - has flows - no fail', async () => {
    simulateResponse() // OK
    const result = await $api.one()
    expectNotError(result)
  })
})


describe('FlowsApi: load - server error - fails', () => {
  const errorCodes = [401, 403, 404, 408]

  let api, flows, $api
  beforeEach(() => {
    flows = new Flows()
    api = create(flows)
    $api = createApiMethods(api, 'create')
  })

  errorCodes.map(errorCode => {
    test(`${errorCode} error`, async () => {
      simulateResponse(errorCode)
      const result = await $api.one()
      expectError(result)
    })
  })
})
