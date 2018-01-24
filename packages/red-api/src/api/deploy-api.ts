import {
  BaseApi
} from './base-api'

export class DeployApi extends BaseApi {
  basePath = 'deploy'

  constructor(config?: any) {
    super(config)
  }
}

