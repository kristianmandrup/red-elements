/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
import {
  Context,
  $
} from '../../context'

global.jQuery = $
import 'jquery-ui-dist/jquery-ui'
import { SessionsApi } from '../../api';
import { UserServer } from './server/index';
import { UserConfiguration } from './configuration';
import { UserDisplay } from './display';
import { UserLogin } from './login';

import {
  delegator,
  container
} from './container'

import {
  IUser
} from './interface'

@delegator({
  container,
  map: {
    configuration: UserConfiguration,
    server: UserServer,
    login: UserLogin,
    display: UserDisplay
  }
})
export class User extends Context {
  public loggedIn: boolean = false

  // TODO: service injection

  public server: UserServer // = new UserServer(this)
  public login: UserLogin // = new UserLogin(this)

  protected configuration: UserConfiguration // = new UserConfiguration(this)
  protected display: UserDisplay // = new UserDisplay(this)

  constructor() {
    super()

    this.configure()
  }

  configure() {
    this.configuration.configure()
    return this
  }

  updateUserMenu() {
    return this.display.updateUserMenu()
  }

  async loginDialog(opts) {
    await this.login.loginDialog(opts)
  }
}

