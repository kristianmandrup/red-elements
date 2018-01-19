import {
  JQueryAjaxAdapter,
  IBaseAdapter,
  IAjaxConfig
} from './adapters'

export {
  IAjaxConfig
}

export interface IBaseApi {
  setupApi(): void
  load(config: IAjaxConfig): Promise<any>
}

export class BaseApi {
  adapter: IBaseAdapter
  config: any

  protected setup = false
  protected _setupApi: Function

  // inject API adapter service
  constructor(config: any) {
    this.config = config
    this._setupApi = config.setupApi
    this.adapter = new JQueryAjaxAdapter()
  }

  setupApi(): void {
    if (!this.setup) {
      this._setupApi()
    }
    this.setup = true
  }


  async load(config: IAjaxConfig) {
    this.adapter.$get(config)
  }
}
