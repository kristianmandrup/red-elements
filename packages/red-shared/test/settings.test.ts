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

test('settings: properties', () => {
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

test('settings: theme - known value', () => {
  let defaultValue = 'default'
  // test real theme values
  const dark = {
    color: 'blue'
  }

  settings.ctx.settings = {
    editorTheme: {
      dark
    }
  }


  let property = 'dark'
  let result = settings.theme(property, defaultValue)

  // test theme value is set on .editorTheme object
  expect(result).toEqual(dark)
})

test('settings: theme - use default value', () => {
  let defaultValue = 'default'
  // test unknown theme values
  let property = 'palette.unknown'
  let result = settings.theme(property, defaultValue)

  // test theme value is set on .editorTheme object
  expect(result).toEqual(defaultValue)
})
