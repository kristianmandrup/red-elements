// TODO: extract from Flow class

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
import { Flow } from '../flow';

import {
  deprecated
} from '../registry/deprecated'
import { ISettings, IEvents } from '../../index';
import { ILogger } from '../../log/logger';

export interface IFlowsExecuter {
  started: boolean
  startFlows(type: string, diff: any, muteLog: boolean)
  stopFlows(type: string, diff: any, muteLog: boolean)
}

@delegateTarget()
export class FlowsExecuter extends Context implements IFlowsExecuter {
  protected _started: boolean

  @lazyInject(TYPES.settings) $settings: ISettings
  @lazyInject(TYPES.events) $events: IEvents
  @lazyInject(TYPES.logger) $log: ILogger

  constructor(protected flows: Flows) {
    super()
  }

  get started() {
    return this._started
  }

  protected setStarted() {
    this._started = true
    return this
  }

  protected setStopped() {
    this._started = false
    return this
  }


  /**
   * start flows
   * @param type
   * @param diff
   * @param muteLog
   */
  async startFlows(type: string, diff: any, muteLog: boolean): Promise<any> {
    const {
      flows,
      rebind
    } = this
    const {
      $events, // service
      $settings, // service
      $log, // service
      activeFlowConfig,
      activeFlows,
      activeNodesToFlow,
      subflowInstanceNodeMap
    } = flows
    const {
      setStarted,
    } = rebind([
        'setStarted',
      ])

    //dumpActiveNodes();
    type = type || "full";
    setStarted()
    var i;
    if (activeFlowConfig.missingTypes.length > 0) {
      $log.info($log.t("nodes.flows.missing-types"));
      var knownUnknowns = 0;
      for (i = 0; i < activeFlowConfig.missingTypes.length; i++) {
        var nodeType = activeFlowConfig.missingTypes[i];
        var info = deprecated.get(nodeType);
        if (info) {
          $log.info($log.t("nodes.flows.missing-type-provided", {
            type: activeFlowConfig.missingTypes[i],
            module: info.module
          }));
          knownUnknowns += 1;
        } else {
          $log.info(" - " + activeFlowConfig.missingTypes[i]);
        }
      }
      if (knownUnknowns > 0) {
        $log.info($log.t("nodes.flows.missing-type-install-1"));
        $log.info("  npm install <module name>");
        $log.info($log.t("nodes.flows.missing-type-install-2"));
        $log.info("  " + $settings.userDir);
      }
      $events.emit("runtime-event", {
        id: "runtime-state",
        type: "warning",
        text: "notification.warnings.missing-types"
      });
      return Promise.resolve();
    }
    if (!muteLog) {
      if (diff) {
        $log.info($log.t("nodes.flows.starting-modified-" + type));
      } else {
        $log.info($log.t("nodes.flows.starting-flows"));
      }
    }
    var id;
    if (!diff) {
      if (!activeFlows['global']) {
        activeFlows['global'] = Flow.create(activeFlowConfig);
      }
      for (id in activeFlowConfig.flows) {
        if (activeFlowConfig.flows.hasOwnProperty(id)) {
          if (!activeFlows[id]) {
            activeFlows[id] = Flow.create(activeFlowConfig, activeFlowConfig.flows[id]);
          }
        }
      }
    } else {
      activeFlows['global'].update(activeFlowConfig, activeFlowConfig);
      for (id in activeFlowConfig.flows) {
        if (activeFlowConfig.flows.hasOwnProperty(id)) {
          if (activeFlows[id]) {
            activeFlows[id].update(activeFlowConfig, activeFlowConfig.flows[id]);
          } else {
            activeFlows[id] = Flow.create(activeFlowConfig, activeFlowConfig.flows[id]);
          }
        }
      }
    }

    for (id in activeFlows) {
      if (activeFlows.hasOwnProperty(id)) {
        activeFlows[id].start(diff);
        var activeNodes = activeFlows[id].getActiveNodes();
        Object.keys(activeNodes).forEach(function (nid) {
          activeNodesToFlow[nid] = id;
          if (activeNodes[nid]._alias) {
            subflowInstanceNodeMap[activeNodes[nid]._alias] = subflowInstanceNodeMap[activeNodes[nid]._alias] || [];
            subflowInstanceNodeMap[activeNodes[nid]._alias].push(nid);
          }
        });

      }
    }
    $events.emit("nodes-started");
    $events.emit("runtime-event", {
      id: "runtime-state"
    });

    if (!muteLog) {
      if (diff) {
        $log.info($log.t("nodes.flows.started-modified-" + type));
      } else {
        $log.info($log.t("nodes.flows.started-flows"));
      }
    }
    return Promise.resolve();
  }

  /**
   * Stop flows
   * @param type
   * @param diff
   * @param muteLog
   */
  async stopFlows(type: string, diff: any, muteLog: boolean): Promise<any> {
    const {
      flows,
      rebind,
      $log, // service
    } = this
    const {
      activeFlows,
      activeNodesToFlow
    } = flows
    let {
      subflowInstanceNodeMap
    } = flows
    const {
      setStopped,
    } = rebind([
        'setStopped',
      ])

    type = type || "full";
    if (!muteLog) {
      if (diff) {
        $log.info($log.t("nodes.flows.stopping-modified-" + type));
      } else {
        $log.info($log.t("nodes.flows.stopping-flows"));
      }
    }
    setStopped()
    var promises = [];
    var stopList;
    if (type === 'nodes') {
      stopList = diff.changed.concat(diff.removed);
    } else if (type === 'flows') {
      stopList = diff.changed.concat(diff.removed).concat(diff.linked);
    }
    for (var id in activeFlows) {
      if (activeFlows.hasOwnProperty(id)) {
        promises = promises.concat(activeFlows[id].stop(stopList));
        if (!diff || diff.removed.indexOf(id) !== -1) {
          delete activeFlows[id];
        }
      }
    }

    return new Promise((resolve, reject) => {
      Promise.all(promises).then(function () {
        for (id in activeNodesToFlow) {
          if (activeNodesToFlow.hasOwnProperty(id)) {
            if (!activeFlows[activeNodesToFlow[id]]) {
              delete activeNodesToFlow[id];
            }
          }
        }
        if (stopList) {
          stopList.forEach(function (id) {
            delete activeNodesToFlow[id];
          });
        }
        // Ideally we'd prune just what got stopped - but mapping stopList
        // id to the list of subflow instance nodes is something only Flow
        // can do... so cheat by wiping the map knowing it'll be rebuilt
        // in start()
        subflowInstanceNodeMap = {};
        if (!muteLog) {
          if (diff) {
            $log.info($log.t("nodes.flows.stopped-modified-" + type));
          } else {
            $log.info($log.t("nodes.flows.stopped-flows"));
          }
        }

        // set instance var
        this.subflowInstanceNodeMap = subflowInstanceNodeMap

        resolve();
      });
    });
  }
}
