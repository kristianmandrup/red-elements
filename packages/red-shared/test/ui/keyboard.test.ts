import {
  Keyboard
} from '../..'

import {
  $,
  readPage
} from '../_setup'

const { log } = console

function create() {
  return new Keyboard()
}

let kb
beforeEach(() => {
  kb = create()
})

test('Keyboard: create - is an object', () => {
  expect(typeof kb).toBe('object')
})

test('Keyboard: create - empty handlers', () => {
  expect(kb.handlers).toEqual({})
})

test('Keyboard: create - no partialState', () => {
  expect(kb.partialState).toBe(null)
})

test('Keyboard: create - no partialState', () => {
  expect(kb.partialState).toBe(null)
})

test('Keyboard: create - empty actionToKeyMap', () => {
  expect(kb.actionToKeyMap).toEqual({})
})

test('Keyboard: create - empty defaultKeyMap', () => {
  expect(kb.defaultKeyMap).toEqual({})
})

test('Keyboard: revertToDefault(action)', () => {
  const action = 'run'
  const reverted = kb.revertToDefault(action)
  expect(reverted).toBe(kb)
})

test('Keyboard: parseKeySpecifier(key)', () => {
  const key = 'A'
  const parsed = kb.parseKeySpecifier(key)
  expect(parsed).toEqual([65, { "alt": false, "ctrl": false, "meta": false, "shift": false }])
})

test('Keyboard: resolveKeyEvent(evt)', () => {
  const evt = {}
  const parsed = kb.resolveKeyEvent(evt)
  expect(parsed).toBe(kb)
})

test('Keyboard: addHandler(scope, key, modifiers, ondown)', () => {
  const key = 'A'
  const scope = {}
  const modifiers = 'x' // Function or string
  const ondown = () => { } // dummy onDown event handler function
  const added = kb.addHandler(scope, key, modifiers, ondown)
  expect(added).toBe(kb)
})

test('Keyboard: removeHandler(key, modifiers)', () => {
  const key = 'A'
  const modifiers = {}
  const removed = kb.removeHandler(key, modifiers)
  expect(removed).toBe(kb)
})

test('Keyboard: addHandler(scope, key, modifiers, ondown)', () => {
  const key = 'A'
  const formatted = kb.formatKey(key)
  expect(formatted).toMatch(/help-key-block/)
})

test('Keyboard: validateKey(key)', () => {
  const key = 'A'
  const validated = kb.validateKey(key)
  expect(validated).toBeTruthy()
})

test('Keyboard: editShortcut(e)', done => {
  const el = $('<div></div>')
  el.data('data', {
    scope: 'x'
  })
  el.on('click', (e) => {
    const result = kb.editShortcut(e, el)
    expect(result).toBeDefined()
    done()
  })

  el.click()
})

test('Keyboard: endEditShortcut(cancel)', () => {
  const cancel = true
  const ended = kb.endEditShortcut(cancel)
  expect(ended).toBe(kb)
})

test('Keyboard: buildShortcutRow(container, object)', () => {
  const container = $('<div id="container"></div>')
  const object = {
    id: 'a'
  }
  const built = kb.buildShortcutRow(container, object)
  expect(built).toBe(kb)
})

test.skip('Keyboard: getSettingsPane()', () => {
  // TODO:
  // see: Keyboard constructor
  // somehow use SearchBox widget from red-widgets (possibly move all common widgets to red-shared)
  // avoid circular dependency!

  // make SearchBox widget factory available on all jQuery elements
  // new SearchBox()

  const pane = kb.getSettingsPane()
  expect(pane).toBeDefined()
})

test('getShortcut(actionName)', () => {
  const action = 'run'
  const actionName = action
  const ondown = action // key to store action shortcut in actionToKeyMap
  const scope = {}
  const key = 'A'
  const modifiers = {}

  // NOTE: adds shortcut to internal actionToKeyMap object used by getShortcut
  kb.addHandler(scope, key, modifiers, ondown)

  log({
    actionMap: kb.actionToKeyMap
  })

  const shortcut = kb.getShortcut(actionName)
  expect(shortcut).toBeDefined()
})

