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
} from '../context'

import {
  IConnector,
  Connector
} from './connector'

import {
  ISubscriber,
  Subscriber
} from './subscriber'

const { log } = console

// https://www.npmjs.com/package/@types/ws
import * as WebSocket from 'ws'

// https://medium.com/factory-mind/websocket-node-js-express-step-by-step-using-typescript-725114ad5fe4

export interface ICommunications {
  connect()
  subscribe(topic: string, callback: Function)
  unsubscribe(topic, callback)
}

export class Communications extends Context {

  // TODO: perhaps make most/all protected?
  public errornotification: any
  public clearErrorTimer: any
  public connectCountdownTimer: any
  public connectCountdown: number = 10;
  public subscriptions = {};
  public pendingAuth: Boolean = false;
  public reconnectAttempts: number = 0;
  public active: Boolean = false
  public location: any
  public ws: any

  // TODO: use injection
  protected connector: IConnector
  protected subscriber: ISubscriber

  constructor() {
    super()
    // TODO: use injection
    this.connector = new Connector(this)
    this.subscriber = new Subscriber(this)
  }

  connect() {
    return this.connector.connect()
  }

  subscribe(topic: string, callback: Function) {
    this.subscriber.subscribe(topic, callback)
  }

  unsubscribe(topic, callback) {
    this.subscriber.unsubscribe(topic, callback)
  }
}
