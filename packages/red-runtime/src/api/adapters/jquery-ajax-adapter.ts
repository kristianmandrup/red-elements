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
    this.setHeader = this._createSetHeader(jqXHR).bind(this)
  }

  /**
   * TODO: move to SettingsAPI
   * Setup Ajax call with Authorization using JWT Bearer token
   */
  beforeSend(config?: any) {
    // See: https://api.jquery.com/jquery.ajaxsetup/
    $.ajaxSetup({
      beforeSend: (jqXHR, settings) => {
        const sendConfig = {
          jqXHR, settings
        }
        this.logInfo('beforeSend handler', {
          sendConfig
        })

        this.prepareAdapter(sendConfig)
        this.$api.beforeSend(sendConfig)
      }
    });
  }

  protected _createSetHeader(api) {
    return (name, value) => {
      api.setRequestHeader(name, value)
    }
  }

  async $get(config: IAjaxConfig): Promise<any> {
    // this._validate(config)

    const $self = this

    return new Promise((resolve, reject) => {

      // TODO: Try to make it work with the simplest Ajax config and go from there...
      const ajaxConfig = {
        headers: {
          'Accept': 'application/json'
        },
        dataType: 'json',
        cache: false,
        url: 'http://localhost:3000/settings', // config.url,
        success: function (data) {
          $self.logInfo('success', {
            data,
            config
          })
          config.onSuccess(data)
          resolve(data)
        },
        error: function (jqXHR, textStatus, errorThrown) {
          const $error = {
            jqXHR, textStatus, errorThrown
          }

          $self.logInfo('error', $error)

          try {
            config.onError($error)
          } finally {
            reject($error)
          }
        }
      }

      this.logInfo('do AJAX', {
        config,
        ajaxConfig
      })

      // TODO: Some kind of Syntax Error results from ajaxConfig being used :()
      $.ajax(ajaxConfig)
    })
  }
}

