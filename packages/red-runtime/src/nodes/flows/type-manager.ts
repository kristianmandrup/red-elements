// TODO: extract from Flow class

import {
  Context
} from '../../context'
import { Flows } from './index';

export interface FlowsTypeManager {
  checkTypeInUse(id: string)
  updateMissingTypes()
}

export class FlowsTypeManager extends Context implements IFlowsTypeManager {
  constructor(protected flows: Flows) {
    super()
  }

  /**
   * check Type In Use
   * @param id - id of type to check
   */
  checkTypeInUse(id: string): void {
    const {
      log,
      typeRegistry
    } = this
    const {
      getFlows,
    } = this.rebind([
        'getFlows',
      ])

    var nodeInfo = typeRegistry.getNodeInfo(id);
    if (!nodeInfo) {
      throw new Error(log._("nodes.index.unrecognised-id", {
        id: id
      }));
    } else {
      var inUse = {};
      var config = getFlows();
      config.flows.forEach(function (n) {
        inUse[n.type] = (inUse[n.type] || 0) + 1;
      });
      var nodesInUse = [];
      nodeInfo.types.forEach(function (t) {
        if (inUse[t]) {
          nodesInUse.push(t);
        }
      });
      if (nodesInUse.length > 0) {
        const msg = nodesInUse.join(", ");
        const err: any = new Error(log._("nodes.index.type-in-use", {
          msg
        }));
        err.code = "type_in_use";
        throw err;
      }
    }
  }

  updateMissingTypes() {
    const {
      activeFlowConfig,
      typeRegistry
    } = this

    var subflowInstanceRE = /^subflow:(.+)$/;
    activeFlowConfig.missingTypes = [];

    for (var id in activeFlowConfig.allNodes) {
      if (activeFlowConfig.allNodes.hasOwnProperty(id)) {
        var node = activeFlowConfig.allNodes[id];
        if (node.type !== 'tab' && node.type !== 'subflow') {
          var subflowDetails = subflowInstanceRE.exec(node.type);
          if ((subflowDetails && !activeFlowConfig.subflows[subflowDetails[1]]) || (!subflowDetails && !typeRegistry.get(node.type))) {
            if (activeFlowConfig.missingTypes.indexOf(node.type) === -1) {
              activeFlowConfig.missingTypes.push(node.type);
            }
          }
        }
      }
    }
  }

}
