import {
  BaseApi
} from './base-api'

export class LibraryApi extends BaseApi {
  basePath = 'libraries'

  constructor(config: any) {
    super(config)
  }
}
