import { IBaseApi } from "../api";
import { IBaseAdapter } from "../../../adapters/base/index";

export interface IApiMethod {
  httpMethod: string
  url: string
  basePath: string
  adapter: IBaseAdapter

  configure(config: any)
  one(item: any, arg?: any): Promise<any>
  many(items: any[], arg?: any): Promise<any>
}

class ApiError extends Error {
}

export class BaseApiMethod {
  protected _url: string
  httpMethod: string = 'get'

  constructor(public api: IBaseApi, url?: string) {
    this._url = url
  }

  get url(): string {
    return this._url || this.basePath
  }

  // any custom configuration
  configure(config = {}) {

  }

  // TODO: get adapter from api
  get adapter(): IBaseAdapter {
    return this.api.adapter
  }

  // use basePath for API such as /nodes
  get basePath() {
    return this.api.basePath
  }

  async one(item: any, arg?: any) {
    // this.notYetImplementedError()
  }

  async many(items: any[], arg?: any) {
    return await this._doMany(items, arg)
  }

  /**
   * Load data from API via adapter
   * @param method
   * @param config
   */
  async send(method: Function, config?: any) {
    config = config || {}
    // const {
    //   _onApiError,
    //   _onApiSuccess
    //   } = this.rebind([
    //     '_onApiError',
    //     '_onApiSuccess'
    //   ])

    const apiConfig = {
      // onError: _onApiError,
      // onSuccess: _onApiSuccess,
    }

    // have props in the passed in config override the defaults in apiConfig
    const sendConfig = Object.assign(apiConfig, config)
    return await method(sendConfig)
  }

  /**
   * Default handler for Api call success
   * @param data
   * @param api
   */
  protected _onApiSuccess(data, api) {
    return data
  }

  /**
   * Default handler for Api call error
   * @param error
   * @param api
   */
  protected _onApiError(error, api) {
    throw new ApiError(error)
  }

  protected _onePath(id: string) {
    return this._join(this.basePath, id)
  }

  protected _manyPath() {
    return this._join(this.basePath)
  }

  protected _allPath() {
    return this._manyPath()
  }

  async _doOneData(data: any, id?: string) {
    return await this.adapter[this.httpMethod]({
      path: this._onePath(id),
      data
    })
  }

  async _doOneById(id: string) {
    return await this.adapter[this.httpMethod]({
      path: this._onePath(id)
    })
  }

  protected async _doAll() {
    const method = this.httpMethod + 'All'
    return await this.adapter[method]({
      path: this._allPath()
    })
  }

  protected async _doMany(items: any[], arg?: any) {
    const promises = items.map(async (item) => {
      return await this.one(item, arg)
    })
    return Promise.all(promises)
  }

  protected _join(...paths) {
    return paths.join('/')
  }
}
