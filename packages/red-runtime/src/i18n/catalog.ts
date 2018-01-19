import {
  I18n
} from './'

const { log } = console

export interface ICatalog {
  loadCatalog: (namespace: string) => void
  loadNodeCatalogs: () => void
}

/**
 * Catalog loader for i18n translation resource bundles
 */
export class Catalog implements ICatalog {
  constructor(public i18n: I18n) {
  }

  /**
   * Load node catalog for a particular namespace
   * For a given language, load a translation resource bundle a specific namespace
   *
   * Use backend API endpoint
   *   locales/[namespace]?lng=[language]
   */
  async loadCatalog(namespace: string) {
    const {
      detectLanguage,
    } = this.i18n

    var languageList = [detectLanguage()]

    const promises = languageList.map(async (lang) => {
      return await this.loadLanguage(namespace, lang)
    })

    return Promise.all(promises)
  }


  async loadLanguage(namespace: string, lang: string) {
    const {
      i18n
    } = this.i18n

    return new Promise((resolve, reject) => {
      const url = 'locales/' + namespace + '?lng=' + lang
      log('request language localisations', {
        lang,
        url
      })

      // TODO: Use i18n-catalog API as service
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
          resolve(data)
        },
        error: (jqXHR: any, textStatus: string, errMsg: string) => {
          log({
            textStatus,
            errMsg
          })
          reject(errMsg)
        }
      })
    })
  }

  /**
   * Load node catalogs
   * For each language, load translation resource bundle for each (node) namespace
   *
   * Use backend API endpoint
   *   locales/nodes?lng=[language]
   */
  async loadNodeCatalogs() {
    const {
      detectLanguage,
      i18n
    } = this.i18n

    var languageList = [detectLanguage()]
    const promises = languageList.map(async (lang) => {
      return this.loadNodeLang(lang)
    })
    return Promise.all(promises)
  }

  async loadNodeLang(lang) {
    const {
      i18n
    } = this.i18n

    // TODO: Use i18n-catalog API as service
    return new Promise((resolve, reject) => {
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
          resolve()
        },
        error: (jqXHR: any, textStatus: string, errMsg: string) => {
          log({
            textStatus,
            errMsg
          })
          reject(errMsg)
        }
      })
    })
  }
}

