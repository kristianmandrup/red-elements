interface IDialog extends JQuery<HTMLElement> {
  dialog: Function
}

import {
  Diff,
  Context,
  container,
  delegateTarget,
  FlowsApi,
  lazyInject,
  $TYPES
} from './_base'

import {
  INodes
} from '../../_interfaces'

const TYPES = $TYPES.all

export interface IFlowsLoader {
  loadFlows()
  onLoadError(error)
  onLoadSuccess(nodes)
}

@delegateTarget()
export class FlowsLoader extends Context implements IFlowsLoader {
  protected flowsApi: FlowsApi

  @lazyInject(TYPES.nodes) $nodes: INodes

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
      const result = await flowsApi.read.all()
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
      $nodes
    } = this
    const {
      generateDiff,
      resolveDiffs
    } = this.rebind([
        'generateDiff',
        'resolveDiffs'
      ], this.diff)

    var localFlow = $nodes.createCompleteNodeSet();
    var originalFlow = $nodes.originalFlow();

    var remoteFlow = nodes.flows;
    var localDiff = generateDiff(originalFlow, localFlow);
    var remoteDiff = generateDiff(originalFlow, remoteFlow);
    remoteDiff.rev = nodes.rev;
    resolveDiffs(localDiff, remoteDiff)
  }
}
