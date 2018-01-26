import {
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
} from '../_infra'

import {
  I18nCatalogApi
} from '../../../src'

class Catalog {
  name: string = 'catalog'

  constructor() { }
}

function create(catalog: Catalog) {
  return new I18nCatalogApi({
    $context: catalog
  })
}

let api
beforeEach(() => {
  const catalog = new Catalog()
  api = create(catalog)
})

const {
  simulateResponse
} = createResponseSimulations('libraries')

test('CatalogApi: create', () => {
  expectObj(api)
})

test('CatalogApi: create', () => {
  expectObj(api)
})

describe('CatalogApi: load - server error - fails', () => {

  let api, catalog, $api
  beforeEach(() => {
    catalog = new Catalog()
    api = create(catalog)
    $api = createApiMethods(api, 'create')
  })

  test('200 OK - missing catalog - fails', async () => {
    catalog.catalog = null
    simulateResponse() // OK
    const result = await $api.one()
    expectError(result)
  })

  test('200 OK - has catalog - no fail', async () => {
    simulateResponse() // OK
    const result = await $api.one()
    expectNotError(result)
  })
})


describe('CatalogApi: load - server error - fails', () => {
  const errorCodes = [401, 403, 404, 408]

  let api, catalog, $api
  beforeEach(() => {
    catalog = new Catalog()
    api = create(catalog)
    $api = createApiMethods(api, 'create')
  })

  errorCodes.map(errorCode => {
    test(`${errorCode} error`, async () => {
      simulateResponse(errorCode)
      const result = await $api.one()
      expectError(result)
    })
  })
})
