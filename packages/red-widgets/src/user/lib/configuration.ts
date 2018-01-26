import { User } from '../'
import { Context } from '../../context'
import { UserDisplay } from './display'

export class UserConfiguration extends Context {

  constructor(public user: User) {
    super()
  }

  protected display: UserDisplay = new UserDisplay(this.user)

  configure() {
    const { RED } = this

    if (RED.settings.user) {
      if (!RED.settings.editorTheme || !RED.settings.editorTheme.hasOwnProperty("userMenu")) {
        const userMenu = this.userMenu
        RED.settings.user.image ? this.addUserProfile(userMenu) : this.addUserIcon(userMenu)
        RED.menu.init({
          id: "btn-usermenu",
          options: []
        });

        this.display.updateUserMenu();

      }
    }
  }

  // protected

  protected addUserIcon(userMenu) {
    $('<i class="fa fa-user"></i>').appendTo(userMenu.find("a"));
  }

  protected get userMenu() {
    return $('<li><a id="btn-usermenu" class="button hide" data-toggle="dropdown" href="#"></a></li>')
      .prependTo(".header-toolbar");

  }

  protected addUserProfile(userMenu) {
    const {
      RED
    } = this
    $('<span class="user-profile"></span>').css({
      backgroundImage: "url(" + RED.settings.user.image + ")",
    }).appendTo(userMenu.find("a"));
  }
}
