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
} from '../context'
import * as i18n from 'i18next'
import { InitOptions } from 'i18next';

const { log } = console

const { promisify } = require('util')

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

// See: https://www.i18next.com/getting-started.html
export class I18n extends Context {
  public i18n: any
  protected catalog: Catalog

  constructor() {
    super()
    const { RED } = this
    RED._ = (key, arg) => {
      return this.i18n.t(key, arg);
    }
    this.RED = RED
    this.i18n = i18n;
    this.catalog = new Catalog(this)
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
    return this.catalog.loadCatalog(namespace)
  }

  /**
   * Load node catalogs
   * For each language, load translation resource bundle for each (node) namespace
   *
   * Use backend API endpoint
   *   locales/nodes?lng=[language]
   */
  async loadNodeCatalogs() {
    return this.catalog.loadNodeCatalogs()
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
