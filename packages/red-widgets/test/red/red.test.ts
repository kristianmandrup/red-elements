import RED from '../../src/red'
import { expectObj, expectObjs } from '../../../red-runtime/test/_infra/helpers';

test('RED: history', () => {
  expectObj(RED.history)
})
test('RED: text', () => {
  expectObjs(RED.text.bidi, RED.text.format)
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
