import { IBaseApi } from '../api';
import { BaseApiData, IApiData } from './_data';

export interface IApiUpdate extends IApiData {
}

export interface IBaseApiUpdate extends IApiUpdate {
}

export class BaseApiUpdate extends BaseApiData implements IApiData {
  public httpMethod = 'put'
}
