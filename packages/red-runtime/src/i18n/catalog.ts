import {
  I18n
} from './'

const { log } = console

import {
  Context
} from '../context'
import { I18nCatalogApi } from '../api/i18n-catalog-api';

export interface ICatalog {
  loadLanguages: (namespace: string) => void
  loadNodeLanguages: () => void
}

/**
 * Catalog loader for i18n translation resource bundles
 */
export class Catalog extends Context implements ICatalog {
  protected i18nCatalogApi

  constructor(public i18n: I18n) {
    super()
  }

  prepareLoad() {
    this.i18nCatalogApi = new I18nCatalogApi({
      $context: this
    })
  }

  /**
   * Load node catalog for a particular namespace
   * For a given language, load a translation resource bundle a specific namespace
   *
   * Use backend API endpoint
   *   locales/[namespace]?lng=[language]
   */
  async loadLanguages(namespace: string) {
    const {
      detectLanguage,
    } = this.i18n

    this.prepareLoad()

    var languageList = [detectLanguage()]

    const promises = languageList.map(async (lang) => {
      return await this.loadLanguage(namespace, lang)
    })

    return Promise.all(promises)
  }


  /**
   * Load language from API and add as 18n resource bundle
   * @param namespace
   * @param lang
   */
  async loadLanguage(namespace: string, lang: string) {
    const {
      i18nCatalogApi
    } = this
    const {
      i18n
    } = this.i18n

    this.prepareLoad()

    const url = 'locales/' + namespace + '?lng=' + lang
    log('request language localisations', {
      lang,
      url
    })
    try {
      const data = await i18nCatalogApi.load({
        url
      })
      i18n.addResourceBundle(lang, namespace, data);
    } catch (err) {
      this.handleError('loadLanguage', {
        err
      })
    }
  }

  /**
   * Load node languages (catalogs)
   * For each language, load translation resource bundle for each (node) namespace
   *
   * Use backend API endpoint
   *   locales/nodes?lng=[language]
   */
  async loadNodeLanguages() {
    const {
      detectLanguage,
      i18n
    } = this.i18n

    return this.loadLanguages('nodes')
  }
}

