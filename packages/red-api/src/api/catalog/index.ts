import {
  BaseApi
} from '../base'

import {
  ReadCatalog
} from './read';

export class I18nCatalogApi extends BaseApi {
  basePath = 'locales'

  public read: ReadCatalog

  constructor(config?: any) {
    super(config)
  }
}
