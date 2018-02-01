
import {
  Diff
} from './'

const { log } = console

interface IDialog extends JQuery<HTMLElement> {
  dialog: Function
}

import {
  Context,
  container,
  delegateTarget,
  FlowsApi
} from './_base'

export interface IFlowsLoader {
  loadFlows()
  onLoadError(error)
  onLoadSuccess(nodes)
}

@delegateTarget()
export class FlowsLoader extends Context implements IFlowsLoader {
  protected flowsApi: FlowsApi

  constructor(public diff: Diff) {
    super()
  }

  async loadFlows() {
    const {
      flowsApi,
      onLoadSuccess,
      onLoadError
    } = this

    this.flowsApi = new FlowsApi()

    try {
      const result = await flowsApi.load()
      onLoadSuccess(result)
    } catch (error) {
      onLoadError(error)
    }
  }

  onLoadError(error) {
    this.handleError('loadFlows', {
      error
    })
  }

  onLoadSuccess(nodes) {
    const {
      RED,
      generateDiff,
      resolveDiffs
    } = this.rebind([
        'generateDiff',
        'resolveDiffs'
      ], this.diff)

    var localFlow = RED.nodes.createCompleteNodeSet();
    var originalFlow = RED.nodes.originalFlow();
    var remoteFlow = nodes.flows;
    var localDiff = generateDiff(originalFlow, localFlow);
    var remoteDiff = generateDiff(originalFlow, remoteFlow);
    remoteDiff.rev = nodes.rev;
    resolveDiffs(localDiff, remoteDiff)
  }
}
