/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import {
  Context,
  delegator,
  delegateTarget,
  $TYPES,
  lazyInject,
  todo,
  IRedUtils
} from './_base'

const TYPES = $TYPES.all

import {
  INode,
  IEvents
} from '../../interfaces'

import {
  INodesContext,
  NodesContext
} from '../context'

import {
  IFlow,
  Flow
} from '../flow'

import {
  ISettings,
  Settings
} from '../../settings'

import {
  INodeCredentials,
  NodeCredentials
} from '../credentials'

import {
  INodesRegistry,
  NodesRegistry
} from '../registry'

import {
  IRegistry,
  Registry
} from '../registry/type-registry'


import {
  IFlowUtils,
  FlowUtils
} from './flow-utils'

export {
  IFlowUtils,
  FlowUtils
}

import {
  ILogger,
  Logger
} from '../../log'
import {
  Events
} from '../../events'
import {
  IUtil as IRedUtil,
  Util as RedUtil
} from '../../util'
import { FlowsConfiguration, IFlowsConfiguration } from './configuration';
import { FlowManager } from './flow-manager';
import { FlowsNodeManager, IFlowsNodeManager } from './node-manager';
import { FlowsErrorHandler, IFlowsErrorHandler } from './error-handler';
import { FlowsStatusHandler, IFlowsStatusHandler } from './status-handler';
import { FlowsExecuter, IFlowsExecuter } from './executer';
import { FlowsLoader } from './loader';
import { IFlowManager } from './flow-manager';
import { IFlowsLoader } from '../../../../red-widgets/src/node-diff/lib/flows-loader';


import {
  IFlows
} from './interface'


@delegator({
  map: {
    configuration: 'IFlowsConfiguration',
    flowManager: 'IFlowManager',
    nodeManager: 'IFlowsNodeManager',
    errorHandler: 'IFlowsErrorHandler',
    statusHandler: 'IFlowsStatusHandler',
    executer: 'IFlowsExecuter',
    loader: 'IFlowsLoader'
  }
})
export class Flows extends Context {
  storage = null
  activeConfig = null
  activeFlowConfig = null
  activeFlows = {}
  activeNodesToFlow = {}
  subflowInstanceNodeMap = {}
  typeEventRegistered = false
  protected _started = false

  @lazyInject(TYPES.settings) $settings: ISettings
  @lazyInject(TYPES.events) $events: IEvents
  @lazyInject(TYPES.logger) $log: ILogger
  @lazyInject(TYPES.typeRegistry) $registry: IRegistry
  @lazyInject(TYPES.flowUtils) $flowUtils: IFlowUtils
  @lazyInject(TYPES.redUtils) $redUtils: IRedUtils
  @lazyInject(TYPES.credentials) $credentials: INodeCredentials
  @lazyInject(TYPES.context) $context: INodesContext

  // TODO: Fix - temporary until proper service injection
  // context: INodesContext = new NodesContext()
  // credentials: INodeCredentials = new NodeCredentials()
  // settings: ISettings = new Settings()
  // events: IEvents = new Events()
  // log: ILogger = new Logger()
  // redUtil: IRedUtils = new RedUtils()
  // flowUtil: IFlowUtils = new FlowUtils()
  // typeRegistry: IRegistry = new Registry()

  // TODO: service injection
  protected configuration: IFlowsConfiguration // = new FlowsConfiguration(this)
  protected flowManager: IFlowManager // = new FlowManager(this)
  protected nodeManager: IFlowsNodeManager // = new FlowsNodeManager(this)
  protected errorHandler: IFlowsErrorHandler // = new FlowsErrorHandler(this)
  protected statusHandler: IFlowsStatusHandler // = new FlowsStatusHandler(this)
  protected executer: IFlowsExecuter // = new FlowsExecuter(this)
  protected loader: IFlowsLoader // = new FlowsLoader(this)

  /**
   * TODO:
   * inject as services
   * - events: Event
   * - log: Logger
   * - flowUtil: Util
   *
   */
  constructor() {
    super()
    this.configure()
  }

  /**
   * Configure flows
   */
  configure() {
    this.configuration.configure()
  }

  /**
   * Handle flow error
   * @param node
   * @param logMessage
   * @param msg
   */
  $handleError(node, logMessage, msg) {
    this.errorHandler.$handleError(node, logMessage, msg)
  }

  /**
   * If flow is started or not
   */
  get started() {
    return this.executer.started
  }

  /**
   * start flows
   * @param type
   * @param diff
   * @param muteLog
   */
  async startFlows(type: string, diff: any, muteLog: boolean): Promise<any> {
    return await this.executer.startFlows(type, diff, muteLog)
  }

  /**
   * Stop flows
   * @param type
   * @param diff
   * @param muteLog
   */
  async stopFlows(type: string, diff: any, muteLog: boolean): Promise<any> {
    return await this.executer.stopFlows(type, diff, muteLog)
  }

  /**
   * get list of flows
   * @returns { IFlow[] } list of flows
   */
  getFlows(): IFlow[] {
    return this.flowManager.getFlows()
  }

  /**
   * Get flow by ID
   * @param id
   */
  getFlow(id: string) {
    return this.flowManager.getFlow(id)
  }

  /**
   * Add flow
   * @param flow
   */
  async addFlow(flow: IFlow): Promise<any> {
    return await this.flowManager.addFlow(flow)
  }

  /**
   * Update flow by ID
   * @param id - id of flow to update
   * @param newFlow new Flow to update with
   */
  updateFlow(id: string, newFlow: IFlow) {
    return this.flowManager.updateFlow(id, newFlow)
  }

  /**
   * Remove flow by ID
   * @param id - id of flow to remove
   */
  removeFlow(id: string) {
    return this.flowManager.removeFlow(id)
  }

  /**
   * Load the current flow configuration from storage
   * @return a promise for the loading of the config
   */
  async load(): Promise<any> {
    return await this.loader.loadFlows()
  }

  /**
   * Get Node by ID
   * @param id - id of node
   */
  getNode(id: string): INode {
    return this.nodeManager.getNode(id)
  }

  /**
   * Iterate each node
   * @param cb
   */
  eachNode(cb: Function) {
    return this.nodeManager.eachNode(cb)
  }
}

