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
  Context
} from '../context'

import {
  ILocalStorage,
  LocalStorage
} from './localstorage'

export interface ISettings {
  hasLocalStorage(): boolean
  get(key: string): string
  set(key: string, value: any)

  /**
   * Initialize user settings by preparing access token and ajax call
   */
  init()

  /**
   * load user settings via Ajax call to server API: /settings
   */
  load()

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
  theme(property: string, defaultValue: any)
}

const { log } = console
export class Settings extends Context implements ISettings {
  public loadedSettings: any = {}

  protected localStorage: ILocalStorage

  constructor() {
    super()
    this.localStorage = new LocalStorage()
  }

  hasLocalStorage(): boolean {
    return this.localStorage.hasLocalStorage()
  }

  get(key: string): string {
    return this.localStorage.get(key)
  }

  set(key: string, value: any) {
    this.localStorage.set(key, value)
  }

  /**
   * Initialize user settings by preparing access token and ajax call
   */
  async init() {
    const { ctx } = this
    var accessTokenMatch = /[?&]access_token=(.*?)(?:$|&)/.exec(window.location.search);
    if (accessTokenMatch) {
      var accessToken = accessTokenMatch[1];
      ctx.settings.set('auth-tokens', {
        access_token: accessToken
      });
      window.location.search = '';
    }
    this._setup()
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

  /**
   * load user settings via Ajax call to server API: /settings
   */
  async load() {
    const {
      _onLoadSuccess,
      _onLoadError
    } = this.rebind([
        '_onLoadSuccess',
        '_onLoadError'
      ])

    return new Promise((resolve, reject) => {
      $.ajax({
        headers: {
          'Accept': 'application/json'
        },
        dataType: 'json',
        cache: false,
        url: 'settings',
        success: (data) => {
          _onLoadSuccess(data)
          resolve(data)
        },
        error: (jqXHR, textStatus, errorThrown) => {
          try {
            _onLoadError({
              jqXHR, textStatus, errorThrown
            })
          } finally {
            reject(errorThrown)
          }
        }
      });
    })
  };

  /**
   * Get theme from settings.editorTheme
   * @param property { string } theme property
   * @param defaultValue { object } default value to use if property not set in user settings
   */
  theme(property: string, defaultValue: any) {
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

  /**
   * Setup Ajax call with Authorization using JWT Bearer token
   */
  protected _setup() {
    const { ctx } = this
    $.ajaxSetup({
      beforeSend: function (jqXHR, settings) {
        // Only attach auth header for requests to relative paths
        if (!/^\s*(https?:|\/|\.)/.test(settings.url)) {
          var auth_tokens = ctx.settings.get('auth-tokens');
          if (auth_tokens) {
            jqXHR.setRequestHeader('Authorization', 'Bearer ' + auth_tokens.access_token);
          }
          jqXHR.setRequestHeader('Node-RED-API-Version', 'v2');
        }
      }
    });
  }

  /**
   * Handle load error on Ajax API call to /settings
   * @param error { object } the error
   */
  protected _onLoadError(error) {
    const {
      jqXHR,
      textStatus
    } = error

    if (jqXHR.status === 401) {
      if (/[?&]access_token=(.*?)(?:$|&)/.test(window.location.search)) {
        window.location.search = '';
      }
      // ctx.user.login(this.load);
    } else {
      this.handleError('Unexpected error:', {
        status: jqXHR.status,
        textStatus
      });
    }
  }

  /**
   * Handle load success on Ajax API call to /settings
   * @param data { object } the user settings data
   */
  protected _onLoadSuccess(data) {
    const {
      ctx,
      setProperties
    } = this.rebind([
        'setProperties'
      ])

    setProperties(data);
    if (!ctx.settings.user || ctx.settings.user.anonymous) {
      ctx.settings.remove('auth-tokens');
    }
    log('Node-RED: ' + data.version);
  }
}
