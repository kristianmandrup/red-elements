/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
import {
  Context,
  delegator,
  lazyInject,
  $TYPES
} from './_base'

import {
  ILocalStorage,
  LocalStorage
} from './localstorage'

export interface ISettings {
  userDir: string
  hasLocalStorage(): boolean
  get(key: string): string
  set(key: string, value: any)
  delete(prop: string)

  /**
   * Initialize user settings by preparing access token and ajax call
   */
  init(): Promise<any>

  /**
   * load user settings via Ajax call to server API: /settings
   */
  load(): Promise<any>

  /**
   * Set properties of user settings with data loaded
   * @param data
   */
  setProperties(data)

  /**
   * Get theme from settings.editorTheme
   * @param property { string } theme property
   * @param defaultValue { object } default value to use if property not set in user settings
   */
  theme(property: string, defaultValue?: any)
}

import {
  ISettingsLoader,
  SettingsLoader
} from './loader';

const TYPES = $TYPES.all

@delegator({
  map: {
    loader: 'ISettingsLoader'
  }
})
export class Settings extends Context implements ISettings {
  userDir: string
  loadedSettings: any = {}

  protected tokenMatchExpr = /[?&]access_token=(.*?)(?:$|&)/


  @lazyInject(TYPES.localstorage) localStorage: ILocalStorage

  protected loader: ISettingsLoader

  constructor() {
    super()
  }

  /**
   * load user settings via Ajax call to server API: /settings
   */
  async load(): Promise<any> {
    return await this.loader.load()
  }

  /**
   * Whether we have a localstorage available
   * @returns { boolean } whether localstorage is available in browser
   */
  hasLocalStorage(): boolean {
    return this.localStorage.hasLocalStorage()
  }

  /**
   * If the key is not set in the localStorage it returns <i>undefined</i>
   * Else return the JSON parsed value
   * @param key
   * @returns { string } value stored
   */

  get(key: string): string {
    return this.localStorage.get(key)
  }

  /**
   * Set entry of localstorage
   * @param key { string } key (index) to set for
   * @param value { string } value to set
   */
  set(key: string, value: any) {
    this.localStorage.set(key, value)
  }

  /**
   * Initialize user settings by preparing access token and ajax call
   */
  async init(): Promise<any> {
    const { ctx, tokenMatchExpr } = this
    var accessTokenMatch = tokenMatchExpr.exec(window.location.search);
    if (accessTokenMatch) {
      var accessToken = accessTokenMatch[1];
      ctx.settings.set('auth-tokens', {
        access_token: accessToken
      });
      window.location.search = '';
    }
    // Note: now handled by SettingsAPI
    // this._setupApi()
    return await this.load();
  }

  /**
   * Set properties of user settings with data loaded
   * @param data
   */
  setProperties(data) {
    let {
      ctx,
      loadedSettings
    } = this
    ctx.settings = ctx.settings || {}

    for (let prop in loadedSettings) {
      if (loadedSettings.hasOwnProperty(prop) && ctx.settings.hasOwnProperty(prop)) {
        delete ctx.settings[prop];
      }
    }
    for (let prop in data) {
      if (data.hasOwnProperty(prop)) {
        ctx.settings[prop] = data[prop];
      } else {
        this.logWarning('prop not own property of data', {
          data
        })
      }
    }
    this.loadedSettings = data;
    return this
  };

  delete(prop: string) {
    const {
      ctx
    } = this
    delete ctx.settings[prop]
    return this
  }

  /**
   * Get theme from settings.editorTheme
   * @param property { string } theme property
   * @param defaultValue { object } default value to use if property not set in user settings
   */
  theme(property: string, defaultValue?: any) {
    const ctx = this.ctx;
    if (!ctx.settings.editorTheme) {
      return defaultValue;
    }
    var parts = property.split('.');
    var v = ctx.settings.editorTheme;
    try {
      for (var i = 0; i < parts.length; i++) {
        v = v[parts[i]];
      }
      if (v === undefined) {
        return defaultValue;
      }
      return v;
    } catch (err) {
      return defaultValue;
    }
  }
}
