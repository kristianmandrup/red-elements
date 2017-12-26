import {
  RED
} from '../'

test('RED: history', () => {
  expect(typeof RED.history).toBe('object')
})
test('RED: text', () => {
  expect(typeof RED.text.bidi).toBe('object')
  expect(typeof RED.text.format).toBe('object')
})
test('RED: i18n', () => {
  expect(typeof RED.i18n).toBe('object')
})
test('RED: events', () => {
  expect(typeof RED.events).toBe('object')
})
test('RED: comms', () => {
  expect(typeof RED.comms).toBe('object')
})
test('RED: settings', () => {
  expect(typeof RED.settings).toBe('object')
})
test('RED: user', () => {
  expect(typeof RED.user).toBe('object')
})
test('RED: validators', () => {
  expect(typeof RED.validators).toBe('object')
})
