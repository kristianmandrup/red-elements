import {
  BaseApi
} from '../base'

export class DeployApi extends BaseApi {
  basePath = 'deploy'

  constructor(config?: any) {
    super(config)
  }
}

