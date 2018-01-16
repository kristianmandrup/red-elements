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

const { log } = console

let comms
beforeEach(() => {
  comms = create()
})

test('Communications: create', () => {
  expect(typeof comms).toBe('object')
})

test('communications: connect - makes active', () => {
  comms.connect()
  expect(comms.active).toBeTruthy()
})

test('communications: connect - opens Web socket', () => {
  comms.connect()
  const ws = comms.ws
  expect(typeof ws).toBe('object')

  // configures callback functions
  expect(typeof ws.onmessage).toBe('function')
  expect(typeof ws.onopen).toBe('function')
  expect(typeof ws.onclose).toBe('function')
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
  expect(subscription).toBeUndefined()
})
