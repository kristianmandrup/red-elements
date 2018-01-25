import {
  ApiMethod
} from './_base'
import { IBaseAdapter, IApiMethod, IApiPut } from '../../base';
import { IAjaxConfig } from '../../../base-api';


export class ApiPut extends ApiMethod implements IApiPut {
  protected data: any

  constructor(public adapter: IBaseAdapter) {
    super(adapter)
  }

  setData(data: any): IApiMethod {
    this.data = data
    return this
  }

  get ajaxOptions() {
    const {
      data,
      config
    } = this

    return {
      method: 'PUT',
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
