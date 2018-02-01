import {
  BaseApiMethod
} from './_base'
import { IApiId, BaseApiId } from './_id';

export interface IApiRead extends IApiId {
}

export interface IBaseApiRead extends IApiRead {
}


export class BaseApiRead extends BaseApiId implements IApiRead {
  public httpMethod = 'get'
}
