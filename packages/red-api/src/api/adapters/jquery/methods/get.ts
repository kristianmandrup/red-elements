import {
  ApiMethod
} from './_base'

import { IBaseAdapter, IApiMethod } from '../../base';
import { IAjaxConfig } from '../../../base-api';

export class ApiGet extends ApiMethod implements IApiMethod {
  constructor(public adapter: IBaseAdapter) {
    super(adapter)
  }

  get ajaxOptions() {
    const {
      config
    } = this

    return {
      headers: {
        'Accept': 'application/json'
      },
      dataType: 'json',
      cache: false,
      url: config.url
    }
  }
}
