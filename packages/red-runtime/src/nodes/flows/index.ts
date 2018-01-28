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
  Context
} from '../../context'


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
  IUtil as IRedUtils,
  Util as RedUtils
} from '../../util'


// TODO: register as services and inject instead!
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
import { FlowsConfiguration } from './configuration';
import { FlowManager } from './flow-manager';
import { FlowsNodeManager } from './node-manager';
import { FlowsErrorHandler } from './error-handler';
import { FlowsStatusHandler } from './status-handler';
import { FlowsExecuter } from './executer';
import { FlowsLoader } from './loader';

// var deprecated = require("../registry/deprecated");

export interface IFlows {
  load(): Promise<any>
  setFlows(_config: any, type: string, muteLog: boolean): Promise<any>
  loadFlows(): Promise<any> // TODO: returns IFlow??
  getNode(id: string): INode
  eachNode(cb: Function)
  getFlows(): IFlow[]

  startFlows(type: string, diff: any, muteLog: boolean): Promise<any>
  stopFlows(type: string, diff: any, muteLog: boolean): Promise<any>
  addFlow(flow: IFlow): Promise<any>
  checkTypeInUse(id: string): void
}

export class Flows extends Context {
  storage = null
  activeConfig = null
  activeFlowConfig = null
  activeFlows = {}
  activeNodesToFlow = {}
  subflowInstanceNodeMap = {}
  typeEventRegistered = false
  protected _started = false

  // TODO: Fix - temporary until proper service injection
  context: INodesContext = new NodesContext()
  credentials: INodeCredentials = new NodeCredentials()
  settings: ISettings = new Settings()
  events: IEvents = new Events()
  log: ILogger = new Logger()
  redUtil: IRedUtils = new RedUtils()
  flowUtil: IFlowUtils = new FlowUtils()
  typeRegistry: IRegistry = new Registry()

  // TODO: service injection
  protected configuration: FlowsConfiguration = new FlowsConfiguration(this)
  protected flowManager: FlowManager = new FlowManager(this)
  protected nodeManager: FlowsNodeManager = new FlowsNodeManager(this)
  protected errorHandler: FlowsErrorHandler = new FlowsErrorHandler(this)
  protected statusHandler: FlowsStatusHandler = new FlowsStatusHandler(this)
  protected executer: FlowsExecuter = new FlowsExecuter(this)
  protected loader: FlowsLoader = new FlowsLoader(this)

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
    return await this.loader.load()
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

