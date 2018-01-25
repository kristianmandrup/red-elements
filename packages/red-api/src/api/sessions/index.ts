import {
  BaseApi
} from '../base'

export class SessionApi extends BaseApi {
  basePath = 'auth'

  constructor(config?: any) {
    super(config)
  }
}
