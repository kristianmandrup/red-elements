// TODO: extract from Flow class

import {
  Context
} from '../../context'
import { Flow } from './index';

export class FlowErrorHandler extends Context {
  constructor(protected flow: Flow) {
    super()
  }

  /**
   * handle Error
   * @param node
   * @param logMessage
   * @param msg
   */
  $handleError(node, logMessage: any, msg) {
    const {
      flow
    } = this
    const {
      logger,
      catchNodeMap,
      redUtil,
      activeNodes
    } = flow

    var count = 1;
    if (msg && msg.hasOwnProperty("error")) {
      if (msg.error.hasOwnProperty("source")) {
        if (msg.error.source.id === node.id) {
          count = msg.error.source.count + 1;
          if (count === 10) {
            node.warn(logger._("nodes.flow.error-loop"));
            return;
          }
        }
      }
    }
    var targetCatchNodes = null;
    var throwingNode = node;
    var handled = false;
    while (throwingNode && !handled) {
      targetCatchNodes = catchNodeMap[throwingNode.z];
      if (targetCatchNodes) {
        targetCatchNodes.forEach(function (targetCatchNode) {
          if (targetCatchNode.scope && targetCatchNode.scope.indexOf(throwingNode.id) === -1) {
            return;
          }
          var errorMessage;
          if (msg) {
            errorMessage = redUtil.cloneMessage(msg);
          } else {
            errorMessage = {};
          }
          if (errorMessage.hasOwnProperty("error")) {
            errorMessage._error = errorMessage.error;
          }
          errorMessage.error = {
            message: logMessage.toString(),
            source: {
              id: node.id,
              type: node.type,
              name: node.name,
              count: count
            }
          };
          if (logMessage.hasOwnProperty('stack')) {
            errorMessage.error.stack = logMessage.stack;
          }
          targetCatchNode.receive(errorMessage);
          handled = true;
        });
      }
      if (!handled) {
        throwingNode = activeNodes[throwingNode.z];
      }
    }
  }
}
