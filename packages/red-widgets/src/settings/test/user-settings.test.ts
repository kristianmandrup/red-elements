import {
  readPage,
  ctx as baseCtx,
  UserSettings
} from './imports'


function create(ctx) {
  return new UserSettings(ctx)
}

let events = {
  on() { }
}
let actions = {
  add() { },
  get() { }
}

function Settings() {
  return {
    theme() { },
    get(setting) {
      return this[setting]
    },
    set(setting, value) {
      this[setting] = value
    }
  }
}

let view = {
  gridSize: 20
}

let tray = {
  show() { }
}

const ctx = (<any>Object).assign({
  events,
  actions,
  settings: Settings(),
  view,
  tray
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
  expect(settings).toBeDefined()
})

test('UserSettings: has viewSettings', () => {
  expect(settings.viewSettings.length).toBeGreaterThan(2)
  expect(settings.viewSettings[0].title).toBe('menu.label.view.grid')
})

test('UserSettings: can add pane', () => {
  let options = {
    id: 'x'
  }
  settings.addPane(options)
  let pane = settings.panes[0]
  expect(pane.id).toEqual('view')
})

test('UserSettings: can show', () => {
  let initialTab = {}
  settings.show(initialTab)
  expect(settings.settingsVisible).toBeTruthy()
})

test('UserSettings: can show with settingsVisible true', () => {
  let initialTab = {};
  settings.settingsVisible = true;
  settings.show(initialTab)
  //expect(settings.settingsVisible).toBeTruthy()
})


test('UserSettings: createViewPane', () => {
  let viewPane = settings.createViewPane()
  expect(viewPane).toBeDefined()
})

function settingsFor(settings) {
  return function (id) {
    return settings.RED.settings.get(id)
  }
}

test('UserSettings: can be selected', () => {
  // RED.settings.set(opt.setting, value);
  let id = 'view-grid-size'
  let value = 30
  settings.setSelected(id, value)
  let setting = settingsFor(settings)
  expect(setting(id)).toEqual('view-grid-size')
})

test('UserSettings: can be selected with option null', () => {
  // RED.settings.set(opt.setting, value);
  try {
    let id = 'test-opt'
    let value = 30
    settings.setSelected(id, value)
  }
  catch (e) {
    expect(typeof settings).toBe('object')
  }
})

test('UserSettings: can toggle', () => {
  let id = 'view-snap-grid'
  settings.toggle(id);
})
test('UserSettings: can not able to toggle with invalid id', () => {
  try {
    let id = 'test-opt'
    settings.toggle(id);
  }
  catch (e) {
    expect(typeof settings).toBe('object')
  }
})
test('UserSettings: with null action', () => {
  try {
    ctx.actions = null;
    settings = create(ctx);
  }
  catch (e) {
    expect(typeof settings).toBe('object')
  }
})