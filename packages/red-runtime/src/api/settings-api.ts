import {
  BaseApi
} from './base-api'

export interface IApiCallerContext {
  $context: any
}

export class SettingsApi extends BaseApi {
  basePath = 'settings'

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
}
