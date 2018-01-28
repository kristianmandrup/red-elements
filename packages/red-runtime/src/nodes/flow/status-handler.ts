// TODO: extract from Flow class

import {
  Context
} from '../../context'
import { Flow } from './index';

export class FlowStatusHandler extends Context {
  constructor(protected flow: Flow) {
    super()
  }

  /**
   * handle Status
   * @param node
   * @param statusMessage
   */
  handleStatus(node, statusMessage: any) {
    const {
      flow
    } = this
    const {
      statusNodeMap,
      activeNodes,
      catchNodeMap,
      logger
    } = flow

    var targetStatusNodes = null;
    var reportingNode = node;
    var handled = false;
    while (reportingNode && !handled) {
      targetStatusNodes = statusNodeMap[reportingNode.z];
      if (targetStatusNodes) {
        targetStatusNodes.forEach(function (targetStatusNode) {
          if (targetStatusNode.scope && targetStatusNode.scope.indexOf(node.id) === -1) {
            return;
          }
          var message = {
            status: {
              text: "",
              source: {
                id: node.id,
                type: node.type,
                name: node.name
              }
            }
          };
          if (statusMessage.hasOwnProperty("text")) {
            message.status.text = statusMessage.text.toString();
          }
          targetStatusNode.receive(message);
          handled = true;
        });
      }
      if (!handled) {
        reportingNode = activeNodes[reportingNode.z];
      }
    }
  }
}
