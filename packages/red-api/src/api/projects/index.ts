import {
  BaseApi
} from '../base'

import {
  ReadProjects
} from './read';
import {
  UpdateProjects
} from './update';
import {
  CreateProjects
} from './create';
import {
  DeleteProjects
} from './delete';

export class ProjectsApi extends BaseApi {
  basePath = 'nodes'

  public read: ReadProjects
  public update: UpdateProjects
  public create: CreateProjects
  public delete: DeleteProjects

  constructor(config?: any) {
    super(config)
  }
}
