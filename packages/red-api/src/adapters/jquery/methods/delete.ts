import {
  ApiId
} from './_id'

import { IBaseAdapter, IApiId } from '../../base';
import { IAjaxConfig } from '../../../api';

export class ApiDelete extends ApiId implements IApiId {
  // httpMethod: 'delete'

  constructor(public adapter: IBaseAdapter) {
    super(adapter)
  }
}
