import {
  Bidi
} from '../..'

function create() {
  return new Bidi()
}

let bidi
beforeEach(() => {
  bidi = create()
})

test('Bidi: create', () => {
  expect(typeof bidi).toBe('object')
})
