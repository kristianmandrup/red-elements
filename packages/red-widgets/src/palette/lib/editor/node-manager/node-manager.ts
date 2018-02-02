import { NodeApi } from './api';
import { PaletteEditor } from '../';

import {
  Context,
  container,
  delegateTarget,
  delegator,
  delegateTo
} from './_base'

@delegateTarget()
@delegator({
  map: {
    api: NodeApi
  }
})
export class PaletteEditorNodeManager extends Context {
  protected api: NodeApi // = new NodeApi(this)

  constructor(public editor: PaletteEditor) {
    super()
  }

  @delegateTo('api')
  async createNode(data, options: any = {}) {
    return await this.api.createNode(data, options)
  }

  @delegateTo('api')
  async deleteNode(id: string) {
    return await this.api.deleteNode(id)
  }

  @delegateTo('api')
  async updateNode(state: any, id: string) {
    return await this.api.updateNode(state, id)
  }

}
