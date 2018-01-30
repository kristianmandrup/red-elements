import {
  NodeDeleter
} from './node-deleter'

import {
  NodeCreater
} from './node-creater'

import {
  NodeUpdater
} from './node-updater'

import { PaletteEditorNodeManager } from '../node-manager';
import { NodesApi } from '@tecla5/red-runtime';

import {
  Context,
  container,
  delegator,
  delegateTarget
} from './_base'

@delegateTarget({
  container,
})
@delegator({
  container,
  map: {
    creator: NodeCreater,
    deleter: NodeDeleter,
    updater: NodeUpdater
  }
})
export class NodeApi extends Context {
  // shared api
  nodesApi: NodesApi = new NodesApi()

  protected creator: NodeCreater //= new NodeCreater(this)
  protected deleter: NodeDeleter //= new NodeDeleter(this)
  protected updater: NodeUpdater //= new NodeUpdater(this)

  constructor(public manager: PaletteEditorNodeManager) {
    super()
  }

  async createNode(data, options: any = {}) {
    return await this.creator.createNode(data, options)
  }

  async deleteNode(id: string) {
    return await this.deleter.deleteNode(id)
  }

  async updateNode(state: any, id: string) {
    return await this.updater.updateNode(state, id)
  }
}
