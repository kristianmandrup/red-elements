import {
  RED,
  readPage,
  ctx as baseCtx,
  UserSettings
} from './imports'


function create(ctx) {
  return new UserSettings(ctx)
}

const ctx = Object.assign({
  // events,
  // actions,
  // utils,
  // nodes
}, baseCtx)

let settings
beforeEach(() => {
  settings = create(ctx)
})

beforeAll(() => {
  // Searchbox(RED)
  // EditableList(RED)

  document.documentElement.innerHTML = readPage('simple')
})

test('UserSettings: create', () => {
  expect(settings.viewSettings).toEqual({})
})

test('UserSettings: addPane', () => {
  let options = {
    id: 'x'
  }
  settings.addPane(options)
  let pane = settings.panes[0]
  expect(pane).toEqual(options)
})

test('UserSettings: show', () => {
  let initialTab = {}
  settings.show(initialTab)
  expect(settings.visible).toBeTruthy()
})

test('UserSettings: createViewPane', () => {
  settings.createViewPane()
  expect(settings.viewPane).toBeDefined()
})

test('UserSettings: setSelected', () => {
  settings.setSelected(id, value)
  expect(settings[id]).toEqual(value)
})

test('UserSettings: toggle', () => {
  let id = 'x'
  settings.toggle(id)
  expect(settings[id].active).toEqual(true)
})
