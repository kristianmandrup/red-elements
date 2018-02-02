import { NodeApi } from './';

import {
  Context,
  container,
  delegateTarget
} from './_base'

export interface INodeCreater {
  createNode(data, options: any)
}

@delegateTarget({
  container
})
export class NodeCreater extends Context implements INodeCreater {
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
      const result = await nodesApi.create.one(data)
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

