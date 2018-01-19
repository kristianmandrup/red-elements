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
  path: string
  $context: any // reference to the class which is using the Api

  protected HttpsExp = /^\s*(https?:|\/|\.)/

  protected setup = false

  // inject API adapter service
  constructor(config: any = {}) {
    super()

    this.config = config
    this.$context = config.$context
    this.adapter = new JQueryAjaxAdapter({
      $api: this
    })
  }

  _setupApi() { }

  beforeSend(config?: any) {

  }

  errorCode(error) {
    return this.adapter.errorCode(error)
  }

  setHeader(name, value) {
    this.adapter.setHeader(name, value)
  }

  setupApi(): void {
    if (!this.setup) {
      this._setupApi()
    }
    this.setup = true
  }


  async load(config: IAjaxConfig) {
    const {
      _onLoadError,
      _onLoadSuccess
    } = this.rebind([
        '_onLoadError',
        '_onLoadSuccess'
      ])

    const apiConfig = {
      _onLoadError,
      _onLoadSuccess
    }

    const loadConfig = Object.assign(config, apiConfig)
    this.adapter.$get(loadConfig)
  }
}
