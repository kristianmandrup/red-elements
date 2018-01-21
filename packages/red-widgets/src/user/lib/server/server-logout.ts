import { User } from '../'
import { Context } from '../../../context'
import { UserServer } from './index';

export class ServerLogout extends Context {
  constructor(public userServer: UserServer) {
    super()
  }

  get sessionApi() {
    return this.userServer.sessionApi
  }


  get user() {
    return this.userServer.user
  }

  /**
   * logout
   */
  async logout() {
    const {
      RED
    } = this
    var tokens = RED.settings.get("auth-tokens");
    var token = tokens ? tokens.access_token : "";
    const data = {
      token
    }
    await this.serverUserLogout(data)
  }

  async serverUserLogout(data) {
    const {
      onUserLogoutSuccess,
      onUserLogoutError
    } = this

    this.sessionApi.configure({
      url: 'auth/revoke'
    })
    try {
      const result = await this.sessionApi.post(data)
      onUserLogoutSuccess(result)
    } catch (error) {
      onUserLogoutError(error)
    }
  }

  onUserLogoutSuccess(data) {
    const {
    RED
  } = this
    RED.settings.remove("auth-tokens");
    if (data && data.redirect) {
      document.location.href = data.redirect;
    } else {
      document.location.reload(true);
    }
    this.loggedIn = false
    return { loggedOut: !this.loggedIn }
  }

  onUserLogoutError(error) {
    const {
      jqXHR, textStatus, errorThrown
    } = error
    if (jqXHR.status === 401) {
      document.location.reload(true);
    } else {
      console.log(textStatus);
    }
    this.loggedIn = true
    return { loggedOut: !this.loggedIn }
  }
}
