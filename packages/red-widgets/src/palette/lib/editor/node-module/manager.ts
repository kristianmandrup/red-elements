import { PaletteEditor } from '../'
import { NodeModuleRefresher } from './refresher';

import {
  Context,
  container,
  delegateTarget
} from './_base'

@delegateTarget()
export class NodeModuleManager extends Context {
  refresher: NodeModuleRefresher = new NodeModuleRefresher(this)

  constructor(public editor: PaletteEditor) {
    super()
  }

  get nodeManager() {
    return this.editor.nodeManager
  }

  /**
   * Refresh Node module
   * @param module
   */
  refreshNodeModule(module) {
    this.refresher.refreshNodeModule(module)
  }

  /**
   * install a NodeModule
   * @param id
   * @param callback
   * @param version
   * @param shade
   */
  async installNodeModule(id: string, callback: Function, version?: any, shade?: any) {
    var requestBody = {
      module: id,
      version: null
    };
    shade = version;
    requestBody.version = version;
    shade.show()

    await this.nodeManager.createNode(requestBody)
  }

  /**
   * remove Node Module
   * @param id
   */
  async removeNodeModule(id: string) {
    this.nodeManager.deleteNode(id)
  }


  refreshNodeModuleList() {
    const {
      nodeEntries
    } = this.editor

    for (var id in nodeEntries) {
      if (nodeEntries.hasOwnProperty(id)) {
        this.refresher._refreshNodeModule(id);
      }
    }
  }
}
