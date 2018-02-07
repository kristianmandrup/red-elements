import { NodeApi } from './';

import {
  Context,
  container,
  delegateTarget
} from './_base'

export interface INodeUpdater {
  updateNode(state: any, id: string)
}

@delegateTarget({
  container
})
export class NodeUpdater extends Context implements INodeUpdater {
  constructor(public api: NodeApi) {
    super()
  }

  async updateNode(state: any, id: string) {
    const {
      nodesApi,
    } = this.api

    const {
      onNodeUpdateError,
      onNodeUpdateSuccess
    } = this

    const url = 'nodes/' + id
    nodesApi.configure({
      url
    })

    const data = {
      enabled: state
    }

    // TODO: try/catch should be handled by API
    try {
      const result = nodesApi.put(data)
      onNodeUpdateSuccess(result)
    } catch (error) {
      onNodeUpdateError(error)
    }
  }

  protected onNodeUpdateSuccess(data, options: any = {}) {
    const {
      shade
    } = options
    shade.hide();
  }

  protected onNodeUpdateError(error, options: any = {}) {
    const {
      shade
    } = options
    shade.hide();
  }
}
