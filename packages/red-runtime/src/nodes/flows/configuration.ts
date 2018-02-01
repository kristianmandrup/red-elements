import {
  Context
} from '../../context'
import { Flows } from './index';

import clone from 'clone'

export interface IFlowsConfiguration {
  configure()
}

export class FlowsConfiguration extends Context {
  constructor(protected flows: Flows) {
    super()
  }

  configure() {
    const {
      flows,
      rebind
    } = this
    let {
      started,
      settings,
      storage,
      typeEventRegistered,
      activeFlowConfig
    } = flows

    const {
      events,
      log,
    } = flows

    const {
      startFlows
    } = rebind([
        'startFlows'
      ])

    if (started) {
      throw new Error("Cannot init without a stop");
    }
    started = false;
    if (!typeEventRegistered) {
      events.on('type-registered', function (type) {
        if (activeFlowConfig && activeFlowConfig.missingTypes.length > 0) {
          var i = activeFlowConfig.missingTypes.indexOf(type);
          if (i != -1) {
            log.info(log._("nodes.flows.registered-missing", {
              type: type
            }));
            activeFlowConfig.missingTypes.splice(i, 1);
            if (activeFlowConfig.missingTypes.length === 0 && started) {
              events.emit("runtime-event", {
                id: "runtime-state"
              });
              startFlows();
            }
          }
        }
      });
      typeEventRegistered = true;
    }

    this.setInstanceVars({
      started,
      settings,
      storage,
      typeEventRegistered
    })
  }
}
