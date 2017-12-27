import {
  Notifications
} from './ui'

function create() {
  return new Notifications()
}

test('Notifications: create', () => {
  t.is(notifications.c, 0)
  t.deepEqual(notifications.currentNotifications, [])
})

test('Notifications: notify', () => {
  let msg = 'hello'
  let type = 'info'
  let elem = notifications.notify(msg, type)
  // returns div element with class: notification
  t.is(notified.className, 'notification')
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
