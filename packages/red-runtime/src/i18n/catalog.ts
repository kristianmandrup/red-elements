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
export class Catalog {
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
      i18n
    } = this.i18n

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

