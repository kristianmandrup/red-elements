import {
  simulateResponse,
  api,
  create,
  Projects,
  ProjectsApi,
  createApi,
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
} from './_setup'

test('ProjectsApi: create', () => {
  expectObj(api)
})


describe('ProjectsApi: all', () => {
  describe('OK', () => {
    let $api, projects
    beforeEach(() => {
      ({ $api, projects } = createApi())
    })

    test('has flows - works', async () => {
      simulateResponse() // OK
      const result = await $api.all()
      expectNotError(result)
    })
  })

  describe('API errors', () => {
    let $api, projects
    beforeEach(() => {
      ({ $api, projects } = createApi())
    })

    test('200 OK - missing ???', async () => {
      // flows.flows = null
      simulateResponse() // OK
      const result = await $api.all()
      expectError(result)
    })

    describe('HTTP server error', () => {
      const errorCodes = [401, 403, 404, 408]

      let $api, projects
      beforeEach(() => {
        ({ $api, projects } = createApi())
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

