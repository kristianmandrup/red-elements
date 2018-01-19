import {
  BaseApi
} from './base-api'

export interface IApiCallerContext {
  $context: any
}

export class SettingsApi extends BaseApi {
  basePath = 'settings'
  AccessTokenExp = /[?&]access_token=(.*?)(?:$|&)/

  constructor(config: IApiCallerContext) {
    super(config)
  }

  beforeSend(config: any = {}) {
    const { $context, HttpsExp } = this
    const { settings } = config
    // Only attach auth header for requests to relative paths
    if (!HttpsExp.test(settings.url)) {
      if (!$context.settings) {
        this.handleError('beforeSend: missing settings in API caller context', {
          $context
        })
      }

      var auth_tokens = $context.settings.get('auth-tokens');
      this.logInfo('beforeSend', {
        auth_tokens
      })

      this.logInfo('beforeSend: setHeader', this.setHeader)
      if (auth_tokens) {
        this.setHeader('Authorization', 'Bearer ' + auth_tokens.access_token);
      }
      this.setHeader('Node-RED-API-Version', 'v2');
    }
  }

  /**
   * Handle load error on Ajax API call to /settings
   * @param error { object } the error
   */
  protected _onApiError(error) {
    const {
      $context,
      AccessTokenExp
    } = this

    this.logInfo('_onApiError', {
      error
    })

    // if (this.errorCode(error) === 401) {
    //   if (AccessTokenExp.test(window.location.search)) {
    //     window.location.search = '';
    //   }
    //   // ctx.user.login(this.load);
    // } else {
    //   $context.handleError('Unexpected error:', {
    //     error
    //   });
    // }
  }

  /**
   * Handle load success on Ajax API call to /settings
   * @param data { object } the user settings data
   */
  protected _onApiSuccess(data) {
    const {
      $context
    } = this

    this.logInfo('_onApiSuccess', {
      data
    })

    const {
      ctx,
      setProperties,
      log
    } = $context.rebind([
        'setProperties',
        'log'
      ], $context)

    setProperties(data);
    if (!ctx.settings.user || ctx.settings.user.anonymous) {
      ctx.settings.remove('auth-tokens');
    }
    log('Node-RED: ' + data.version);
  }
}
