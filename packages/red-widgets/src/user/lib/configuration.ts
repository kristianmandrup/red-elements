import { User } from '../'
import { Context } from '../../context'

export class UserConfiguration extends Context {
  constructor(public user: User) {
    super()
  }

  configure() {
    const { RED } = this

    if (RED.settings.user) {
      if (!RED.settings.editorTheme || !RED.settings.editorTheme.hasOwnProperty("userMenu")) {

        var userMenu = $('<li><a id="btn-usermenu" class="button hide" data-toggle="dropdown" href="#"></a></li>')
          .prependTo(".header-toolbar");
        if (RED.settings.user.image) {
          $('<span class="user-profile"></span>').css({
            backgroundImage: "url(" + RED.settings.user.image + ")",
          }).appendTo(userMenu.find("a"));
        } else {
          $('<i class="fa fa-user"></i>').appendTo(userMenu.find("a"));
        }

        RED.menu.init({
          id: "btn-usermenu",
          options: []
        });
        this.updateUserMenu();
      }
    }
  }
}
