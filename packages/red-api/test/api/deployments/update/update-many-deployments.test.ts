import {
  simulateResponse,
  api,
  createApi,
  create,
  Deployments,
  DeploymentsApi,
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
} from './_setup'

test('DeploymentsApi: create', () => {
  expectObj(api)
})

describe('DeploymentsApi: many', () => {
  describe('OK', () => {
    let deployments, $api
    beforeEach(() => {
      ({ $api, deployments } = createApi())
    })

    test('has flows - works', async () => {
      simulateResponse() // OK
      const result = await $api.many()
      expectNotError(result)
    })
  })

  describe('API errors', () => {
    let deployments, $api
    beforeEach(() => {
      ({ $api, deployments } = createApi())
    })

    test('200 OK - missing ??', async () => {
      // TODO: setup deployments to be missing sth
      // deployments.flows = null
      simulateResponse() // OK
      const result = await $api.many()
      expectError(result)
    })

    describe('HTTP server error', () => {
      const errorCodes = [401, 403, 404, 408]

      let api, flows, $api
      beforeEach(() => {
        flows = new Deployments()
        api = create(flows)
        $api = createApiMethods(api, 'create')
      })

      errorCodes.map(errorCode => {
        test(`${errorCode} error`, async () => {
          simulateResponse(errorCode)
          const result = await $api.many()
          expectError(result)
        })
      })
    })
  })
})

