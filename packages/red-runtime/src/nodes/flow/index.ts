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
  IRedUtils,
  todo,
  clone
} from './_base'
const TYPES = $TYPES.all

import {
  IRegistry,
  Registry
} from '../registry/type-registry';

import {
  IFlowUtils,
  FlowUtils
} from '../flows'

import {
  ILogger,
  Logger
} from '../../log'
import {
  Util as RedUtils
} from '../../util'

import {
  keys as logKeys
} from '../../log/constants'
import { FlowExecuter } from './executer';
import { FlowBuilder } from './builder';
import { FlowErrorHandler } from './error-handler';
import { FlowStatusHandler } from './status-handler';

export interface IFlow {
  id: string
  label: string
  nodes: any[] // INode[] ??
  subflows: any[] // ISubflow[] or IFlow[]
  configs: any[]

  activeNodes: any
  subflowInstanceNodes: any
  catchNodeMap: any
  statusNodeMap: any

  start(diff)
  stop(stopList)
  update(_global, _flow)
  getNode(id)
  getActiveNodes()
}

@delegator({
  map: {
    executer: 'FlowExecuter',
    builder: 'FlowBuilder',
    errorHandler: 'FlowErrorHandler',
    statusHandler: 'FlowStatusHandler'
  }
})
export class Flow extends Context {
  activeNodes = {}
  subflowInstanceNodes = {}
  catchNodeMap = {}
  statusNodeMap = {}

  // TODO: FIX - see node-red Flow.js
  $global: any // IFlow ??
  $flow: any // IFlow ??

  nodes: any[] // INode[] ??
  subflows: any[] // ISubflow[] or IFlow[]

  keys: any = logKeys

  @lazyInject(TYPES.logger) $log: ILogger

  protected executer: FlowExecuter // = new FlowExecuter(this)
  protected builder: FlowBuilder // = new FlowBuilder(this)
  protected errorHandler: FlowErrorHandler // = new FlowErrorHandler(this)
  protected statusHandler: FlowStatusHandler // = new FlowStatusHandler(this)

  constructor(public configs = {}) {
    super()
  }

  // TODO: What is this global flow!? WTF!
  static create($global: IFlow, conf?: object) {
    return conf ? new Flow(conf) : $global
  }

  /**
   * Start flow
   * @param diff
   */
  start(diff: any) {
    return this.executer.start(diff)
  }

  /**
   * Stop flow (async)
   * @param stopList
   */
  async stop(stopList) {
    return await this.executer.stop(stopList)
  }

  /**
   * create Subflow
   * @param sf
   * @param sfn
   * @param subflows
   * @param globalSubflows
   * @param activeNodes
   */
  protected createSubflow(sf, sfn, subflows, globalSubflows, activeNodes) {
    return this.builder.createSubflow(sf, sfn, subflows, globalSubflows, activeNodes)
  }

  /**
   * create Node in flow
   * @param type
   * @param config
   */
  protected createNode(type: string, config: any) {
    return this.builder.createNode(type, config)
  }


  update(_global, _flow) {
    this.$global = _global;

    // TODO: FIX - see node-red Flow.js
    this.$flow = _flow;
  }

  /**
   * get Node by ID
   * @param id
   */
  getNode(id: string) {
    return this.activeNodes[id];
  }

  /**
   * get Active Nodes
   */
  getActiveNodes() {
    return this.activeNodes;
  }

  /**
   * handle Status
   * @param node
   * @param statusMessage
   */
  protected handleStatus(node, statusMessage: any) {
    this.statusHandler.handleStatus(node, statusMessage)
  }

  /**
   * handle Error
   * @param node
   * @param logMessage
   * @param msg
   */
  protected $handleError(node, logMessage: any, msg) {
    this.errorHandler.$handleError(node, logMessage, msg)
  }


  protected log(msg: any) {
    this.$log.log(msg)
  }

  /**
   *
   * @param msg
   */
  protected error(msg: any) {
    this.$log.error(msg)
  }
}
