import {
  ApiMethod
} from './_base'
import { IBaseAdapter } from '../../base';
import { IAjaxConfig } from '../../../base-api';


export class ApiPost extends ApiMethod implements IApiPost {
  protected data: any

  constructor(public adapter: IBaseAdapter) {
    super(adapter)
  }

  setData(data) {
    this.data = data
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
