import {
  BaseApi
} from './base-api'

export class I18nCatalogApi extends BaseApi {
  basePath = 'catalog'

  constructor(config?: any) {
    super(config)
  }
}
