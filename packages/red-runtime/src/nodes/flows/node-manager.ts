// TODO: extract from Flow class

import {
  Context
} from '../../context'
import { Flows } from './index';
import {
  INode
} from '../../interfaces'

export interface IFlowsNodeManager {
  getNode(id: string)
  eachNode(cb: Function)
}

@delegateTarget()
export class FlowsNodeManager extends Context implements FlowsNodeManager {
  constructor(protected flows: Flows) {
    super()
  }

  /**
   * Get Node by ID
   * @param id - id of node
   */
  getNode(id: string): INode {
    const {
      activeNodesToFlow,
      activeFlows
    } = this.flows

    var node;
    if (activeNodesToFlow[id] && activeFlows[activeNodesToFlow[id]]) {
      return activeFlows[activeNodesToFlow[id]].getNode(id);
    }
    for (var flowId in activeFlows) {
      if (activeFlows.hasOwnProperty(flowId)) {
        node = activeFlows[flowId].getNode(id);
        if (node) {
          return node;
        }
      }
    }
    return null;
  }

  /**
   * Iterate each node
   * @param cb
   */
  eachNode(cb: Function) {
    const {
      activeFlowConfig
    } = this.flows

    for (var id in activeFlowConfig.allNodes) {
      if (activeFlowConfig.allNodes.hasOwnProperty(id)) {
        cb(activeFlowConfig.allNodes[id]);
      }
    }
  }

}
