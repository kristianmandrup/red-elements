import {
  BaseApi
} from './base-api'

export class NodesApi extends BaseApi {
  basePath = 'nodes'

  constructor(config?: any) {
    super(config)
  }
}
