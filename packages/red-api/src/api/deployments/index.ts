import {
  BaseApi
} from '../base'

import {
  CreateDeployments
} from './create';

export class DeploymentsApi extends BaseApi {
  basePath = 'deployments'

  public create: CreateDeployments

  constructor(config?: any) {
    super(config)
  }
}
