import {
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
} from '../../_infra'

import {
  SettingsApi
} from '../../../../src'

class Settings {
  name: string = 'settings'

  constructor() { }
}

function create(settings: Settings) {
  return new SettingsApi({
    $context: settings
  })
}

let api
beforeEach(() => {
  const settings = new Settings()
  api = create(settings)
})

const $method = 'read'
const $basePath = 'settings'

const {
  simulateResponse
} = createResponseSimulations($basePath, $method)

function createApi(method?) {
  const settings = new Settings()
  const api = create(settings)

  return {
    settings,
    $api: createApiMethods(api, method || $method)
  }
}

export {
  simulateResponse,
  api,
  createApi,
  create,
  Settings,
  SettingsApi,
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
}
