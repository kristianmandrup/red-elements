import {
  BaseApi
} from '../base'

export interface IApiCallerContext {
  $context?: any
}


import {
  ReadSettings
} from './read';
import {
  UpdateSettings
} from './update';
import {
  CreateSettings
} from './create';


export class SettingsApi extends BaseApi {
  basePath = 'settings'

  public read: ReadSettings
  public create: CreateSettings
  public update: UpdateSettings

  constructor(config?: IApiCallerContext) {
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
