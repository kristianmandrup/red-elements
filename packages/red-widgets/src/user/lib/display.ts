import { User } from '../'
import { Context } from '../../context'

import {
  delegateTarget,
  container
} from './container'

@delegateTarget({
  container,
})
export class UserDisplay extends Context {
  constructor(public user: User) {
    super()
  }

  updateUserMenu() {
    const {
      RED,
      rebind,
      user
    } = this

    const {
      updateUserMenu
    } = rebind([
        'updateUserMenu'
      ], user)

    $("#btn-usermenu-submenu li").remove();
    if (RED.settings.user.anonymous) {
      RED.menu.addItem("btn-usermenu", {
        id: "usermenu-item-login",
        label: RED._("menu.label.login"),
        onselect: () => {
          RED.user.login({
            cancelable: true
          }, () => {
            RED.settings.load(function () {
              RED.notify(RED._("user.loggedInAs", {
                name: RED.settings.user.username
              }), "success");
              updateUserMenu();
            });
          });
        }
      });
    } else {
      RED.menu.addItem("btn-usermenu", {
        id: "usermenu-item-username",
        label: "<b>" + RED.settings.user.username + "</b>"
      });
      RED.menu.addItem("btn-usermenu", {
        id: "usermenu-item-logout",
        label: RED._("menu.label.logout"),
        onselect: function () {
          RED.user.logout();
        }
      });
    }
    return this
  }
}
