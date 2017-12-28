import {
  Notifications
} from '../..'

function create() {
  return new Notifications()
}

let notifications
beforeEach(() => {
  notifications = create()
})

test('Notifications: create', () => {
  expect(notifications.c).toBe(0)
  expect(notifications.currentNotifications).toEqual([])
})

test('Notifications: notify', () => {
  let msg = 'hello'
  let type = 'info'
  let notified = notifications.notify(msg, type)
  // returns div element with class: notification
  expect(notified.className).toBe('notification')
})

test('Notifications: notify - fixed', () => {
  let msg = 'hello'
  let type = 'info'
  let fixed = true
  let timeout = null
  let elem = notifications.notify(msg, type, fixed, timeout)
})

test('Notifications: notify - timeout', () => {
  let msg = 'hello'
  let type = 'info'
  let fixed = false
  let timeout = 200
  let elem = notifications.notify(msg, type, fixed, timeout)
})
