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

let comm
test.beforeEach(() => {
  comm = create()
})

test('Communications: create', () => {
  t.is(typeof comms, 'object')
})

test('communications: connect - makes active', () => {
  comms.connect()
  t.true(comms.active)
})

test('communications: connect - opens Web socket', () => {
  comms.connect()
  t.true(typeof comms.ws, 'object')

  // configures callback functions
  t.true(typeof comms.onmessage, 'function')
  t.true(typeof comms.onopen, 'function')
  t.true(typeof comms.onclose, 'function')
})

test('communications: subscribe - adds to subscriptions', () => {
  comms.subscribe('a', func)
  t.true(comms.subscriptions['a'], func)
})

test('communications: unsubscribe - removes from subscriptions', () => {
  comms.subscribe('a', func)
  t.true(comms.subscriptions['a'], func)
  comms.unsubscribe('a')
  t.false(comms.subscriptions['a'], func)
})
