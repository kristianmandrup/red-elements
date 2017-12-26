import {
  Settings
} from '../'

function create() {
  return new Settings()
}

test('settings: create', () => {
  expect(typeof settings.loadedSettings).toBe('object')
})

test('settings: init', async () => {
  // TODO: change done callback to async with promise
  await settings.init()
})

test('settings: localstorage', () => {
  expect(settings.hasLocalStorage()).toBeTruthy()
})

test('settings: properties', () => {
  const data = {
    x: 2
  }
  settings.setProperties(data)

  expect(settings.x).toBe(2)
})

// called by init
test('settings: load', async () => {
  // TODO: change done callback to async with promise
  await settings.load()
})

test('settings: theme', () => {
  let defaultValue = true
  // test real theme values
  let property = 'palette.editable'
  settings.theme(property, defaultValue)

  // test theme value is set on .editorTheme object
  expect(typeof settings.editorTheme).toBe('object')
  expect(settings.editorTheme.palette.editable).toBe(true)
})
