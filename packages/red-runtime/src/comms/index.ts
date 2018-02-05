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
  delegator
} from './_base'

import {
  IConnector,
  Connector
} from './connector'

import {
  ISubscriber,
  Subscriber
} from './subscriber'

const { log } = console

import {
  WebSocket
} from '../_libs'

// https://www.npmjs.com/package/@types/ws

// https://medium.com/factory-mind/websocket-node-js-express-step-by-step-using-typescript-725114ad5fe4

export interface ICommunications {
  connect()
  subscribe(topic: string, callback: Function)
  unsubscribe(topic, callback)
}

@delegator({
  map: {
    connector: 'IConnector',
    subscriber: 'ISubscriber'
  }
})
export class Communications extends Context implements ICommunications {

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
  protected connector: IConnector // = new Connector(this)
  protected subscriber: ISubscriber // = new Subscriber(this)

  constructor() {
    super()
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
