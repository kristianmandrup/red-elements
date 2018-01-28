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

describe('SettingsApi: one', () => {
  describe('OK', () => {
    let settings, $api
    beforeEach(() => {
      ({ $api, settings } = createApi())
    })

    test('has settings - works', async () => {
      simulateResponse() // OK
      const result = await $api.one()
      expectNotError(result)
    })
  })

  describe('API errors', () => {
    let settings, $api
    beforeEach(() => {
      ({ $api, settings } = createApi())
    })

    test('200 OK - missing ??', async () => {
      // TODO: setup settings to be missing sth
      // settings.settings = null
      simulateResponse() // OK
      const result = await $api.many()
      expectError(result)
    })

    describe('HTTP server error', () => {
      const errorCodes = [401, 403, 404, 408]

      let settings, $api
      beforeEach(() => {
        ({ $api, settings } = createApi())
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

