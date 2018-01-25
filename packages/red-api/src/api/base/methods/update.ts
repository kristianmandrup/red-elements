import { IBaseApi } from '../api';
import { BaseApiData, IApiData } from './_data';

export interface IApiUpdate extends IApiData {
}

export class BaseApiUpdate extends BaseApiData implements IApiData {
  public httpMethod = 'put'
}
