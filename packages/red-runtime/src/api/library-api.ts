import {
  BaseApi
} from './base-api'

export class LibraryApi extends BaseApi {
  basePath = 'library'

  constructor(config: any) {
    super(config)
  }
}
