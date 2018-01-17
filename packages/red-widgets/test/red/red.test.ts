import RED from '../../src/red'
import { expectObj, expectObjs } from '../../../red-runtime/test/_infra/helpers';

test('RED: history', () => {
  expectObj(RED.history)
})
test('RED: text', () => {
  expectObjs(RED.text.bidi, RED.text.format)
})
test('RED: i18n', () => {
  expectObj(RED.i18n)
})
test('RED: events', () => {
  expectObj(RED.events)
})
test('RED: comms', () => {
  expectObj(RED.comms)
})
test('RED: settings', () => {
  expectObj(RED.settings)
})
test('RED: user', () => {
  expectObj(RED.user)
})
test('RED: validators', () => {
  expectObj(RED.validators)
})
