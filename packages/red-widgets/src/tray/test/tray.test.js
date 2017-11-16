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

test('Tray: create', () => {
  expect(tray).toBeDefined()
})


test('Tray: create has stack', () => {
  expect(tray.stack).toEqual([])
})


test('Tray: create has openingTray', () => {
  expect(tray.openingTray).toEqual([])
})

test('Tray: show', () => {
  let options = {

  }
  tray.show(options)
  expect(tray).toBeDefined()
})

test('Tray: close', async() => {
  await tray.close()
  expect(tray).toBeDefined()
})

test('Tray: resize', () => {
  tray.resize()
  expect(tray).toBeDefined()
})

test('Tray: showTray', () => {
  let options = {

  }
  tray.showTray(options)
  expect(tray).toBeDefined()
})

test('Tray: handleWindowResize', () => {
  tray.handleWindowResize()
  expect(tray).toBeDefined()
})
