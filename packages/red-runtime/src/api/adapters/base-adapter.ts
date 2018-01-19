export interface IAjaxConfig {
  url: string
  onSuccess(data: any)
  onError(error: any)
}

export interface IBaseAdapter {
  _validate(config: IAjaxConfig)
  $get(config: IAjaxConfig): Promise<any>
}

export class BaseAdapter {
  // TODO
  _validate(config: IAjaxConfig) {
    return true
  }

  async $get(config: IAjaxConfig): Promise<any> {
    throw new Error('BaseAdapter subclass must implement $get')
  }
}
