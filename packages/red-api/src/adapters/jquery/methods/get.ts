import {
  ApiId
} from './_id'

import { IBaseAdapter, IApiId } from '../../base';
import { IAjaxConfig } from '../../../api';

export class ApiGet extends ApiId implements IApiId {
  // httpMethod: 'get'

  constructor(public adapter: IBaseAdapter) {
    super(adapter)
  }
}
