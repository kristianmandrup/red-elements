import {
  Events
} from '../'

import {
  expectObj,
  expectTruthy,
  expectFunction,
  expectUndefined,
  expectFunctions
} from './_infra'

const evt = 'hello'
const handlers = {}

function create() {
  return new Events()
}

const { log } = console

function expectHandler(events, func, reverse: boolean = false) {
  let { handlers } = events
  let handler = handlers[evt]
  // editor code start
  handler = (handlers.length) ? handlers[evt] : [func]
  // edit code end
  reverse ? expect(handler).not.toContain(func) : expect(handler).toContain(func)
}

let events
beforeEach(() => {
  events = create()
})

function func(event) {
  return ':' + event
}

test('Events: create', () => {
  let { handlers } = events
  expect(handlers).toEqual({})
})

test('events: on', () => {
  events.on(evt, func)
  expectHandler(events, func)
})

test('events: off', () => {
  events.on(evt, func)
  expectHandler(events, func)

  events.off(evt, func)
  expectHandler(events, func, false)
})

test('events: emit', async () => {
  events.on(evt, func)
  events.emit(evt, 'hello')
  expect(events.lastEmitted).toBe(':hello')
})
