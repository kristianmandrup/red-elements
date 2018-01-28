import {
  simulateResponse,
  api,
  create,
  Deployments,
  DeploymentsApi,
  createApi,
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
} from './_setup'

test('DeploymentsApi: create', () => {
  expectObj(api)
})


describe('DeploymentsApi: all', () => {
  describe('OK', () => {
    let $api, deployments
    beforeEach(() => {
      ({ $api, deployments } = createApi())
    })

    test('has flows - works', async () => {
      simulateResponse() // OK
      const result = await $api.all()
      expectNotError(result)
    })
  })

  describe('API errors', () => {
    let $api, deployments
    beforeEach(() => {
      ({ $api, deployments } = createApi())
    })

    test('200 OK - missing ???', async () => {
      // flows.flows = null
      simulateResponse() // OK
      const result = await $api.all()
      expectError(result)
    })

    describe('HTTP server error', () => {
      const errorCodes = [401, 403, 404, 408]

      let $api, deployments
      beforeEach(() => {
        ({ $api, deployments } = createApi())
      })

      errorCodes.map(errorCode => {
        test(`${errorCode} error`, async () => {
          simulateResponse(errorCode)
          const result = await $api.all()
          expectError(result)
        })
      })
    })
  })
})

