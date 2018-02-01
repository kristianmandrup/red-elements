import { BaseApiData, IApiData } from './_data';

export interface IApiCreate extends IApiData {
}

export interface IBaseApiCreate {
  one(data: any): Promise<any>
  many(data: any[]): Promise<any>
}

export class BaseApiCreate extends BaseApiData {
  public httpMethod = 'post'

  protected _onePath() {
    return this._manyPath()
  }

  async one(data: any): Promise<any> {
    return await this._doOneData(data)
  }

  async many(data: any[]): Promise<any> {
    return await this._doMany(data)
  }
}
