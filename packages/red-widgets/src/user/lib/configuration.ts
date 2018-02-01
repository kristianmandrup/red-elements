import { User } from '../'
import { UserDisplay } from './display'

import {
  Context,
  delegator,
  delegateTarget,
  delegateTo,
  container
} from './_base'

import {
  lazyInject,
  $TYPES
} from '../../_container'

import {
  ISettings
} from '@tecla5/red-runtime'

import {
  IMenu
} from '../../_interfaces'

const TYPES = $TYPES.all

@delegator({
  container,
  map: {
    display: UserDisplay
  }
})
@delegateTarget({
  container
})
export class UserConfiguration extends Context {

  @lazyInject(TYPES.settings) settings: ISettings
  @lazyInject(TYPES.menu) menu: IMenu

  constructor(public user: User) {
    super()
  }

  protected display: UserDisplay //= new UserDisplay(this.user)

  configure() {
    const { settings, menu } = this

    if (settings.user) {
      if (!settings.editorTheme || !settings.editorTheme.hasOwnProperty("userMenu")) {
        const userMenu = this.userMenu
        settings.user.image ? this.addUserProfile(userMenu) : this.addUserIcon(userMenu)
        menu.init({
          id: "btn-usermenu",
          options: []
        });

        this.updateUserMenu();

      }
    }
  }

  @delegateTo('display')
  updateUserMenu() {
    // this.display.updateUserMenu();
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
      settings
    } = this
    $('<span class="user-profile"></span>').css({
      backgroundImage: "url(" + settings.user.image + ")",
    }).appendTo(userMenu.find("a"));
  }
}
