import { IBaseAdapter } from "../../base";
import { Context } from "../../../../context/index";
import { IAjaxConfig } from "../../../base-api";

export abstract class ApiMethod extends Context {
  protected config: any
  protected $api: any
  protected headers

  constructor(public adapter: IBaseAdapter) {
    super()
  }

  get httpMethod() {
    return this.$api.method.httpMethod
  }

  configure(config?: any) {
    this.config = config
    return this
  }

  errorCode(error) {
    const {
      jqXHR,
      textStatus
    } = error

    return jqXHR.status
  }

  protected validate(config) {
    this.adapter.validate(config)
  }

  setHeader(name, value) {
    throw new Error('call prepareAdapter to create setHeader method')
  }

  prepareAdapter(config: any = {}) {
    const { jqXHR, settings } = config
    if (!jqXHR) {
      this.handleError('prepareAdapter: config missing jqXHR', {
        config
      })
    }
    this.setHeader = this._createSetHeader(jqXHR).bind(this)
  }


  protected _createSetHeader(api) {
    return (name, value) => {
      api.setRequestHeader(name, value)
    }
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
    })
    return this
  }

  async send(config: IAjaxConfig): Promise<any> {
    this.validate(config)

    const $self = this
    const {
      $api,
      ajax,
      ajaxOptions
    } = this

    this.logInfo('do AJAX', {
      config,
      ajaxOptions
    })

    // TODO: Some kind of Syntax Error results from ajaxConfig being used :()

    try {
      const data = await ajax(ajaxOptions)
      config.onSuccess(data, $api)
    } catch (error) {
      config.onError(error, $api)
    } finally {
      config.onFinally($api)
    }
  }

  get ajaxOptions() {
    return Object.assign({}, this.defaultAjaxOptions, this._ajaxMethodOptions)
  }

  get _ajaxMethodOptions() {
    return {}
  }

  get defaultAjaxOptions() {
    const {
      config
    } = this

    return {
      method: this.httpMethod,
      headers: {
        'Accept': 'application/json; charset=utf-8'
      },
      dataType: 'json',
      cache: false,
      url: config.url
    }
  }


  /**
   * Convert jQuery Deferreds to native JS Promise for use with await/async
   * @param options
   */
  ajax(options) {
    return new Promise(function (resolve, reject) {
      $.ajax(options).done(resolve).fail(reject);
    })
  }
}
