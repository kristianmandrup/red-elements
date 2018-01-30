import {
  BaseApi
} from '../base'

export class SessionsApi extends BaseApi {
  basePath = 'auth'

  constructor(config?: any) {
    super(config)
  }

  /**
   * user login with credentials
   * TODO
   * @param credentials
   */
  async login(credentials: any) {
  }

  /**
   * user logout
   * TODO
   */
  async logout() {
  }

  /**
   * revoke auth token
   * TODO
   * @param token
   */
  async revoke(token: any) {
  }
}
