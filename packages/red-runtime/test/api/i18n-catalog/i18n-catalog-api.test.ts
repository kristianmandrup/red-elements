import {
  I18nCatalogApi
} from '../../../'

import { expectObj } from '../../_infra/helpers';

class I18nCatalog {
  name: string = 'catalog'

  constructor() { }
}

const catalog = new I18nCatalog()

function create() {
  return new I18nCatalogApi({
    $context: catalog
  })
}

let api
beforeEach(() => {
  api = create()
})

test('I18nCatalogApi: create', () => {
  expectObj(api)
})
