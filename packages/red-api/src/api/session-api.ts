import {
  BaseApi
} from './base-api'

export class SessionApi extends BaseApi {
  basePath = 'auth'

  constructor(config?: any) {
    super(config)
  }
}
