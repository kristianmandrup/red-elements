import { BaseApiData, IApiData } from './_data';

export interface IApiCreate extends IApiData {
}

export class BaseApiCreate extends BaseApiData {
  public httpMethod = 'post'

  protected _onePath() {
    return this._manyPath()
  }
}
