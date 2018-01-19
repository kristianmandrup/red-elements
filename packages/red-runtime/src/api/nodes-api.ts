import {
  BaseApi
} from './base-api'

export class NodesApi extends BaseApi {
  path = 'nodes'

  constructor(config: any) {
    super(config)
  }
}
