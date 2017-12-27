import {
  Communications
} from '../'
const ctx = {}

function create() {
  return new Communications()
}

function func(event) {
  return ':' + event
}

let comms
beforeEach(() => {
  comms = create()
})

test('Communications: create', () => {
  expect(typeof comms).toBe('object')
})

test('communications: connect - makes active', () => {
  comms.connect()
  expect(comms.active)
})

test('communications: connect - opens Web socket', () => {
  comms.connect()
  expect(typeof comms.ws).toBe('object')

  // configures callback functions
  expect(typeof comms.onmessage).toBe('function')
  expect(typeof comms.onopen).toBe('function')
  expect(typeof comms.onclose).toBe('function')
})

test('communications: subscribe - adds to subscriptions', () => {
  comms.subscribe('a', func)
  expect(comms.subscriptions['a']).toBe(func)
})

test('communications: unsubscribe - removes from subscriptions', () => {
  comms.subscribe('a', func)
  expect(comms.subscriptions['a']).toBe(func)
  comms.unsubscribe('a')
  expect(comms.subscriptions['a']).not.toBe(func)
})
