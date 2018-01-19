import {
  JQueryAjaxAdapter,
  IBaseAdapter,
  IAjaxConfig
} from './adapters'

export {
  IAjaxConfig
}

import {
  Context
} from '../context'

export interface IBaseApi {
  beforeSend(config?: any)
  setupApi(): void
  load(config: IAjaxConfig): Promise<any>
}

export class BaseApi extends Context {
  adapter: IBaseAdapter
  config: any
  basePath: string
  $context: any // reference to the class which is using the Api

  protected HttpsExp = /^\s*(https?:|\/|\.)/

  protected setup = false

  protected host = 'localhost'
  protected port = 3000
  protected protocol = 'http'

  // inject API adapter service
  constructor(config: any = {}) {
    super()

    this.config = config
    this.$context = config.$context
    this.adapter = new JQueryAjaxAdapter({
      $api: this
    })
  }

  /**
   * Override to customize setup of API
   */
  _setupApi() { }

  /**
   * Logic to execute before sending request
   * @param config
   */
  beforeSend(config?: any) {
  }

  /**
   * Get error code of response, such as 200 or 401
   * @param error
   */
  errorCode(error) {
    return this.adapter.errorCode(error)
  }

  /**
   * Set Request header
   * @param name
   * @param value
   */
  setHeader(name: string, value: string) {
    this.adapter.setHeader(name, value)
  }

  /**
   * Setup API
   */
  setupApi(): IBaseApi {
    if (!this.setup) {
      this._setupApi()
    }
    this.setup = true
    return this
  }

  get hostAndPort() {
    const {
      port, host
    } = this
    return port ? `${host}:${port}` : host
  }

  createUrl(config) {
    const {
      protocol,
      hostAndPort
    } = this
    return `${protocol}://${hostAndPort}/${config.url}`
  }

  /**
   * Load data from API via adapter
   * @param config
   */
  async load(config: IAjaxConfig) {
    const {
      _onApiError,
      _onApiSuccess
    } = this.rebind([
        '_onApiError',
        '_onApiSuccess'
      ])

    const apiConfig = {
      onError: _onApiError,
      onSuccess: _onApiSuccess,
      url: this.createUrl(this.basePath)
    }

    // have props in the passed in config override the defaults in apiConfig
    const loadConfig = Object.assign(apiConfig, config)
    return await this.adapter.$get(loadConfig)
  }
}
