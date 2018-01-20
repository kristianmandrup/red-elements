import {
  IAjaxConfig,
  BaseAdapter,
  IBaseAdapter
} from '../base-adapter'

import * as $ from 'jquery'

export interface IJQueryAjaxAdapter extends IBaseAdapter {
}

import {
  ApiPost,
  ApiGet
} from './methods'

import { IBaseApi } from '../../base-api';

export class JQueryAjaxAdapter extends BaseAdapter implements IJQueryAjaxAdapter {
  protected apiGet
  protected apiPost

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

  async post(data) {
    this.apiPost.setData(data)
    await this.apiPost.send()
  }

  async get() {
    await this.apiGet.send()
  }
}

