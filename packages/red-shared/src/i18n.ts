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
} from './context'
import * as i18n from 'i18next'
import { InitOptions } from 'i18next';

const { log } = console

const { promisify } = require('util')

function detectLanguage(fallbackLng = 'en') {
  if (navigator) {
    return navigator.language
  } else {
    return fallbackLng;
  }
}

// See: https://www.i18next.com/getting-started.html
export class I18n extends Context {
  public i18n: any

  constructor() {
    super()
    const { RED } = this
    RED._ = (key, arg) => {
      return this.i18n.t(key, arg);
    }
    this.RED = RED
    this.i18n = i18n;
  }

  get defaultOptions() {
    return {
      saveMissing: true,
      debug: true
    }
  }

  get config(): InitOptions {
    return {
      load: 'currentOnly',
      ns: ["editor", "node-red", "jsonata", "infotips"],
      defaultNS: "editor",
      fallbackLng: ['en-US'],
    }
  }

  async init() {
    return new Promise((resolve, reject) => {
      i18n.init(this.config, (err, t) => {
        err ? reject(err) : resolve()
      })
    })
  }

  detectLanguage() {
    return detectLanguage()
  }

  async loadCatalog(namespace) {
    var languageList = [detectLanguage()]

    var toLoad = languageList.length;
    return new Promise((resolve, reject) => {
      languageList.forEach((lang) => {
        const url = 'locales/' + namespace + '?lng=' + lang
        log('request language localisations', {
          lang,
          url
        })
        $.ajax({
          headers: {
            'Accept': 'application/json'
          },
          cache: false,
          url,
          success: (data) => {
            log('success', {
              data
            })
            i18n.addResourceBundle(lang, namespace, data);
            toLoad--;
            if (toLoad === 0) {
              resolve()
            }
          },
          error: (jqXHR: any, textStatus: string, errMsg: string) => {
            log({
              textStatus,
              errMsg
            })
            reject(errMsg)
          }
        });
      })
    })
  }

  async loadNodeCatalogs(done) {
    var languageList = [detectLanguage()]
    var toLoad = languageList.length;
    return new Promise((resolve, reject) => {
      languageList.forEach(function (lang) {
        $.ajax({
          headers: {
            'Accept': 'application/json'
          },
          cache: false,
          url: 'locales/nodes?lng=' + lang,
          success: function (data) {
            var namespaces = Object.keys(data);
            namespaces.forEach(function (ns) {
              i18n.addResourceBundle(lang, ns, data[ns]);
            });
            toLoad--;
            if (toLoad === 0) {
              resolve()
            }
          }
        })
      })
    })
  }
}
