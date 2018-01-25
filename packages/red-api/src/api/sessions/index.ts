import {
  BaseApi
} from '../base'

export class SessionsApi extends BaseApi {
  basePath = 'auth'

  constructor(config?: any) {
    super(config)
  }
}
