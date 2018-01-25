import {
  JQueryAjaxAdapter,
  IBaseAdapter,
  IAjaxConfig
} from '../../adapters'

export {
  IAjaxConfig
}

import {
  Context
} from '../../context'

export interface IBaseApi {
  adapter: IBaseAdapter
  basePath: string

  errorCode(error: any)
  beforeSend(config?: any)
  setupApi(): void
}

export class BaseApi extends Context implements IBaseApi {
  adapter: IBaseAdapter
  config: any
  basePath: string
  $context: any // reference to the class which is using the Api

  protected HttpsExp = /^\s*(https?:|\/|\.)/

  protected setup = false

  protected host = process.env.RED_HOST || 'localhost'
  protected port = process.env.RED_PORT || 3000
  protected protocol = process.env.RED_PROTOCOL || 'http'

  // inject API adapter service
  constructor(config?: any) {
    super()

    this.configure(config)

    this.adapter = new JQueryAjaxAdapter({
      $api: this
    })
  }

  configure(config?: any) {
    if (!config) return this
    this.config = config
    this.$context = config.$context
    this.adapter.configure(config)
    return this
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
  errorCode(error: any) {
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

  /**
   * Create host and port
   */
  get hostAndPort() {
    const {
        port, host
      } = this
    return port ? `${host}:${port}` : host
  }

  /**
   * Create URL
   * @param config
   */
  createUrl(config) {
    return config.url.test(/^http/) ? config.url : this.buildUrl(config)
  }

  /**
   * Create URL
   * @param config
   */
  buildUrl(config) {
    const {
        protocol,
      hostAndPort
      } = this
    return `${protocol}://${hostAndPort}/${config.url}`
  }
}

