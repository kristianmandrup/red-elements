import {
  ApiMethod
} from './_base'
import { IBaseAdapter } from '../../base-adapter';
import { IAjaxConfig } from '../../../base-api';

export class ApiPost extends ApiMethod {
  protected data: any

  constructor(public adapter: IBaseAdapter) {
    super(adapter)
  }

  configure(data: any, config?: any) {
    this.data = data
    this.config = config
    return this
  }

  get ajaxOptions() {
    const {
      data,
      config
    } = this

    return {
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      headers: {
        'Accept': 'application/json'
      },
      dataType: 'json',
      cache: false,
      url: config.url
    }
  }
}
