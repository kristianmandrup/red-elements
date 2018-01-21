import { User } from '../'
import { Context } from '../../../context'
import { UserServer } from './index';

interface IDialogElem extends JQuery<HTMLElement> {
  dialog: Function
}


export class ServerTokenPoster extends Context {
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
   * Post Auth token to server
   * @param data
   * @param opts
   */
  async postAuthToken(data, opts) {
    const {
      onTokenPostSuccess,
      onTokenPostError,
      onTokenFinally
  } = this

    this.sessionApi.configure({
      url: 'auth/token'
    })

    try {
      const result = await this.sessionApi.delete()
      onTokenPostSuccess(result, opts)
    } catch (error) {
      onTokenPostError(error)
    } finally {
      onTokenFinally(opts)
    }
  }

  onTokenPostSuccess(data, opts: any) {
    const {
    RED
  } = this
    const {
    updateUserMenu
  } = this.rebind([
        'updateUserMenu'
      ])

    RED.settings.set("auth-tokens", data);
    const loginDialog = <IDialogElem>$("#node-dialog-login")
    loginDialog.dialog('destroy').remove();
    if (opts.updateMenu) {
      updateUserMenu();
    }
    this.loggedIn = true
    return { loggedIn: this.loggedIn }
  }

  onTokenPostError(error) {
    const {
    RED
  } = this
    RED.settings.remove("auth-tokens");
    $("#node-dialog-login-failed").show();
    this.loggedIn = false
    return { loggedIn: this.loggedIn }
  }

  onTokenFinally(opts: any = {}) {
    const { buttonElem } = opts

    buttonElem.button("option", "disabled", false);
    $(".login-spinner").hide();
  }
}
