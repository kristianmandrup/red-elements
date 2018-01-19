import {
  BaseApi
} from './base-api'

export class I18nCatalogApi extends BaseApi {
  path = 'catalog'

  constructor(config: any) {
    super(config)
  }
}
