import { User } from '../'
import { Context } from '../../../context'
import { ServerLogin } from './server-login';
import { ServerLogout } from './server-logout';
import { SessionApi } from '../../../../../red-runtime/src/api/session-api';
import { ServerTokenPoster } from './token-poster';

export class UserServer extends Context {
  userLogin: ServerLogin = new ServerLogin(this)
  userLogout: ServerLogout = new ServerLogout(this)
  tokenPoster: ServerTokenPoster = new ServerTokenPoster(this)

  public sessionApi: SessionApi = new SessionApi()

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
