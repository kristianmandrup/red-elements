import {
  readPage,
  ctx,
  RED,
  controllers
} from '../imports'

const {
  Panel
} = controllers

const clazz = Panel

const {
  log
} = console

beforeAll(() => {
  // Panel has no widget factory, just a class

  // load document with placeholder elements to create widgets (for testing)
  document.documentElement.innerHTML = readPage('simple')
})

describe('Panel', () => {
  test('is a class', () => {
    expect(typeof clazz).toBe('function')
  })
})

function makePanel(opts) {
  try {
    return widgetElem = new Panel({
      id: 'invalid-panel-1',
    })
    true
  } catch (err) {
    return {
      invalid: true,
      err
    }
  }
}


test('Panel: can NOT be created from id unless has 2 child elements', () => {
  let elems = ['invalid-panel-1', 'invalid-panel-2'].map(id => {
    return makePanel({
      id
    })
  })
  elems.map(elem => expect(elem.invalid).toBe(true))
})


test('Panel: can be created from id when has 2 child elements', () => {
  let widgetElem = new Panel({
    id: 'valid-panel',
  })
  widgetElem.resize(20);
  expect(widgetElem).toBeDefined()
  expect(typeof widgetElem.resize).toBe('function')
})

test('Panel: can start drag', () => {
  var panel = $(".red-ui-panels-separator").data('ui-draggable');
  var start = panel.options.start(null, {
    position: { top: 50 }
  });
  expect(typeof panel.options.start).toBe('function')
})

test('Panel: can be draggable', () => {
  var panel = $(".red-ui-panels-separator").data('ui-draggable');
  var drag = panel.options.drag(null, {
    position: { top: 50 }
  });
  expect(typeof panel.options.drag).toBe('function')
})

test('Panel: can stop dragging', () => {
  var panel = $(".red-ui-panels-separator").data('ui-draggable');
  var modifiedHeights = panel.options.stop(null, {});
  expect(modifiedHeights).toBe(true)
  expect(typeof panel.options.stop).toBe('function')
})