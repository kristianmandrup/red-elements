import {
  simulateResponse,
  api,
  createApi,
  create,
  Library,
  LibrariesApi,
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
} from './_setup'

test('LibrariesApi: create', () => {
  expectObj(api)
})


test('LibrariesApi: create', () => {
  expectObj(api)
})

describe('LibrariesApi: many', () => {
  describe('OK', () => {
    let library, $api
    beforeEach(() => {
      ({ $api, library } = createApi())
    })

    test('has flows - works', async () => {
      simulateResponse() // OK
      const result = await $api.many()
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

      let api, flows, $api
      beforeEach(() => {
        flows = new Library()
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

