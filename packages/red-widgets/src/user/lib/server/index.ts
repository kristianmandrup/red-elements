import { User } from '../'
import { ServerLogin } from './server-login';
import { ServerLogout } from './server-logout';

import { ServerTokenPoster } from './token-poster';

import {
  Context,
  delegator,
  delegateTo,
  delegateTarget,
  container,
  SessionsApi
} from '../_base'

@delegator({
  container,
  map: {
    userLogin: ServerLogin,
    userLogout: ServerLogout,
    tokenPoster: ServerTokenPoster,
    // sessionsApi: SessionsApi
  }
})
@delegateTarget({
  container,
})
export class UserServer extends Context {
  userLogin: ServerLogin // = new ServerLogin(this)
  userLogout: ServerLogout // = new ServerLogout(this)
  tokenPoster: ServerTokenPoster // = new ServerTokenPoster(this)

  sessionsApi: SessionsApi // = new SessionApi()

  constructor(public user: User) {
    super()
  }

  /**
   *
   * @param data
   * @param opts
   */
  async postAuthToken(data, opts) {
    this.tokenPoster.postAuthToken(data, opts)
  }

  /**
   *
   * @param opts
   */
  async login(opts) {
    await this.userLogin.login(opts)
  }

  /**
   *
   */
  async logout() {
    await this.userLogout.logout()
  }


}
