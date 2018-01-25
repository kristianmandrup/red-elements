import {
  BaseApiMethod
} from './_base'

export interface IApiId {
  one(id: string): Promise<any>
  many(ids: string[]): Promise<any>
  all(): Promise<any>
}

export class BaseApiId extends BaseApiMethod {

  async one(id: string): Promise<any> {
    return await this._doOneById(id)
  }

  async many(ids: string[]): Promise<any> {
    return await this._doMany(ids)
  }

  async all(): Promise<any> {
    return await this._doAll()
  }
}
