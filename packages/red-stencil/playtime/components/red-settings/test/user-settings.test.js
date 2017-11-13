const nightmare = require('../nightmare')
import test from 'ava'
import {
  UserSettings
} from './ui'
const ctx = {}

function create(ctx) {
  return new UserSettings(ctx)
}

test('UserSettings: create', () => {
  let settings = create(ctx)
  t.deepEqual(settings.viewSettings, {})
})

test('UserSettings: addPane', () => {
  let settings = create(ctx)
  let options = {
    id: 'x'
  }
  settings.addPane(options)
  let pane = settings.panes[0]
  t.deepEqual(pane, options)
})

test('UserSettings: show', () => {
  let settings = create(ctx)
  let initialTab = {}
  settings.show(initialTab)
})

test('UserSettings: createViewPane', () => {
  let settings = create(ctx)
  settings.createViewPane()
})

test('UserSettings: setSelected', () => {
  let settings = create(ctx)
  settings.setSelected(id, value)
})

test('UserSettings: toggle', () => {
  let settings = create(ctx)
  let id = 'x'
  settings.toggle(id)
})
