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
import { ISettings, IEvents } from '../../index';
import { ILogger } from '../../log/logger';

export interface IFlowsConfiguration {
  configure()
}

@delegateTarget()
export class FlowsConfiguration extends Context {
  @lazyInject(TYPES.settings) $settings: ISettings
  @lazyInject(TYPES.events) $events: IEvents
  @lazyInject(TYPES.logger) $log: ILogger

  constructor(protected flows: Flows) {
    super()
  }

  configure() {
    const {
      flows,
      rebind,
      $settings,
      $events,
      $log,
    } = this
    let {
      started,
      storage,
      typeEventRegistered,
      activeFlowConfig
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
      $events.on('type-registered', function (type) {
        if (activeFlowConfig && activeFlowConfig.missingTypes.length > 0) {
          var i = activeFlowConfig.missingTypes.indexOf(type);
          if (i != -1) {
            $log.info($log.t("nodes.flows.registered-missing", {
              type: type
            }));
            activeFlowConfig.missingTypes.splice(i, 1);
            if (activeFlowConfig.missingTypes.length === 0 && started) {
              $events.emit("runtime-event", {
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
      storage,
      typeEventRegistered
    })
  }
}
