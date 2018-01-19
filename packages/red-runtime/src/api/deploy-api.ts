import {
  BaseApi
} from './base-api'

export class DeployApi extends BaseApi {
  path = 'deploy'

  constructor(config: any) {
    super(config)
  }
}
