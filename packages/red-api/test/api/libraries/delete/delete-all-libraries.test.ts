import {
  simulateResponse,
  api,
  create,
  Library,
  LibrariesApi,
  createApi,
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
} from './_setup'

test('LibraryApi: create', () => {
  expectObj(api)
})


describe('LibrariesApi: all', () => {
  describe('OK', () => {
    let $api, library
    beforeEach(() => {
      ({ $api, library } = createApi())
    })

    test('has flows - works', async () => {
      simulateResponse() // OK
      const result = await $api.all()
      expectNotError(result)
    })
  })

  describe('API errors', () => {
    let $api, library
    beforeEach(() => {
      ({ $api, library } = createApi())
    })

    test('200 OK - missing ???', async () => {
      // flows.flows = null
      simulateResponse() // OK
      const result = await $api.all()
      expectError(result)
    })

    describe('HTTP server error', () => {
      const errorCodes = [401, 403, 404, 408]

      let $api, library
      beforeEach(() => {
        ({ $api, library } = createApi())
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

