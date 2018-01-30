import { NodeApi } from './api';
import { PaletteEditor } from '../';

import {
  Context,
  container,
  delegateTarget,
  delegator
} from './_base'

@delegateTarget({
  container
})
@delegator({
  container,
  map: {
    api: NodeApi
  }
})
export class PaletteEditorNodeManager extends Context {
  protected api: NodeApi // = new NodeApi(this)

  constructor(public editor: PaletteEditor) {
    super()
  }

  async createNode(data, options: any = {}) {
    return await this.api.createNode(data, options)
  }

  async deleteNode(id: string) {
    return await this.api.deleteNode(id)
  }

  async updateNode(state: any, id: string) {
    return await this.api.updateNode(state, id)
  }

}
