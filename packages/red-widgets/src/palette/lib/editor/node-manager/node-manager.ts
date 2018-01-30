import {
  Context
} from '../../../../context'

import { NodeApi } from './api';
import { PaletteEditor } from '../';

import {
  container,
  delegates
} from '../../container'

@delegates({
  container
})

export class PaletteEditorNodeManager extends Context {
  protected api: NodeApi = new NodeApi(this)

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
