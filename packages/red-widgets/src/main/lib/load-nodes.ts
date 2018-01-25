import {
  Context
} from '../../context'

import { Main } from "./index";
import { NodesApi } from '@tecla5/red-runtime/src';
// import { RedApi } from '@tecla5/red-runtime/src/api/red-api';

interface IBody extends JQuery<HTMLElement> {
  i18n: Function
}

export class LoadNodes extends Context {
  loaded: any = {}

  // TODO: perhaps just use generic redApi for each?
  protected nodesApi: NodesApi
  // protected api: RedApi

  constructor(public main: Main) {
    super()
  }

  /**
 * Load nodes list
 */
  async loadNodeList() {
    let {
      nodesApi,
      onLoadNodeListSuccess,
      onLoadNodeListError
    } = this.rebind([
        'nodesApi'
      ])

    nodesApi = new NodesApi()

    try {
      const result = await nodesApi.load()
      onLoadNodeListSuccess(result)
    } catch (error) {
      onLoadNodeListError(error)
    }
  }

  /**
   * Update nodea and node catalogs with loaded nodes
   * @param data { Array } the list of nodes loaded
   */
  onLoadNodeListSuccess(data) {
    const { RED, loadNodes } = this

    RED.nodes.setNodeList(data);
    RED.i18n.loadNodeCatalogs(loadNodes);
    this.loaded.nodeList = {
      time: new Date()
    }
  }

  /**
   * Handle error on loading nodes list
   * @param error
   */
  onLoadNodeListError(error) {
    this.handleError('loadNodeList', {
      error
    })
  }

  async loadNodes() {
    const {
      nodesApi,
      onLoadNodesSuccess,
      onLoadNodesError
    } = this

    this.nodesApi = new NodesApi()

    try {
      const result = await nodesApi.load()
      onLoadNodesSuccess(result)
    } catch (error) {
      onLoadNodesError(error)
    }
  }

  onLoadNodesSuccess(data) {
    let body = <IBody>$('body').append(data);
    body.i18n();
    $('#palette > .palette-spinner').hide();
    $('.palette-scroll').removeClass('hide');
    $('#palette-search').removeClass('hide');
    this.loadFlows();
    this.loaded.nodes = {
      time: new Date()
    }
  }

  onLoadNodesError(error) {
    this.handleError('loadNodes', {
      error
    })
  }


}
