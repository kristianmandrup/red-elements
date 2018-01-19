import {
  Communications
} from '../'
const ctx = {}

import {
  expectObj,
  expectTruthy,
  expectFunction,
  expectUndefined,
  expectFunctions
} from './_infra'
import { reverse } from 'dns';

function create() {
  return new Communications()
}

function func(event) {
  return ':' + event
}

const { log } = console

let comms
beforeEach(() => {
  comms = create()
})

test('Communications: create', () => {
  expectObj(comms)
})

test('communications: connect - makes active', () => {
  comms.connect()
  expectTruthy(comms.active)
})

test('communications: connect - opens Web socket', () => {
  comms.connect()
  const ws = comms.ws

  if (typeof ws === 'object') {
    expect(typeof ws).toBe('object')

    // configures callback functions
    expectFunctions(ws.onmessage, ws.onopen, ws.onclose)
  }
})

test('communications: subscribe - adds to subscriptions', () => {
  comms.subscribe('a', func)
  expect(comms.subscriptions['a']).toContain(func)
})

test('communications: unsubscribe - removes from subscriptions', () => {
  comms.subscribe('a', func)
  let subscription = comms.subscriptions['a']
  expect(comms.subscriptions['a']).toContain(func)
  comms.unsubscribe('a', func)
  subscription = comms.subscriptions['a']
  expectUndefined(subscription)
})