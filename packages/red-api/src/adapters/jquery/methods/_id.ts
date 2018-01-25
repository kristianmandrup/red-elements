import {
  ApiMethod
} from './_base'
import { IBaseAdapter, IApiMethod, IApiId } from '../../base';

export class ApiId extends ApiMethod implements IApiId {
  protected id: string

  constructor(public adapter: IBaseAdapter) {
    super(adapter)
  }

  setId(id: string) {
    this.id = id
    return this
  }
}
