import {
  ApiId
} from './_id'

import { IBaseAdapter, IApiId, IApiDelete } from '../../base';
import { IAjaxConfig } from '../../../api';

export class ApiDelete extends ApiId implements IApiDelete {
  // httpMethod: 'delete'

  constructor(public adapter: IBaseAdapter) {
    super(adapter)
  }
}
