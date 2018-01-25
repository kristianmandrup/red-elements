import {
  IAjaxConfig,
  BaseAdapter,
  IBaseAdapter
} from '../base'

import * as $ from 'jquery'

export interface IJQueryAjaxAdapter extends IBaseAdapter {
}

import {
  ApiPost,
  ApiPut,
  ApiGet,
  ApiDelete,
} from './methods'

import { IBaseApi } from '../../api';

export class JQueryAjaxAdapter extends BaseAdapter implements IJQueryAjaxAdapter {
  protected apiGet
  protected apiPost
  protected apiPut
  protected apiDelete

  constructor(public config: any) {
    super()
    const { $api } = config

    this.apiGet = new ApiGet($api)
    this.apiPost = new ApiPost($api)
  }

  configure(config: any) {
    this.apiGet.configure(config)
    this.apiPost.configure(config)
    return this
  }

  async put(data) {
    this.apiPut.setData(data)
    await this.apiPut.send()
  }

  async post(data) {
    this.apiPost.setData(data)
    await this.apiPost.send()
  }

  async get() {
    await this.apiGet.send()
  }
}

