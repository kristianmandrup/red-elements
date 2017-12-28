import {
  Settings
} from '../'

function create() {
  return new Settings()
}

let settings
beforeEach(() => {
  settings = create()
})

const { log } = console

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

test.only('settings: properties', () => {
  const data = {
    x: 2
  }
  settings.setProperties(data)
  const $settings = settings.ctx.settings
  // log({
  //   settings: $settings,
  //   loaded: settings.loadedSettings
  // })
  expect(settings.loadedSettings.x).toBe(2)
  expect($settings.x).toBe(2)
})

// called by init
test('settings: load', async () => {
  // TODO: change done callback to async with promise
  await settings.load()
})

test.only('settings: theme', () => {
  let defaultValue = true
  // test real theme values
  let property = 'palette.editable'
  settings.theme(property, defaultValue)

  // test theme value is set on .editorTheme object
  expect(typeof settings.editorTheme).toBe('object')
  expect(settings.editorTheme.palette.editable).toBe(true)
})
