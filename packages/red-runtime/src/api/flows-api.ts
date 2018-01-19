import {
  BaseApi
} from './base-api'

export class FlowsApi extends BaseApi {
  basePath = 'flows'

  constructor(config: any) {
    super(config)
  }
}
