import { IBaseApi } from '../../base-api'

export interface IAjaxConfig {
  url: string
  onSuccess(data: any, $api: IBaseApi)
  onError(error: any, $api: IBaseApi)
  onFinally?($api: IBaseApi)
}

export interface IApiMethod {
  send(config: IAjaxConfig): Promise<any>
}

export interface IApiData extends IApiMethod {
  setData(data: any): IApiData
}

export interface IApiId extends IApiMethod {
  setId(id: string): IApiId
}


export interface IApiPost extends IApiData {
}

export interface IApiPut extends IApiData {
}

export interface IApiGet extends IApiMethod {
}


export interface IBaseAdapter {
  configure(config: any): IBaseAdapter
  validate?(config: any): boolean
  $get?(config: IAjaxConfig): Promise<any>
  $post?(data: any, config: IAjaxConfig): Promise<any>
  $put?(data: any, config: IAjaxConfig): Promise<any>
}

import {
  Context
} from '../../../context'

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

  validate(config: any): boolean {
    return true
  }

  async $get(config: IAjaxConfig): Promise<any> {
    throw new Error('BaseAdapter subclass may implement $get')
  }

  async $post(config: IAjaxConfig): Promise<any> {
    throw new Error('BaseAdapter subclass may implement $post')
  }

  async $put(config: IAjaxConfig): Promise<any> {
    throw new Error('BaseAdapter subclass may implement $post')
  }
}
