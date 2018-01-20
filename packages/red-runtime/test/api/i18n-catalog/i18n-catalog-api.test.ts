import {
  I18nCatalogApi
} from '../../../'

import * as nock from 'nock'
import { expectObj, expectError, expectNotError } from '../../_infra/helpers';

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

test('CatalogApi: create', () => {
  expectObj(api)
})



test('CatalogApi: create', () => {
  expectObj(api)
})

function simulateResponseCode(code) {
  return nock(/localhost/)
    .get('catalog')
    .reply(code);
}

function simulateResponseOK(data = {}) {
  return nock(/localhost/)
    .get('catalog')
    .reply(200, data);
}


async function load() {
  try {
    return await api.load()
  } catch (err) {
    return {
      error: err
    }
  }
}

describe('CatalogApi: load - server error - fails', () => {

  let api, catalog
  beforeEach(() => {
    catalog = new Catalog()
    api = create(catalog)
  })

  test('200 OK - missing catalog - fails', async () => {
    catalog.catalog = null
    simulateResponseOK() // OK
    const result = await load()
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
