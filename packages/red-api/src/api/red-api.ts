import {
  BaseApi
} from './base-api'

export class RedApi extends BaseApi {
  basePath = 'red'

  constructor(config?: any) {
    super(config)
  }
}
