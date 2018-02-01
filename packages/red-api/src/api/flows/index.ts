import {
  BaseApi
} from '../base'

import {
  ReadFlows,
  IReadFlows
} from './read';
import {
  UpdateFlows,
  IUpdateFlows
} from './update';
import {
  CreateFlows,
  ICreateFlows,
} from './create';
import {
  DeleteFlows,
  IDeleteFlows
} from './delete';

export interface IFlowsApi {
  read: IReadFlows
  update: IUpdateFlows
  create: ICreateFlows
  delete: IDeleteFlows
}

export class FlowsApi extends BaseApi {
  basePath = 'flows'

  read: ReadFlows
  update: UpdateFlows
  create: CreateFlows
  delete: DeleteFlows

  constructor(config?: any) {
    super(config)
  }
}
