import {
  RED,
  readPage,
  ctx as baseCtx,
  Tray
} from './imports'

function create() {
  return new Tray()
}
let events = {
  on(property, callback) { },
  emit(property) { }
}
let view = {
  focus() { }
}

let tray
beforeEach(() => {
  tray = create()
})

beforeAll(() => {
  // Searchbox(RED)
  // EditableList(RED)
  document.documentElement.innerHTML = readPage('tray')
})

let button = {
  id: 'my-button',
  text: 'click me',
  class: 'red',
  click() { }
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

test('Tray: create has openingTray to be false', () => {
  expect(tray.openingTray).toBeFalsy()
})

// calls showTray
test('Tray: show', () => {
  tray.show(options.basic)
  expect(tray).toBeDefined()
})

test('Tray: showTray', () => {
  tray.showTray(options.basic)
  expect(tray).toBeDefined()
})

test('Tray: close', () => {
  tray.show(options.basic)
  tray.show(options.basic)
  tray.close().then((closed) => {
    expect(closed).toBeTruthy()
  });
})

test('Tray: close', () => {
  tray.show(options.basic)
  let closed = tray.close()
  tray.close().then((closed) => {
    expect(closed).toBeTruthy()
  });
})


test('Tray: resize', () => {
  tray.resize()
  expect(typeof tray.resize).toBe('function')
})

test('Tray: handleWindowResize', () => {
  tray.handleWindowResize()
  expect(typeof tray.handleWindowResize).toBe('function')
})

test('Tray: append element can be start dragging', () => {
  tray.showTray(options.basic)
  var elements = $(tray.editorStack).children();
  var ele = $(elements[0]).data('ui-draggable');
  ele.options.start(null, {
    position: { top: 50 }
  });
  expect(typeof ele.options.start).toBe('function');
})

test('Tray: append element can be draggable', () => {
  tray.showTray(options.basic)
  var elements = $(tray.editorStack).children();
  var ele = $(elements[0]).data('ui-draggable');
  ele.options.drag(null, {
    position: { top: 50, left: 52 }
  });
  expect(typeof ele.options.start).toBe('function');
})

test('Tray: append element can be stop dragging', () => {
  tray.showTray(options.basic)
  var elements = $(tray.editorStack).children();
  var ele = $(elements[0]).data('ui-draggable');
  ele.options.stop(null, {
    position: { top: 50, left: 52 }
  });
  expect(typeof ele.options.stop).toBe('function');
})
