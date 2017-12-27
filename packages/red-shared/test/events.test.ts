import {
  Events
} from '../'

const evt = 'hello'
const handlers = {}

function create() {
  return new Events()
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
  let { handlers } = events
  let handler = handlers[evt]
  expect(handler).toBe(func)
})

test('events: off', () => {
  events.on(evt, func)
  let { handlers } = events
  let handler = handlers[evt]
  expect(handler).toBe(func)

  events.off(evt)
  handler = handlers[evt]
  expect(handler).toBe(null)

})

test('events: emit', async () => {
  events.on(evt, func)
  let result = events.emit(evt)
  expect(result).toBe(':hello')
})
