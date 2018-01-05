import {
  TextFormat
} from '../..'

function create() {
  return new TextFormat()
}

let tf
beforeEach(() => {
  tf = create()
})

test('TextFormat: create', () => {
  expect(typeof tf).toBe('object')
})

test(`TextFormat: getBounds(segment, src) - w content`, () => {
  // TODO: FIX
  const bounds = {
    start: 'a',
    startPos: 0,
    end: 'c',
    loops: false
  }
  const segment = {
    content: 'abc'
  }
  const src = {
    // TODO: add props
  }
  expect(tf.getBounds(segment, src)).toBe(bounds)
})

test(`TextFormat: getBounds(segment, src) - no content`, () => {
  // TODO: FIX
  const bounds = {
    start: 'a',
    startPos: 0,
    end: 'c',
    loops: false
  }
  const segment = {
    content: '' // is empty invalid?
  }
  const src = {
    // TODO: add props
  }
  expect(tf.getBounds(segment, src)).toBe(bounds)
})
