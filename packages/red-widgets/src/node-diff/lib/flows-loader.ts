
import {
  Diff
} from './'
import { Context } from '../../context';
import { FlowsApi } from '@tecla5/red-runtime/src';

const { log } = console

interface IDialog extends JQuery<HTMLElement> {
  dialog: Function
}

export class FlowsLoader extends Context {
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
