import {
  Communications
} from './'

import {
  Context
} from '../context'

export interface ISubscriber {
  subscribe: (topic: string, callback: Function) => void
  unsubscribe: (topic: string, callback: Function) => void
}

const { log } = console

export class Subscriber extends Context {
  constructor(public communications: Communications) {
    super()
  }

  subscribe(topic: string, callback: Function) {
    const {
    ws,
      subscriptions
  } = this.communications

    let subscription = subscriptions[topic] || []
    subscription.push(callback);
    if (ws && ws.readyState == 1) {
      ws.send(JSON.stringify({
        subscribe: topic
      }));
    }
    subscriptions[topic] = subscription

    this.communications.subscriptions = subscriptions
    return this
  }

  unsubscribe(topic, callback) {
    let {
    subscriptions
  } = this.communications

    let subscription = subscriptions[topic]
    if (subscription) {
      for (var i = 0; i < subscription.length; i++) {
        if (subscription[i] === callback) {
          subscription.splice(i, 1);
          break;
        }
      }
      if (subscription.length === 0) {
        delete subscriptions[topic];
      }
    }

    this.communications.subscriptions = subscriptions
    return this
  }
}
