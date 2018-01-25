import {
  BaseApi
} from '../base'

import {
  ReadCatalogs
} from './read';

export class I18nCatalogApi extends BaseApi {
  basePath = 'locales'

  public read: ReadCatalogs

  constructor(config?: any) {
    super(config)
  }
}
