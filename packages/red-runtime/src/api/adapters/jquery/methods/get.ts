import {
  ApiMethod
} from './_base'

import { IBaseAdapter } from '../../base';
import { IAjaxConfig } from '../../../base-api';

export class ApiGet extends ApiMethod {
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
