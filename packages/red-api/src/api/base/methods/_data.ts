import {
  BaseApiMethod
} from './_base'

export interface IApiData {
  one(data: any, id: string): Promise<any>
  many(ids: string[], data: any): Promise<any>
}

export class BaseApiData extends BaseApiMethod {
  async one(data: any, id: string): Promise<any> {
    return await this._doOneData(data, id)
  }

  async many(ids: string[], data: any): Promise<any> {
    return await this._doMany(ids, data)
  }
}
