import {
  simulateResponse,
  api,
  create,
  Settings,
  SettingsApi,
  createApi,
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
} from './_setup'

test('SettingsApi: create', () => {
  expectObj(api)
})


describe('SettingsApi: load - server error - fails', () => {

  let api, settings
  beforeEach(() => {
    settings = new Settings()
    api = create(settings)
  })

  test('200 OK - missing settings - fails', async () => {
    settings.settings = null
    simulateResponseOK() // OK
    const result = await load()
    expectError(result)
  })

  test('200 OK - has settings - no fail', async () => {
    simulateResponseOK() // OK
    const result = await load()
    expectNotError(result)
  })
})


describe('SettingsApi: load - server error - fails', () => {
  const errorCodes = [401, 403, 404, 408]

  let api, settings
  beforeEach(() => {
    settings = new Settings()
    api = create(settings)
  })

  errorCodes.map(errorCode => {
    test(`${errorCode} error`, async () => {
      simulateResponseCode(errorCode)
      const result = await load()
      log({
        result
      })
      expectError(result)
    })
  })
})
