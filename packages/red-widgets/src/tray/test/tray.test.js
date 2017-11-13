import {
  Tray
} from './imports'

const ctx = {}

function create(ctx) {
  return new Tray(ctx)
}

test('Tray: create', () => {
  let tray = create(ctx)
  t.deepEqual(tray.stack, [])
  t.false(tray.openingTray)
})

test('Tray: show', () => {
  let tray = create(ctx)
  let options = {

  }
  tray.show(options)
  // use nightmare
})

test('Tray: close', async() => {
  let tray = create(ctx)
  await tray.close()
  // use nightmare
})

test('Tray: resize', () => {
  let tray = create(ctx)
  tray.resize()
  // use nightmare
})

test('Tray: showTray', () => {
  let tray = create(ctx)
  let options = {

  }
  tray.showTray(options)
  // use nightmare
})

test('Tray: handleWindowResize', () => {
  let tray = create(ctx)
  tray.handleWindowResize()
  // use nightmare
})
