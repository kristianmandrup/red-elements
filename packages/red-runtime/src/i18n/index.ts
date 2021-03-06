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
  delegator
} from './_base'

import * as I18next from 'i18next'
import { InitOptions } from 'i18next';

const { log } = console

/**
 * Detect language used via browser language or user agent
 * @param fallbackLng
 */
function detectLanguage(fallbackLng = 'en') {
  if (navigator) {
    return navigator.language
  } else {
    return fallbackLng;
  }
}

import {
  ICatalog,
  Catalog
} from './catalog'

import {
  II18n
} from './interface'


// See: https://www.i18next.com/getting-started.html
@delegator({
  map: {
    catalog: 'ICatalog'
  }
})
export class I18n extends Context implements II18n {
  public i18n: any
  protected catalog: ICatalog

  constructor() {
    super()
    this.i18n = I18next
  }

  t(key: string, arg?: any) {
    return this.i18n.t(key, arg)
  }

  // delegate catalog

  /**
   * Load node catalog for a particular namespace
   * For a given language, load a translation resource bundle a specific namespace
   *
   * Use backend API endpoint
   *   locales/[namespace]?lng=[language]
   */
  async loadCatalog(namespace: string) {
    return this.catalog.loadLanguages(namespace)
  }

  /**
   * Load node catalogs
   * For each language, load translation resource bundle for each (node) namespace
   *
   * Use backend API endpoint
   *   locales/nodes?lng=[language]
   */
  async loadNodeCatalogs() {
    return this.catalog.loadNodeLanguages()
  }

  /**
   * Default options for I18n
   */
  get defaultOptions() {
    return {
      saveMissing: true,
      debug: true
    }
  }

  /**
   * Default configuration for I18n
   */
  get config(): InitOptions {
    return {
      load: 'currentOnly',
      ns: ["editor", "node-red", "jsonata", "infotips"],
      defaultNS: "editor",
      fallbackLng: ['en-US'],
    }
  }

  /**
   * Initialize i18n (async)
   */
  async init() {
    const {
      i18n
    } = this

    return new Promise((resolve, reject) => {
      i18n.init(this.config, (err, t) => {
        err ? reject(err) : resolve()
      })
    })
  }

  /**
   * Detect language via browser or user agent settings
   */
  detectLanguage() {
    return detectLanguage()
  }
}
