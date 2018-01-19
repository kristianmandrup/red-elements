import {
  IAjaxConfig,
  BaseAdapter,
  IBaseAdapter
} from './base-adapter'

import * as $ from 'jquery'

export interface IJQueryAjaxAdapter extends IBaseAdapter {
}

export class JQueryAjaxAdapter extends BaseAdapter implements IJQueryAjaxAdapter {
  setHeader(name, value) {
    throw new Error('call prepareAdapter to create setHeader method')
  }

  errorCode(error) {
    const {
      jqXHR,
      textStatus
    } = error

    return jqXHR.status
  }

  prepareAdapter(config: any = {}) {
    const { jqXHR, settings } = config
    this.setHeader = this.createSetHeader(jqXHR).bind(this)
  }

  /**
   * TODO: move to SettingsAPI
   * Setup Ajax call with Authorization using JWT Bearer token
   */
  beforeSend(config?: any) {
    $.ajaxSetup({
      beforeSend: (jqXHR, settings) => {
        this.$api.beforeSend({
          jqXHR, settings
        })
      }
    });
  }


  createSetHeader(api) {
    return function setHeader(name, value) {
      api.setRequestHeader(name, value)
    }
  }

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

