import { IBaseApi } from "../base-api";

export interface IAjaxConfig {
  url: string
  onSuccess(data: any)
  onError(error: any)
}

export interface IBaseAdapter {
  errorCode(error)
  prepareAdapter(config?: any)
  beforeSend(config?: any)
  setHeader(name, value)

  _validate(config: IAjaxConfig)
  $get(config: IAjaxConfig): Promise<any>
}

export class BaseAdapter {
  protected $api: IBaseApi

  constructor(config: any = {}) {
    const { $api } = config
    this.$api = $api
    this.beforeSend()
  }

  protected beforeSend() {
  }

  errorCode(error) {
    return error.code
  }

  // TODO
  _validate(config: IAjaxConfig) {
    return true
  }

  async $get(config: IAjaxConfig): Promise<any> {
    throw new Error('BaseAdapter subclass must implement $get')
  }
}
