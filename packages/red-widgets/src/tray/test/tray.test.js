import {
  RED,
  readPage,
  ctx,
  Tray
} from './imports'

function create(ctx) {
  return new Tray(ctx)
}

const ctx = Object.assign({
  // menu
}, baseCtx)

let tray
beforeEach(() => {
  tray = create(ctx)
})

beforeAll(() => {
  // Searchbox(RED)
  // EditableList(RED)
  document.documentElement.innerHTML = readPage('simple')
})

let button = {
  id: 'my-button',
  text: 'click me',
  class: 'red',
  click() {}
}

let options = {
  basic: {
    title: 'my-title',
    width: 200,
    maximized: false,
    buttons: [
      button
    ]
  }
}

test('Tray: create', () => {
  expect(tray).toBeDefined()
})


test('Tray: has stack', () => {
  expect(tray.stack).toEqual([])
})

test('Tray: has editorStack', () => {
  expect(tray.editorStack).toBeDefined()
})

test('Tray: create has openingTray', () => {
  expect(tray.openingTray).toBeFalsy()
})

// calls showTray
test('Tray: show', () => {
  tray.show(options.basic)
  expect(tray).toBeDefined()
})

test('Tray: close', async() => {
  let closed = await tray.close()
  expect(closed).toBeTruthy()
})

test('Tray: resize', () => {
  tray.resize()
  expect(tray).toBeDefined()
})

test('Tray: showTray', () => {
  tray.showTray(options.basic)
  expect(tray).toBeDefined()
})

test('Tray: handleWindowResize', () => {
  tray.handleWindowResize()
  expect(tray).toBeDefined()
})
