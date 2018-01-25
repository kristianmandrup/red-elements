import {
  BaseApi
} from '../base'

import {
  ReadFlows
} from './read';
import {
  UpdateFlows
} from './update';
import {
  CreateFlows
} from './create';
import {
  DeleteFlows
} from './delete';

export class FlowsApi extends BaseApi {
  basePath = 'flows'

  public read: ReadFlows
  public update: UpdateFlows
  public create: CreateFlows
  public delete: DeleteFlows

  constructor(config?: any) {
    super(config)
  }
}
