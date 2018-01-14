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
  $
} from './context'

const { log } = console
export class Settings extends Context {
  public loadedSettings: any

  constructor() {
    super()
    this.loadedSettings = {};
  }

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

    return await this.load();
  }

  hasLocalStorage() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  };

  set(key, value) {
    if (!this.hasLocalStorage()) {
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  };

  /**
   * If the key is not set in the localStorage it returns <i>undefined</i>
   * Else return the JSON parsed value
   * @param key
   * @returns {*}
   */
  get(key) {
    if (!this.hasLocalStorage()) {
      return undefined;
    }
    return JSON.parse(localStorage.getItem(key));
  };

  remove(key) {
    if (!this.hasLocalStorage()) {
      return;
    }
    localStorage.removeItem(key);
  };

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

  async load() {
    const {
      ctx,
      setProperties
    } = this.rebind([
        'setProperties'
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
          setProperties(data);
          if (!ctx.settings.user || ctx.settings.user.anonymous) {
            ctx.settings.remove('auth-tokens');
          }
          log('Node-RED: ' + data.version);
          resolve(data)
        },
        error: (jqXHR, textStatus, errorThrown) => {
          if (jqXHR.status === 401) {
            if (/[?&]access_token=(.*?)(?:$|&)/.test(window.location.search)) {
              window.location.search = '';
            }
            reject(errorThrown)
            // ctx.user.login(this.load);
          } else {
            this.handleError('Unexpected error:', {
              status: jqXHR.status,
              textStatus
            });
          }
        }
      });
    })
  };

  theme(property, defaultValue) {
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
