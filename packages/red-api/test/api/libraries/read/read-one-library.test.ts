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

test('LibraryApi: create', () => {
  expectObj(api)
})


describe('LibraryApi: load - server error - fails', () => {

  let $api, library
  beforeEach(() => {
    ({ $api, library } = createApi())
  })

  test('200 OK - missing library - fails', async () => {
    library.library = null
    simulateResponse() // OK
    const result = await $api.one()
    expectError(result)
  })

  test('200 OK - has library - no fail', async () => {
    simulateResponse() // OK
    const result = await $api.one()
    expectNotError(result)
  })
})


describe('LibraryApi: load - server error - fails', () => {
  const errorCodes = [401, 403, 404, 408]

  let $api, library
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
