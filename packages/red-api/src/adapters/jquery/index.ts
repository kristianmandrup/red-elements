import {
  IAjaxConfig,
  BaseAdapter,
  IBaseAdapter,
  IApiPost,
  IApiGet,
  IApiPut
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
import { IApiDelete } from '../../api/base/methods/delete';

export class JQueryAjaxAdapter extends BaseAdapter implements IJQueryAjaxAdapter {
  // TODO: use service injection with factory
  apiGet: IApiGet
  apiPost: IApiPost
  apiPut: IApiPut
  apiDelete: IApiDelete

  httpMethods = {
    get: this.apiGet,
    post: this.apiPost,
    put: this.apiPut,
    delete: this.apiDelete
  }

  constructor(public api: any, config?: any) {
    super(api)

    // TODO: use service injection with factory
    // perhaps iterate httpMethods
    this.apiGet = new ApiGet(api)
    this.apiPost = new ApiPost(api)
    this.apiDelete = new ApiDelete(api)
    this.apiPut = new ApiPut(api)

    this.configure(config)
  }

  /**
   * Configure all httpMethods
   * @param config
   */
  configure(config: any) {
    Object.keys(this.httpMethods).map(name => {
      const delegate = this.httpMethods[name]
      delegate.configure(config)
    })
    return this
  }

  /**
   * Make a PUT request with data
   * @param data
   */
  async put(options: any = {}) {
    return await this.apiPut.setData(options.data).send(options)
  }

  /**
   * Make a POST request with data
   * @param data
   */
  async post(options: any = {}) {
    return await this.apiPost.setData(options.data).send(options)
  }

  /**
   * Make a GET request, potentially with id
   * @param data
   */
  async get(options: any = {}) {
    return await this.apiGet.send(options)
  }

  async delete(options: any = {}) {
    return await this.apiDelete.delete(options)
  }
}

