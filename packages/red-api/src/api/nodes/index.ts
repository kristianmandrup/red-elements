import {
  BaseApi
} from '../base'


import {
  ReadNodes
} from './read';
import {
  UpdateNodes
} from './update';
import {
  CreateNodes
} from './create';
import {
  DeleteNodes
} from './delete';


export class NodesApi extends BaseApi {
  basePath = 'nodes'

  public read: ReadNodes
  public update: UpdateNodes
  public create: CreateNodes
  public delete: DeleteNodes

  constructor(config?: any) {
    super(config)
  }
}
