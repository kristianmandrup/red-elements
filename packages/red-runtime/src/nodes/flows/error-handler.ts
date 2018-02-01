// TODO: extract from Flow class

import {
  Context
} from '../../context'
import { Flows } from './index';

import {
  INode
} from '../../interfaces'

export interface IFlowsErrorHandler {
  delegateError(node: INode, logMessage: string, msg: any)
  $handleError(node, logMessage, msg)
}

export class FlowsErrorHandler extends Context {
  constructor(protected flows: Flows) {
    super()
  }

  protected delegateError(node: INode, logMessage: string, msg: any): void {
    const {
      flows,
      rebind
    } = this
    const {
      activeNodesToFlow,
      activeFlows,
      activeFlowConfig,
      subflowInstanceNodeMap
    } = flows

    const {
      delegateError,
      getNode
    } = rebind([
        'delegateError',
        'getNode'
      ], flows)

    if (activeFlows[node.z]) {
      activeFlows[node.z].handleError(node, logMessage, msg);
    } else if (activeNodesToFlow[node.z] && activeFlows[activeNodesToFlow[node.z]]) {
      activeFlows[activeNodesToFlow[node.z]].handleError(node, logMessage, msg);
    } else if (activeFlowConfig.subflows[node.z] && subflowInstanceNodeMap[node.id]) {
      subflowInstanceNodeMap[node.id].forEach(function (n) {
        delegateError(getNode(n), logMessage, msg);
      });
    }
  }

  /**
   * Handle flow error
   * @param node
   * @param logMessage
   * @param msg
   */
  $handleError(node, logMessage, msg) {
    const {
      flows,
      rebind
    } = this
    const {
      activeFlowConfig,
    } = flows
    const {
      delegateError,
    } = rebind([
        'delegateError',
      ])

    if (node.z) {
      delegateError(node, logMessage, msg);
    } else {
      if (activeFlowConfig.configs[node.id]) {
        activeFlowConfig.configs[node.id]._users.forEach(function (id) {
          var userNode = activeFlowConfig.allNodes[id];
          delegateError(userNode, logMessage, msg);
        })
      }
    }
  }
}
