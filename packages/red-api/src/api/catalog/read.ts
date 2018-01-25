import {
  BaseApiRead,
  BaseApiMethod
} from '../base'

export class ReadCatalog extends BaseApiRead {
  // TODO: override default URLs to match

  // loadLanguage: const url = 'locales/' + namespace + '?lng=' + lang
  /**
   * Load language from API and add as 18n resource bundle
   * @param namespace
   * @param lang
   */
  async language(namespace: string, lang: string) {
  }

  /**
   * Load a single node language
   * @param lang
   */
  async nodeLang(lang) {
  }
  // loadNodeLang: 'locales/nodes?lng=' + lang

  /**
   * Load node catalogs
   * For each language, load translation resource bundle for each (node) namespace
   *
   * Use backend API endpoint
   *   locales/nodes?lng=[language]
   */
  async nodeCatalogs() {
  }
}
