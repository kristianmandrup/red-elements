import test from 'ava'
import {
  RED
} from './api'

test('RED: history', () => {
  t.is(typeof RED.history, 'object')
})
test('RED: text', () => {
  t.is(typeof RED.text.bidi, 'object')
  t.is(typeof RED.text.format, 'object')
})
test('RED: i18n', () => {
  t.is(typeof RED.i18n, 'object')
})
test('RED: events', () => {
  t.is(typeof RED.events, 'object')
})
test('RED: comms', () => {
  t.is(typeof RED.comms, 'object')
})
test('RED: settings', () => {
  t.is(typeof RED.settings, 'object')
})
test('RED: user', () => {
  t.is(typeof RED.user, 'object')
})
test('RED: validators', () => {
  t.is(typeof RED.validators, 'object')
})
