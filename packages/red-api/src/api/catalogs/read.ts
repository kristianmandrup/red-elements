import {
  BaseApiRead,
  BaseApiMethod
} from '../base'

export class ReadCatalogs extends BaseApiRead {
  protected namespace: string

  get basePath() {
    return this._join(super.basePath, 'locales', this.namespace)
  }

  configure(config: any = {}) {
    this.namespace = config.namespace
  }
}
