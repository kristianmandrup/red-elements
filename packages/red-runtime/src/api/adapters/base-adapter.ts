import { IBaseApi } from "../base-api";

export interface IAjaxConfig {
  url: string
  onSuccess(data: any, $api: IBaseApi)
  onError(error: any, $api: IBaseApi)
}

export interface IBaseAdapter {
  errorCode(error)
  prepareAdapter(config?: any)
  beforeSend(config?: any)
  setHeader(name, value)
  $get(config: IAjaxConfig): Promise<any>
}

import {
  Context
} from '../../context'

export class BaseAdapter extends Context {
  protected $api: IBaseApi

  constructor(config: any = {}) {
    super()

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
  protected _validate(config: IAjaxConfig) {
    return true
  }

  async $get(config: IAjaxConfig): Promise<any> {
    throw new Error('BaseAdapter subclass must implement $get')
  }
}
