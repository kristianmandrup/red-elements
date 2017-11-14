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

  expect(widgetElem).toBeDefined()
})
