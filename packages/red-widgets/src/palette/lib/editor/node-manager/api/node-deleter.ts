import { NodeApi } from './';

import {
  Context,
  container,
  delegateTarget
} from './_base'

export interface INodeDeleter {
  deleteNode(id: string)
}

@delegateTarget({
  container
})
export class NodeDeleter extends Context implements INodeDeleter {
  constructor(public api: NodeApi) {
    super()
  }

  async deleteNode(id: string) {
    const {
      nodesApi,
    } = this.api

    const {
      onNodeDeleteSuccess,
      onNodeDeleteError
    } = this

    // TODO: move to NodesApi
    const url = 'nodes/' + id
    nodesApi.configure({
      url
    })

    // TODO: try/catch should be handled by API
    try {
      const result = await nodesApi.delete()
      onNodeDeleteSuccess(result)
    } catch (error) {
      onNodeDeleteError(error)
    }
  }

  protected onNodeDeleteSuccess(result) {

  }

  protected onNodeDeleteError(error) {

  }
}
