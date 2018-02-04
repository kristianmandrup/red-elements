import { User } from '../'
import { UserDisplay } from './display'

import {
  Context,
  delegator,
  delegateTarget,
  delegateTo,
  container,
  lazyInject,
  $TYPES
} from './_base'

import {
  ISettings
} from '@tecla5/red-runtime'

import {
  IMenu
} from '../../_interfaces'

const TYPES = $TYPES.all

export interface IUserConfiguration {
  updateUserMenu()
  configure()
}

@delegateTarget()
@delegator({
  map: {
    display: UserDisplay
  }
})
export class UserConfiguration extends Context implements IUserConfiguration {
  @lazyInject(TYPES.settings) $settings: ISettings
  @lazyInject(TYPES.common.menu) $menu: IMenu

  constructor(public user: User) {
    super()
  }

  protected display: UserDisplay //= new UserDisplay(this.user)

  configure() {
    const {
      $settings,
      $menu
    } = this

    if ($settings.get('user')) {
      const editorTheme = $settings.get('editorTheme')
      if (!editorTheme || !editorTheme.hasOwnProperty('userMenu')) {
        const user: any = $settings.get('user')
        const userMenu = this.userMenu
        user.image ? this.addUserProfile(userMenu) : this.addUserIcon(userMenu)
        $menu.init({
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
      $settings
    } = this
    const user: any = $settings.get('user')
    $('<span class="user-profile"></span>').css({
      backgroundImage: "url(" + user.image + ")",
    }).appendTo(userMenu.find("a"));
  }
}
