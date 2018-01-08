import {
  Keyboard
} from '../..'

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
  const action = {
  }
  kb.revertToDefault(action)
  expect(kb).toEqual({})
})

test('Keyboard: parseKeySpecifier(key)', () => {
  const key = 'A'
  const parsed = kb.parseKeySpecifier(key)
  expect(parsed).toEqual({})
})


test('Keyboard: resolveKeyEvent(evt)', () => {
  const evt = {}
  const parsed = kb.resolveKeyEvent(evt)
  expect(parsed).toEqual({})
})

test('Keyboard: addHandler(scope, key, modifiers, ondown)', () => {
  const key = 'A'
  const scope = {}
  const modifiers = {}
  const ondown = true
  const handler = kb.addHandler(scope, key, modifiers, ondown)
  expect(handler).toEqual({})
})

test('Keyboard: removeHandler(key, modifiers)', () => {
  const key = 'A'
  const modifiers = {}
  const removed = kb.removeHandler(key, modifiers)
  expect(removed).toEqual({})
})

test('Keyboard: addHandler(scope, key, modifiers, ondown)', () => {
  const key = 'A'
  const formatted = kb.formatKey(key)
  expect(formatted).toEqual({})
})

test('Keyboard: validateKey(key)', () => {
  const key = 'A'
  const validated = kb.validateKey(key)
  expect(validated).toBeTruthy()
})
test('Keyboard: editShortcut(e)', () => {
  const e = {}
  kb.editShortcut(e)
})

test('Keyboard: endEditShortcut(cancel)', () => {
  const cancel = true
  kb.endEditShortcut(cancel)
})

test('Keyboard: buildShortcutRow(container, object)', () => {
  const container = 'config'
  const object = {}
  kb.buildShortcutRow(container, object)
})

test('Keyboard: getSettingsPane()', () => {
  kb.getSettingsPane()
})

test('getShortcut(actionName)', () => {
  const actionName = 'run'
  kb.getShortcut(actionName)
})

