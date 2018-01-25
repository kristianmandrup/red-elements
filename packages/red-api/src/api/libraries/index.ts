import {
  BaseApi
} from '../base'

import {
  ReadLibraries
} from './read';
import {
  UpdateLibraries
} from './update';
import {
  CreateLibraries
} from './create';
import {
  DeleteLibraries
} from './delete';


export class LibraryApi extends BaseApi {
  basePath = 'libraries'

  public read: ReadLibraries
  public update: UpdateLibraries
  public create: CreateLibraries
  public delete: DeleteLibraries

  constructor(config?: any) {
    super(config)
  }
}
