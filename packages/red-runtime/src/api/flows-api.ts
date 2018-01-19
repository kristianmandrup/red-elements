import {
  BaseApi
} from './base-api'

export class FlowsApi extends BaseApi {
  path = 'flows'

  constructor(config: any) {
    super(config)
  }
}
