import {
  Context,
  delegator,
  delegateTarget,
  $TYPES,
  lazyInject,
  todo,
  IRedUtils,
  clone
} from './_base'
const TYPES = $TYPES.all

import { Flows } from './index';
import { ILogger } from '../../log/logger';
import { IRegistry } from '../../index';

export interface IFlowsTypeManager {
  checkTypeInUse(id: string)
  updateMissingTypes()
}

@delegateTarget()
export class FlowsTypeManager extends Context implements IFlowsTypeManager {
  @lazyInject(TYPES.logger) $log: ILogger
  @lazyInject(TYPES.typeRegistry) $typeRegistry: IRegistry

  constructor(protected flows: Flows) {
    super()
  }

  /**
   * check Type In Use
   * @param id - id of type to check
   */
  checkTypeInUse(id: string): void {
    const {
      $log,
      $typeRegistry
    } = this
    const {
      getFlows,
    } = this.rebind([
        'getFlows',
      ])

    var nodeInfo = $typeRegistry.getNodeInfo(id);
    if (!nodeInfo) {
      throw new Error($log.t("nodes.index.unrecognised-id", {
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
        const err: any = new Error($log.t("nodes.index.type-in-use", {
          msg
        }));
        err.code = "type_in_use";
        throw err;
      }
    }
  }

  updateMissingTypes() {
    const {
      $typeRegistry,
      flows
    } = this

    const {
      activeFlowConfig,
    } = flows

    var subflowInstanceRE = /^subflow:(.+)$/;
    activeFlowConfig.missingTypes = [];

    for (var id in activeFlowConfig.allNodes) {
      if (activeFlowConfig.allNodes.hasOwnProperty(id)) {
        var node = activeFlowConfig.allNodes[id];
        if (node.type !== 'tab' && node.type !== 'subflow') {
          var subflowDetails = subflowInstanceRE.exec(node.type);
          if ((subflowDetails && !activeFlowConfig.subflows[subflowDetails[1]]) || (!subflowDetails && !$typeRegistry.get(node.type))) {
            if (activeFlowConfig.missingTypes.indexOf(node.type) === -1) {
              activeFlowConfig.missingTypes.push(node.type);
            }
          }
        }
      }
    }
  }

}
