import {
  Events
} from '../'

const ctx = {}
const evt = 'hello'

function create() {
  return new Events()
}

let events
test.beforeEach(() => {
  events = create()
})

function func(event) {
  return ':' + event
}

test('Events: create', () => {
  t.deepEqual(handlers, {})
})

test('events: on', () => {
  events.on(evt, func)
  let handler = handlers[evt]
  expect(handler).toBe(func)
})

test('events: off', () => {
  events.on(evt, func)
  let handler = handlers[evt]
  expect(handler).toBe(func)


  events.off(evt)
  let handler = handlers[evt]
  expect(handler).toBe(null)

})

test('events: emit', async () => {
  events.on(evt, func)
  let result = events.emit(evt)
  expect(result).toBe(':hello')
})
