// TODO: extract from Flow class

import {
  Context
} from '../../context'
import { Flows } from './index';

import {
  INode
} from '../../interfaces'

export interface IFlowsStatusHandler {
  delegateStatus(node, statusMessage)
  handleStatus(node: INode, statusMessage: string)
}

export class FlowsStatusHandler extends Context implements IFlowsStatusHandler {
  constructor(protected flows: Flows) {
    super()
  }

  delegateStatus(node, statusMessage) {
    const {
      flows
    } = this
    const {
      activeFlowConfig,
      activeFlows,
      activeNodesToFlow
    } = flows

    if (activeFlows[node.z]) {
      activeFlows[node.z].handleStatus(node, statusMessage);
    } else if (activeNodesToFlow[node.z] && activeFlows[activeNodesToFlow[node.z]]) {
      activeFlows[activeNodesToFlow[node.z]].handleStatus(node, statusMessage);
    }
  }

  handleStatus(node: INode, statusMessage: string): void {
    const {
      flows
    } = this

    const {
      events, // service
      activeFlowConfig,
    } = flows
    const {
      delegateStatus,
    } = this.rebind([
        'delegateStatus',
      ])

    events.emit("node-status", {
      id: node.id,
      status: statusMessage
    });
    if (node.z) {
      delegateStatus(node, statusMessage);
    } else {
      if (activeFlowConfig.configs[node.id]) {
        activeFlowConfig.configs[node.id]._users.forEach(function (id) {
          var userNode = activeFlowConfig.allNodes[id];
          delegateStatus(userNode, statusMessage);
        })
      }
    }
  }
}
