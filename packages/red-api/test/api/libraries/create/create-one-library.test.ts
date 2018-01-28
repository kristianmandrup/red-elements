import {
  simulateResponse,
  api,
  create,
  createApi,
  Library,
  LibrariesApi,
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
} from './_setup'

test('LibrariesApi: create', () => {
  expectObj(api)
})

describe('LibrariesApi: one', () => {
  describe('OK', () => {
    let library, $api
    beforeEach(() => {
      ({ $api, library } = createApi())
    })

    test('has flows - works', async () => {
      simulateResponse() // OK
      const result = await $api.one()
      expectNotError(result)
    })
  })

  describe('API errors', () => {
    let library, $api
    beforeEach(() => {
      ({ $api, library } = createApi())
    })

    test('200 OK - missing ??', async () => {
      // TODO: setup library to be missing sth
      // library.flows = null
      simulateResponse() // OK
      const result = await $api.many()
      expectError(result)
    })

    describe('HTTP server error', () => {
      const errorCodes = [401, 403, 404, 408]

      let library, $api
      beforeEach(() => {
        ({ $api, library } = createApi())
      })

      errorCodes.map(errorCode => {
        test(`${errorCode} error`, async () => {
          simulateResponse(errorCode)
          const result = await $api.one()
          expectError(result)
        })
      })
    })
  })
})

