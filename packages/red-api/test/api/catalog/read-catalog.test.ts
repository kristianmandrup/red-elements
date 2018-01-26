import {
  createApiMethods
} from '../_infra'
import * as nock from 'nock'
import { expectObj, expectError, expectNotError } from '../../_infra/helpers';

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
  one,
  many
} = createApiMethods(api)


test('CatalogApi: create', () => {
  expectObj(api)
})

test('CatalogApi: create', () => {
  expectObj(api)
})

describe('CatalogApi: load - server error - fails', () => {

  let api, catalog
  beforeEach(() => {
    catalog = new Catalog()
    api = create(catalog)
  })

  test('200 OK - missing catalog - fails', async () => {
    catalog.catalog = null
    simulateResponseOK() // OK
    const result = await one()
    expectError(result)
  })

  test('200 OK - has catalog - no fail', async () => {
    simulateResponseOK() // OK
    const result = await load()
    expectNotError(result)
  })
})


describe('CatalogApi: load - server error - fails', () => {
  const errorCodes = [401, 403, 404, 408]

  let api, catalog
  beforeEach(() => {
    catalog = new Catalog()
    api = create(catalog)
  })

  errorCodes.map(errorCode => {
    test(`${errorCode} error`, async () => {
      simulateResponseCode(errorCode)
      const result = await load()
      expectError(result)
    })
  })
})
