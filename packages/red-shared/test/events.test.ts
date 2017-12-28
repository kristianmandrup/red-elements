import {
  Events
} from '../'

const evt = 'hello'
const handlers = {}

function create() {
  return new Events()
}

const { log } = console

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
  let { handlers } = events
  let handler = handlers[evt]
  expect(handler).toContain(func)
})

test('events: off', () => {
  events.on(evt, func)
  let { handlers } = events
  let handler = handlers[evt]
  expect(handler).toContain(func)

  events.off(evt, func)
  handler = handlers[evt]
  expect(handler).not.toContain(func)

})

test('events: emit', async () => {
  events.on(evt, func)
  events.emit(evt, 'hello')
  expect(events.lastEmitted).toBe(':hello')
})
