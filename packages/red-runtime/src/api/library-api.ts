import {
  BaseApi
} from './base-api'

export class LibraryApi extends BaseApi {
  path = 'library'

  constructor(config: any) {
    super(config)
  }
}
