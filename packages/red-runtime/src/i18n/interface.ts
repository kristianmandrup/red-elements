export interface II18n {

  t(key: string, arg?: any)
  /**
   * Load node catalog for a particular namespace
   * For a given language, load a translation resource bundle a specific namespace
   *
   * Use backend API endpoint
   *   locales/[namespace]?lng=[language]
   */
  loadCatalog(namespace: string)

  /**
   * Load node catalogs
   * For each language, load translation resource bundle for each (node) namespace
   *
   * Use backend API endpoint
   *   locales/nodes?lng=[language]
   */
  loadNodeCatalogs()

  /**
   * Default options for I18n
   */
  defaultOptions: any

  /**
   * Default configuration for I18n
   */
  config: InitOptions

  /**
   * Initialize i18n (async)
   */
  init()

  /**
   * Detect language via browser or user agent settings
   */
  detectLanguage()
}
