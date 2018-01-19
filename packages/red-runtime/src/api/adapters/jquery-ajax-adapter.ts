import {
  IAjaxConfig,
  BaseAdapter
} from './base-adapter'

import * as $ from 'jquery'

export class JQueryAjaxAdapter extends BaseAdapter {
  async $get(config: IAjaxConfig): Promise<any> {
    this._validate(config)

    return new Promise((resolve, reject) => {
      $.ajax({
        headers: {
          'Accept': 'application/json'
        },
        dataType: 'json',
        cache: false,
        url: config.url,
        success: (data) => {
          config.onSuccess(data)
          resolve(data)
        },
        error: (jqXHR, textStatus, errorThrown) => {
          try {
            config.onError({
              jqXHR, textStatus, errorThrown
            })
          } finally {
            reject(errorThrown)
          }
        }
      });
    })
  }
}

