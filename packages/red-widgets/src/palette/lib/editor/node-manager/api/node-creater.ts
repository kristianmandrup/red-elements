import {
  Context
} from '../../../../../context'
import { NodeApi } from './';

export class NodeCreater extends Context {
  constructor(public api: NodeApi) {
    super()
  }

  async createNode(data, options: any = {}) {
    const {
      nodesApi,
    } = this.api

    const {
      onNodePostSuccess,
      onNodePostError
    } = this

    // TODO: try/catch should be handled by API
    try {
      const result = await nodesApi.post(data)
      onNodePostSuccess(result, options)
    } catch (error) {
      onNodePostError(error)
    }
  }

  protected onNodePostSuccess(data, options: any = {}) {
    const {
      shade
    } = options
    shade.hide();
  }

  protected onNodePostError(error, options: any = {}) {
    const {
      shade
    } = options

    shade.hide();
  }
}

