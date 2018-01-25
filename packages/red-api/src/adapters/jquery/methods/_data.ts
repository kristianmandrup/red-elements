import {
  ApiMethod
} from './_base'
import { IBaseAdapter, IApiMethod, IApiData } from '../../base';
import { IAjaxConfig } from '../../../api';


export class ApiData extends ApiMethod implements IApiData {
  protected data: any

  constructor(public adapter: IBaseAdapter) {
    super(adapter)
  }

  setData(data) {
    this.data = data
    return this
  }

  get _ajaxMethodOptions() {
    const {
      data,
      config
    } = this

    return {
      data: JSON.stringify(data)
    }
  }
}
