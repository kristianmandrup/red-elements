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
import { ISettings, INodeCredentials, INodesContext, IFlowUtils } from '../../index';
import { ILogger } from '../../log';

@delegateTarget()
export class FlowsLoader extends Context {
  @lazyInject(TYPES.settings) $settings: ISettings
  @lazyInject(TYPES.credentials) $credentials: INodeCredentials
  @lazyInject(TYPES.logger) $log: ILogger
  @lazyInject(TYPES.context) $context: INodesContext
  @lazyInject(TYPES.flowUtils) $flowUtils: IFlowUtils

  constructor(protected flows: Flows) {
    super()
  }

  /**
   * Load the current flow configuration from storage
   * @return a promise for the loading of the config
   */
  async load(): Promise<any> {
    return this.setFlows(null, "load", false);
  }

  /**
   * Sets the current active config.
   * @param config the configuration to enable
   * @param type the type of deployment to do: full (default), nodes, flows, load
   * @return a promise for the saving/starting of the new flow
   */
  /*
   * _config - new node array configuration
   * type - full/nodes/flows/load (default full)
   * muteLog - don't emit the standard log messages (used for individual flow api)
   */
  protected async setFlows(_config: any, type: string, muteLog: boolean): Promise<any> {
    const {
      flows,
      $context, // service
      $credentials, // service
      $log, // service
      $flowUtils // service
    } = this
    const {
      started,
      storage,
    } = flows
    let {
      activeFlowConfig,
      activeConfig,
    } = flows

    const {
      loadFlows,
      stopFlows,
      startFlows
    } = this.rebind([
        'loadFlows',
        'stopFlows',
        'startFlows'
      ], flows)

    type = type || "full";

    var configSavePromise = null;
    var config = null;
    var diff;
    var newFlowConfig;
    var isLoad = false;
    if (type === "load") {
      isLoad = true;
      configSavePromise = loadFlows().then(function (_config) {
        config = clone(_config.flows);
        newFlowConfig = $flowUtils.parseConfig(clone(config));
        type = "full";
        return _config.rev;
      });
    } else {
      config = clone(_config);
      newFlowConfig = $flowUtils.parseConfig(clone(config));
      if (type !== 'full') {
        diff = $flowUtils.diffConfigs(activeFlowConfig, newFlowConfig);
      }
      $credentials.clean(config);
      var credsDirty = $credentials.dirty;
      configSavePromise = $credentials.export().then(function (creds) {
        var saveConfig = {
          flows: config,
          credentialsDirty: credsDirty,
          credentials: creds
        }
        return storage.saveFlows(saveConfig);
      });
    }

    return configSavePromise
      .then(function (flowRevision) {
        if (!isLoad) {
          $log.debug("saved flow revision: " + flowRevision);
        }
        activeConfig = {
          flows: config,
          rev: flowRevision
        };
        activeFlowConfig = newFlowConfig;
        if (started) {
          return stopFlows(type, diff, muteLog).then(function () {
            $context.clean(activeFlowConfig);
            startFlows(type, diff, muteLog);
            return flowRevision;
          }).otherwise(function (err) { })
        }
      });
  }

  /**
   * TODO: fix returns IFlow or sth
   */
  protected async loadFlows(): Promise<any> {
    const {
      $credentials, // service
      $log // service
    } = this

    const {
      storage,
    } = this.flows

    return storage.getFlows().then(function (config) {
      $log.debug("loaded flow revision: " + config.rev);
      return $credentials.load(config.credentials).then(function () {
        return config;
      });
    }).catch(function (err) {
      $log.warn($log.t("nodes.flows.error", {
        message: err.toString()
      }));
      console.log(err.stack);
    });
  }
}
