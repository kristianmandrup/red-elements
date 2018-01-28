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

function create(library: Settings) {
  return new SettingsApi({
    $context: library
  })
}

let api
beforeEach(() => {
  const library = new Settings()
  api = create(library)
})

const $method = 'read'
const $basePath = 'settings'

const {
  simulateResponse
} = createResponseSimulations($basePath, $method)

function createApi(method?) {
  const library = new Settings()
  const api = create(library)

  return {
    library,
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
