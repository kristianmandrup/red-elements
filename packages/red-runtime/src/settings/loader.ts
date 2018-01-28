import {
  Context
} from '../context'

import {
  Settings, ISettings
} from './'

export interface ISettingsLoader {
  load(): Promise<any>
}

export class SettingsLoader extends Context implements ISettingsLoader {
  constructor(public settings: ISettings) {
    super()
  }

  /**
   * load user settings via Ajax call to server API: /settings
   */
  async load(): Promise<any> {
    const {
      settingsApi
    } = this.settings

    return await settingsApi.read.all()
  }

  /**
   *
   * Handle load success on Ajax API call to /settings
   * @param data { object } the user settings data
   */
  protected _onApiSuccess(data, api: IBaseApi) {
    this.logInfo('_onApiSuccess', {
      data
    })

    const {
      ctx,
      setProperties,
      log
    } = this.rebind([
        'setProperties',
        'log'
      ])

    setProperties(data);
    if (!ctx.settings.user || ctx.settings.user.anonymous) {
      ctx.settings.remove('auth-tokens');
    }
    log('Node-RED: ' + data.version);
  }

  /**
   * Handle load error on Ajax API call to /settings
   * @param error { object } the error
   */
  protected _onApiError(error, api: IBaseApi) {
    const {
      AccessTokenExp
    } = this

    this.logInfo('_onApiError', {
      error
    })

    if (api.errorCode(error) === 401) {
      if (AccessTokenExp.test(window.location.search)) {
        window.location.search = '';
      }
      // ctx.user.login(this.load);
    } else {
      this.handleError('Unexpected error:', {
        error
      });
    }
  }
